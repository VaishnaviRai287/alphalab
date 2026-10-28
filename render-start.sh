#!/bin/bash
# 1. Run migrations and ingest market data if DuckDB is empty
python scripts/bootstrap.py

# 2. Queue recomputation for factors with missing or outdated results
#    (engine version bump, or jobs orphaned by a restart). Never blocks startup.
python scripts/rerun_stale_factors.py || echo "Stale-factor check failed; continuing startup"

# 3. Start Celery worker in the background
celery -A alphalab.worker.celery worker --pool=solo --loglevel=info &

# 4. Start FastAPI server in the foreground
uvicorn alphalab.api.main:app --host 0.0.0.0 --port ${PORT:-8000}
