"""
alphalab.dsl — Factor DSL Compiler
====================================

Phase: 2 (Factor DSL)

Responsibility
--------------
This package implements a domain-specific language (DSL) for defining
alpha factors. Users write expressions like:

    Momentum(20) / Volatility(30)

The DSL compiler transforms this string into a validated, executable
Python function — without ever using eval(), exec(), or arbitrary imports.

Why a DSL?
----------
- Safety: users cannot execute arbitrary Python code
- Leakage detection: the compiler statically enforces that no expression
  uses future data (look-ahead bias)
- Complexity bounds: the compiler rejects expressions that are
  computationally intractable
- LLM compatibility (future): a closed grammar is far easier to generate
  correctly from a language model than arbitrary Python

Compiler Pipeline
-----------------
    DSL string
        ↓
    Lexer      — tokenises the string into a stream of tokens
        ↓
    Parser     — constructs an Abstract Syntax Tree (AST)
        ↓
    Validator  — checks for syntax errors, leakage, complexity violations
        ↓
    Compiler   — transforms the AST into an executable Python callable
        ↓
    Executable factor function

Supported Primitives (v1)
--------------------------
    Momentum(n)      n-period price momentum
    Volatility(n)    n-period rolling volatility (standard deviation)
    RollingMean(n)   n-period rolling mean
    RollingStd(n)    n-period rolling standard deviation

Arithmetic operators: + - * /

Planned Contents (Phase 2)
--------------------------
lexer.py        Tokeniser — string → token stream
parser.py       Parser — token stream → AST
ast_nodes.py    AST node type definitions
validator.py    Semantic validator — leakage, complexity, syntax
compiler.py     Code generator — AST → executable callable
exceptions.py   DSL-specific exceptions (ParseError, ValidationError)

Phase 0 Status
--------------
Empty skeleton. Do not add any code until Phase 2.
"""
