"""
alphalab.dsl.compiler
=====================
Compiles a validated AST into a Pandas-compatible Python callable.

The compiled callable receives a panel DataFrame (all tickers, sorted by
ticker then date). Time-series functions are applied per ticker so data never
leaks across tickers; cross-sectional functions (rank, scale) are applied per
date. If the frame has no ``ticker`` / ``date`` column it is treated as a
single series, which keeps simple single-asset usage working.
"""

from collections.abc import Callable
from typing import Any

import numpy as np
import pandas as pd

from alphalab.common.exceptions import DSLCompilationError
from alphalab.dsl.ast import ASTNode, BinaryOp, FunctionCall, NumberLiteral, Variable


def _as_series(value: Any, df: pd.DataFrame) -> pd.Series:
    """Broadcast scalars so every function operates on an index-aligned Series."""
    if isinstance(value, pd.Series):
        return value
    return pd.Series(float(value), index=df.index)


def _per_ticker(
    series: pd.Series, df: pd.DataFrame, fn: Callable[[pd.Series], pd.Series]
) -> pd.Series:
    """Apply a time-series transform independently for each ticker."""
    if "ticker" not in df.columns:
        return fn(series)
    return series.groupby(df["ticker"], sort=False).transform(fn)


def _date_key(df: pd.DataFrame) -> pd.Series:
    """Grouping key for cross-sectional ops. Without a date column each row is
    its own cross-section, so nothing is ever pooled across time."""
    if "date" in df.columns:
        return df["date"]
    return pd.Series(df.index, index=df.index)


def _per_date_rank(series: pd.Series, df: pd.DataFrame) -> pd.Series:
    """Cross-sectional percentile rank within each date."""
    return series.groupby(_date_key(df)).rank(pct=True)


def _per_date_scale(series: pd.Series, df: pd.DataFrame, target: float) -> pd.Series:
    """Rescale so absolute values sum to ``target`` across tickers on each date."""
    abs_sum = series.abs().groupby(_date_key(df)).transform("sum")
    return series * (target / abs_sum.replace(0, np.nan))


def _per_ticker_corr(
    x: pd.Series, y: pd.Series, df: pd.DataFrame, window: int
) -> pd.Series:
    """Rolling correlation of x and y computed within each ticker."""
    if "ticker" not in df.columns:
        return x.rolling(window).corr(y)
    out = pd.Series(np.nan, index=df.index)
    for idx in df.groupby("ticker", sort=False).groups.values():
        out.loc[idx] = x.loc[idx].rolling(window).corr(y.loc[idx])
    return out


class PandasCompiler:
    """Compiles an AST into a function that takes a DataFrame and returns a Series."""

    def __init__(self, ast: ASTNode):
        self.ast = ast

    def compile(self) -> Callable[[pd.DataFrame], pd.Series]:
        """Returns the compiled execution function."""
        evaluator = self._build(self.ast)

        def execute(df: pd.DataFrame) -> pd.Series:
            return _as_series(evaluator(df), df)

        return execute

    def _build(self, node: ASTNode) -> Callable[[pd.DataFrame], Any]:
        if isinstance(node, NumberLiteral):
            val = node.value
            return lambda df: val

        elif isinstance(node, Variable):
            name = node.name
            return lambda df: df[name]

        elif isinstance(node, BinaryOp):
            left_eval = self._build(node.left)
            right_eval = self._build(node.right)
            op = node.operator

            if op == "+":
                return lambda df: left_eval(df) + right_eval(df)
            elif op == "-":
                return lambda df: left_eval(df) - right_eval(df)
            elif op == "*":
                return lambda df: left_eval(df) * right_eval(df)
            elif op == "/":
                return lambda df: left_eval(df) / right_eval(df)
            else:
                raise DSLCompilationError(f"Unsupported operator: {op}")

        elif isinstance(node, FunctionCall):
            args_eval = [self._build(arg) for arg in node.arguments]
            name_lower = node.name.lower()

            def get_price_series(df: pd.DataFrame) -> pd.Series:
                col = (
                    "close"
                    if "close" in df.columns
                    else ("Price" if "Price" in df.columns else df.columns[0])
                )
                return df[col]

            def arg_series(i: int, df: pd.DataFrame) -> pd.Series:
                return _as_series(args_eval[i](df), df)

            def arg_int(i: int, df: pd.DataFrame) -> int:
                return int(args_eval[i](df))

            if name_lower == "momentum":
                return lambda df: _per_ticker(
                    get_price_series(df), df, lambda s: s.pct_change(arg_int(0, df))
                )
            elif name_lower == "volatility":
                return lambda df: _per_ticker(
                    get_price_series(df),
                    df,
                    lambda s: s.pct_change().rolling(arg_int(0, df)).std(),
                )
            elif name_lower == "rollingmean":
                return lambda df: _per_ticker(
                    get_price_series(df), df, lambda s: s.rolling(arg_int(0, df)).mean()
                )
            elif name_lower == "rollingstd":
                return lambda df: _per_ticker(
                    get_price_series(df), df, lambda s: s.rolling(arg_int(0, df)).std()
                )
            elif name_lower in ("lag", "delay"):
                return lambda df: _per_ticker(
                    arg_series(0, df), df, lambda s: s.shift(arg_int(1, df))
                )
            elif name_lower == "delta":
                return lambda df: _per_ticker(
                    arg_series(0, df), df, lambda s: s - s.shift(arg_int(1, df))
                )
            elif name_lower == "ts_max":
                return lambda df: _per_ticker(
                    arg_series(0, df), df, lambda s: s.rolling(arg_int(1, df)).max()
                )
            elif name_lower == "ts_min":
                return lambda df: _per_ticker(
                    arg_series(0, df), df, lambda s: s.rolling(arg_int(1, df)).min()
                )
            elif name_lower == "ts_rank":
                return lambda df: _per_ticker(
                    arg_series(0, df),
                    df,
                    lambda s: s.rolling(arg_int(1, df)).rank(pct=True),
                )
            elif name_lower == "scale":
                return lambda df: _per_date_scale(
                    arg_series(0, df), df, float(args_eval[1](df))
                )
            elif name_lower == "correlation":
                return lambda df: _per_ticker_corr(
                    arg_series(0, df), arg_series(1, df), df, arg_int(2, df)
                )
            elif name_lower == "rank":
                return lambda df: _per_date_rank(arg_series(0, df), df)
            else:
                raise DSLCompilationError(
                    f"Compilation for function {node.name} is not implemented."
                )

        raise DSLCompilationError(
            f"Cannot compile unknown node type: {type(node).__name__}"
        )
