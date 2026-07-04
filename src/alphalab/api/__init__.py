"""
alphalab.api — FastAPI Application
===================================

Phase: 6 (Backend API)

Responsibility
--------------
This package contains the complete FastAPI application: HTTP routes,
request/response models, middleware, dependency injection, error handling,
and authentication.

It is the single entry point for all external HTTP communication.
No business logic lives here — the API layer delegates immediately to
the appropriate engine, DSL, or data service.

Planned Contents (Phase 6)
--------------------------
routes/
    experiments.py   POST/GET /experiments
    factors.py       POST/GET /factors, POST /factors/{id}/backtest
    robustness.py    POST/GET /factors/{id}/robustness
    leaderboard.py   GET /leaderboard
    reports.py       GET /factors/{id}/report
deps.py             FastAPI dependency injection (DB sessions, auth)
middleware.py       CORS, request logging, error formatting
app.py              FastAPI application factory

Phase 0 Status
--------------
Empty skeleton. Do not add any code until Phase 6.
"""
