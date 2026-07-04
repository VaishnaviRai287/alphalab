"""
AlphaLab — Robustness-Aware Factor Research Platform
=====================================================

AlphaLab is an evaluation platform that answers one research question:

    "Can we distinguish genuinely robust predictive factors from overfit
    ones using systematic stress testing?"

Finance is the application domain. Evaluation is the discipline.

Package Structure
-----------------
alphalab.api        FastAPI application — HTTP routes, middleware (Phase 6)
alphalab.data       Market data layer — providers, universe, ingestion (Phase 1)
alphalab.dsl        Factor DSL compiler — lexer, parser, AST, validator (Phase 2)
alphalab.engine     Evaluation engines — backtesting, robustness (Phase 3, 5)
alphalab.worker     Celery task definitions — async job execution (Phase 4)
alphalab.common     Shared types, exceptions, base classes (Phase 1+)
alphalab.config     Settings and environment loading (Phase 1)
alphalab.utils      Pure utility functions (Phase 1+)

Phase 0 Status
--------------
This package is a skeleton. No business logic exists yet.
All sub-packages contain only their module docstrings.
Implementation begins in Phase 1.
"""

__version__ = "0.1.0"
