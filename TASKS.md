# AlphaLab — Tasks

> **Current phase:** Phase 0 — Engineering Foundation
> **Status:** Complete ✅
> **Updated:** 2026-07-05

This file tracks the granular task checklist for the current phase.
It is updated as work progresses. It is not a roadmap (see `docs/00_MASTER_PLAN.md`)
and not a milestone tracker (see GitHub Project board).

---

## Phase 0 — Engineering Foundation

### Repository Structure
- [x] `.gitignore` — excludes `internal/`, `.env`, caches
- [x] `.python-version` — pins Python 3.12
- [x] `.editorconfig` — consistent formatting
- [x] `.pre-commit-config.yaml` — ruff, file hygiene, YAML/TOML validation
- [x] `pyproject.toml` — hatchling, ruff, mypy, pytest configured
- [x] `LICENSE` — MIT
- [x] `web/.gitkeep` — Phase 8 placeholder

### Source Package Skeletons
- [x] `src/alphalab/__init__.py`
- [x] `src/alphalab/api/__init__.py`
- [x] `src/alphalab/data/__init__.py`
- [x] `src/alphalab/dsl/__init__.py`
- [x] `src/alphalab/engine/__init__.py`
- [x] `src/alphalab/worker/__init__.py`
- [x] `src/alphalab/common/__init__.py`
- [x] `src/alphalab/config/__init__.py`
- [x] `src/alphalab/utils/__init__.py`

### Tests
- [x] `tests/__init__.py`
- [x] `tests/conftest.py`
- [x] `tests/test_package.py` — 11 smoke tests (all pass)

### Infrastructure
- [x] `infra/docker-compose.yml` — PostgreSQL 16 + Redis 7 + pgAdmin (optional)
- [x] `infra/.env.example` — all required environment variables documented

### Public Documentation
- [x] `docs/00_MASTER_PLAN.md`
- [x] `docs/01_ARCHITECTURE.md`
- [x] `docs/02_CURRENT_STATE.md`
- [x] `docs/03_NEXT_STAGE.md`
- [x] `docs/adr/ADR-001-repository-structure.md`
- [x] `docs/adr/ADR-002-documentation-policy.md`
- [x] `docs/adr/ADR-003-project-architecture.md`
- [x] `docs/diagrams/.gitkeep`

### Private Documentation (internal/ — gitignored)
- [x] `internal/development_log/Phase_00.md`
- [x] `internal/learning_notes/Phase_00_Engineering_Foundation.md`
- [x] `internal/interview_defense/README.md`
- [x] `internal/file_reference/README.md`

### GitHub
- [x] `.github/CODEOWNERS`
- [x] `.github/PULL_REQUEST_TEMPLATE.md`
- [x] `.github/ISSUE_TEMPLATE/bug_report.md`
- [x] `.github/ISSUE_TEMPLATE/feature_request.md`
- [x] `.github/ISSUE_TEMPLATE/task.md`
- [x] `.github/workflows/lint.yml`
- [x] `.github/workflows/test.yml`
- [x] `.github/workflows/install.yml`

### Root Documentation
- [x] `README.md`
- [x] `CONTRIBUTING.md`
- [x] `TASKS.md` (this file)

### Definition of Done Checklist
- [x] All files created and non-empty
- [x] `pip install -e ".[dev]"` succeeds
- [x] `pytest tests/ -v` — 11 passed
- [x] `ruff check .` — 0 errors
- [x] `mypy src/` — 0 errors
- [x] `pre-commit run --all-files` — all hooks pass
- [x] `docker compose -f infra/docker-compose.yml config` — valid
- [x] `git status` — `internal/` not tracked, `.env` not tracked
- [x] `docs/02_CURRENT_STATE.md` reflects Phase 0 complete
- [x] `docs/03_NEXT_STAGE.md` describes Phase 1
- [x] `internal/development_log/Phase_00.md` written
- [x] `internal/learning_notes/Phase_00_Engineering_Foundation.md` written

### GitHub Steps (You do these manually)
- [ ] Create repository at https://github.com/VaishnaviRai287/alphalab
- [ ] `git init && git add . && git commit -m "chore(repo): Phase 0 engineering foundation"`
- [ ] `git push -u origin main`
- [ ] Create `dev` branch and push
- [ ] Configure branch protection on `main`
- [ ] Create GitHub Project board "AlphaLab"
- [ ] Create milestones: Phase 0 → Phase 11
- [ ] Configure labels

---

## Next Phase

→ Phase 1 — Data Foundation
→ See [`docs/03_NEXT_STAGE.md`](docs/03_NEXT_STAGE.md)
