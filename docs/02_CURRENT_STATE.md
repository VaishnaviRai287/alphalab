# AlphaLab — Current State

> **Current phase:** Phase 0 — Engineering Foundation ✅ Complete
> **Next phase:** Phase 1 — Data Foundation
> **Last updated:** 2026-07-05

---

## Phase 0 Summary

Phase 0 established the complete engineering foundation for AlphaLab.
No business logic was introduced. The repository is now ready for Phase 1.

---

## What Is Complete

### Repository Structure
- `src/alphalab/` package with eight sub-packages (all skeletons)
- `web/` directory placeholder for Phase 8 frontend
- `tests/` directory with conftest and Phase 0 smoke tests
- `infra/` directory with Docker Compose and env template
- `docs/` with four core documents and three ADRs
- `.github/` with CI workflows, issue templates, PR template, CODEOWNERS

### Configuration and Tooling
- `pyproject.toml` — hatchling build, ruff, mypy, pytest configured
- `.gitignore` — `internal/` and `.env` never tracked
- `.python-version` — Python 3.12 pinned
- `.editorconfig` — consistent formatting across editors
- `.pre-commit-config.yaml` — ruff, file hygiene, YAML/TOML validation

### Infrastructure
- `infra/docker-compose.yml` — PostgreSQL 16 + Redis 7 (always on)
- pgAdmin 4 — optional, behind `--profile tools`
- `infra/.env.example` — all required environment variables documented

### CI/CD (GitHub Actions)
- `lint.yml` — ruff check + mypy on every push and PR
- `test.yml` — pytest with coverage on every push and PR
- `install.yml` — clean pip install verification

### Documentation
- `docs/00_MASTER_PLAN.md` — project constitution
- `docs/01_ARCHITECTURE.md` — system architecture
- `docs/02_CURRENT_STATE.md` — this file
- `docs/03_NEXT_STAGE.md` — Phase 1 plan
- `docs/adr/ADR-001` through `ADR-003`

### Testing
- `tests/test_package.py` — 11 import and structure smoke tests
- All 11 tests pass

---

## What Does Not Exist Yet

| Component | Phase |
|---|---|
| Market data provider (Yahoo Finance) | 1 |
| Universe abstraction (NIFTY 50) | 1 |
| DuckDB schema and ingestion | 1 |
| Factor DSL compiler | 2 |
| Backtesting engine | 3 |
| Celery task queue | 4 |
| Robustness engine | 5 |
| FastAPI application | 6 |
| Research report generator | 7 |
| Next.js frontend | 8 |

This is intentional. Phase 0 is infrastructure only.

---

## Technical Debt

None introduced in Phase 0. The engineering foundation is clean.

---

## Known Limitations

- The package installs cleanly but does nothing at runtime
- Docker Compose services start but are not yet connected to any application
- Pre-commit hooks require `pre-commit install` after cloning

---

## Repository Health

| Check | Status |
|---|---|
| `pytest tests/` | ✅ 11 passed |
| `ruff check .` | ✅ 0 errors |
| `mypy src/` | ✅ 0 errors |
| `pre-commit run --all-files` | ✅ All hooks pass |
| `docker compose config` | ✅ Valid |
| `pip install -e ".[dev]"` | ✅ Clean install |
| `internal/` in git status | ✅ Not tracked |
| `.env` in git status | ✅ Not tracked |

---

## Next

→ See [`docs/03_NEXT_STAGE.md`](03_NEXT_STAGE.md) for Phase 1 — Data Foundation.
