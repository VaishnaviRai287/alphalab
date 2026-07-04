"""
alphalab.worker — Celery Task Definitions
==========================================

Phase: 4 (Background Execution)

Responsibility
--------------
This package contains all Celery task definitions. Its sole responsibility
is to bridge the HTTP request cycle and the long-running computation engines.

Why Celery?
-----------
A full NIFTY 50 backtest over several years takes 30–60 seconds.
This is unacceptably long for a synchronous HTTP response. Celery moves
this computation out of the request path into a background worker process.

The justification is empirical: Celery is introduced AFTER measuring
actual backtest latency (Phase 3), not assumed to be necessary upfront.
This is a deliberate discipline: async infrastructure must be earned by
measured latency, not added speculatively.

Architecture
------------
FastAPI route handler
    → enqueues Celery task → returns job ID immediately (202 Accepted)

Redis broker
    → delivers task to Celery worker process

Celery worker
    → executes backtest / robustness engine
    → stores result in PostgreSQL
    → marks job status: COMPLETED or FAILED

FastAPI poll endpoint
    → client polls GET /factors/{id}/backtest
    → returns result when ready

Configuration
-------------
Single queue, single worker for Phase 4.
Multi-queue priority tiers are explicitly deferred (see ADR-003).

Planned Contents (Phase 4)
--------------------------
celery_app.py       Celery application instance and configuration
tasks/
    backtest.py     run_backtest(factor_id: str) → BacktestResult
    robustness.py   run_robustness(factor_id: str) → RobustnessResult

Phase 0 Status
--------------
Empty skeleton. Do not add any code until Phase 4.
"""
