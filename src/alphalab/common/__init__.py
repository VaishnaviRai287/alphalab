"""
alphalab.common — Shared Types, Exceptions, and Base Classes
=============================================================

Phase: 1+ (populated incrementally as needed)

Responsibility
--------------
This package contains code that is genuinely shared across two or more
other packages and has no natural home in any specific package.

The rule for adding to this package:
    If a type, exception, or base class is used by exactly one package,
    it belongs in that package. Only move it here when a second package
    needs it. Premature generalisation creates unnecessary coupling.

Planned Contents (added as needed from Phase 1 onwards)
--------------------------------------------------------
types.py        Shared domain types (Ticker, Date, FactorValue, etc.)
exceptions.py   Base exception hierarchy for AlphaLab
                    AlphaLabError (base)
                    DataError
                    DSLError
                    EngineError
                    WorkerError
enums.py        Shared enumerations (ExperimentStatus, JobStatus, etc.)
constants.py    Project-wide constants (e.g. NIFTY50_INDEX_NAME)

Phase 0 Status
--------------
Empty skeleton. Do not add any code until a genuine cross-package need
arises in Phase 1 or later.
"""
