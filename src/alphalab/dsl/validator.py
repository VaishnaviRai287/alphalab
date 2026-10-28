"""
alphalab.dsl.validator
======================
Statically analyzes the AST for look-ahead bias and validity.
"""

from alphalab.common.exceptions import DataLeakageError, DSLCompilationError
from alphalab.dsl.ast import ASTNode, BinaryOp, FunctionCall, NumberLiteral, Variable
from alphalab.dsl.registry import (
    SUPPORTED_VARIABLES,
    get_expected_arity,
    is_supported_function,
)

# Argument index holding the window/shift size, per function (lower-cased)
_WINDOW_ARG_INDEX: dict[str, int] = {
    "momentum": 0,
    "volatility": 0,
    "rollingmean": 0,
    "rollingstd": 0,
    "lag": 1,
    "delay": 1,
    "delta": 1,
    "ts_max": 1,
    "ts_min": 1,
    "ts_rank": 1,
    "correlation": 2,
}

# Functions where a shift of 0 is allowed (identity); all others need > 0
_ZERO_ALLOWED = {"lag", "delay"}


def fold_constant(node: ASTNode) -> float | None:
    """Evaluate a constant sub-expression, or return None if it depends on data."""
    if isinstance(node, NumberLiteral):
        return node.value
    if isinstance(node, BinaryOp):
        left = fold_constant(node.left)
        right = fold_constant(node.right)
        if left is None or right is None:
            return None
        if node.operator == "+":
            return left + right
        if node.operator == "-":
            return left - right
        if node.operator == "*":
            return left * right
        if node.operator == "/":
            if right == 0:
                raise DSLCompilationError("Division by zero in constant expression")
            return left / right
    return None


class StaticValidator:
    """Traverses the AST and raises exceptions on invalid syntax or logic."""

    def __init__(self, ast: ASTNode):
        self.ast = ast

    def validate(self) -> None:
        """Runs all validations on the AST."""
        self._visit(self.ast)

    def _visit(self, node: ASTNode) -> None:
        if isinstance(node, BinaryOp):
            self._visit(node.left)
            self._visit(node.right)
        elif isinstance(node, FunctionCall):
            self._validate_function(node)
            for arg in node.arguments:
                self._visit(arg)
        elif isinstance(node, Variable):
            if node.name not in SUPPORTED_VARIABLES:
                raise DSLCompilationError(
                    f"Unknown variable: {node.name}. "
                    f"Supported: {', '.join(sorted(SUPPORTED_VARIABLES))}"
                )
        elif isinstance(node, NumberLiteral):
            pass
        else:
            raise DSLCompilationError(f"Unknown AST node type: {type(node).__name__}")

    def _validate_function(self, node: FunctionCall) -> None:
        if not is_supported_function(node.name):
            raise DSLCompilationError(f"Unsupported function: {node.name}")

        expected_arity = get_expected_arity(node.name)
        if expected_arity != -1 and len(node.arguments) != expected_arity:
            raise DSLCompilationError(
                f"Function {node.name} expects {expected_arity} arguments, "
                f"got {len(node.arguments)}"
            )

        name_lower = node.name.lower()

        if name_lower == "scale" and fold_constant(node.arguments[1]) is None:
            raise DSLCompilationError(
                f"Target for {node.name} must be a constant number"
            )

        # Window/shift sizes must be statically known so look-ahead can be ruled
        # out before execution. Constant expressions such as (0 - 1) are folded
        # first, so they cannot be used to smuggle in a negative shift.
        idx = _WINDOW_ARG_INDEX.get(name_lower)
        if idx is None:
            return

        val = fold_constant(node.arguments[idx])
        if val is None:
            raise DSLCompilationError(
                f"Window/shift size for {node.name} must be a constant integer"
            )
        if name_lower in _ZERO_ALLOWED:
            if val < 0:
                raise DataLeakageError(
                    f"Temporal look-ahead bias detected in {node.name}: negative shift ({val})"
                )
        elif val <= 0:
            raise DataLeakageError(
                f"Invalid window size for {node.name}: {val} (must be > 0)"
            )
        if not float(val).is_integer():
            raise DSLCompilationError(
                f"Window/shift size for {node.name} must be an integer, got {val}"
            )
