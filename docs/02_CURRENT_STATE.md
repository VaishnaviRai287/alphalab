# AlphaLab — Current State

> **Current phase:** Phase 8 — Next.js Frontend 🚧 In Progress
> **Next phase:** Polish & Launch
> **Last updated:** 2026-10-28

---

## Correctness & Hardening Pass (2026-10-28)

Fixes from a full codebase audit. Results computed before this pass are not
comparable with new ones, so this pass bumps `ENGINE_VERSION` to 2
(`src/alphalab/engine/version.py`). Every stored result records the version
that produced it, and on each start `render-start.sh` runs
`scripts/rerun_stale_factors.py`, which queues factors with missing or older
results (including jobs orphaned by a restart). Bump `ENGINE_VERSION` in any
future change that alters computed results.

**Research integrity**
*   Robustness iterations now use distinct seeds (they were identical, so the 18-run grid was really 6 runs).
*   Window/shift arguments are constant-folded before the look-ahead check, closing bypasses such as `delay(close, 0-1)`; data-dependent windows and unknown variables are rejected.
*   `scale()` normalizes across stocks per date instead of over each stock's full (future) history.
*   `rank()` is a real cross-sectional operator that composes anywhere in a formula (it used to be detected by string search and applied to the whole signal).
*   Formulas are evaluated once over the full panel; time-series ops group by ticker internally.
*   Point-in-time universe: `nifty50_history.csv` now holds the full 2019–2025 NIFTY 50 history (67 stocks, see `NIFTY50_SOURCES.md`), every past member is ingested, and stocks only receive weight on days they were in the index.
*   Ingestion keeps stocks that listed mid-window (pre-listing NaN rows used to get the whole stock dropped).

**API & config**
*   Formulas are compiled on submission; invalid or leaking formulas return 422.
*   Factor detail routes require login; the leaderboard stays public. History shows only the user's own factors.
*   Settings accept the documented env names (`JWT_SECRET_KEY`, `JWT_EXPIRY_MINUTES`) and the legacy ones; CORS is restricted via `CORS_ORIGINS`; `async_database_url` keeps unrelated query params.
*   Migration `003_verdicts_and_stressed_curve` replaces the ALTER TABLE statements that ran at API startup and drops the unused `stressed_equity_curves` column.

**Frontend**
*   Failed experiments show an error instead of an endless spinner; unscored factors show "Pending"; the login cookie expires with the JWT; the lab formula guide and the Flow page match the code.
*   No more synthetic numbers in the results UI: the IC chart plots the real monthly IC series (now stored with each backtest), and the robustness breakdown recomputes the score from the stored grid instead of back-deriving a "stressed average".
*   Frontend lint is clean (`eslint --max-warnings 0`): API responses are typed in `web/src/lib/types.ts`, the landscape tooltip is no longer recreated on every render, and the avatar is drawn locally instead of loaded from ui-avatars.com.

---

## Phase 8 Summary (In Progress)

Phase 8 focuses on building the Next.js frontend to interact with the backend APIs:
1. **Factor Leaderboard & Dashboard**: Created a highly polished client dashboard displaying platform-wide "Research Grade" metrics.
2. **Detail Retrieval**: Built the individual factor results view integrating the "Strategy Grade Rating" to evaluate specific algorithm robustness and Sharpe ratio.
3. **Methodology & Flow**: Revamped the flow page and methodology documentation for transparent algorithmic logic, integrating a Python-syntax styling for grading algorithms.
4. **UI Polishing**: Standardized equal-sized top navigation buttons, fixed tooltip overlay components, and cleaned up development scratch files.

---

## What Is Complete

### Repository Structure
*   `src/alphalab/data/`: Data ingestion, validation, and storage. (Phase 1)
*   `src/alphalab/dsl/`: Lexer, Parser, AST, Validator, and Pandas Compiler. (Phase 2)
*   `src/alphalab/engine/`: Backtesting evaluator, portfolio constructor, metrics, and robustness evaluator. (Phase 3, 5)
*   `src/alphalab/worker/`: Celery task definitions and execution logic. (Phase 4, 5)
*   `src/alphalab/api/`: FastAPI routes, async db connections, model schemas, token authentication, and factor endpoints. (Phase 1, 6)
*   `web/`: Next.js frontend application. (Phase 8 - In Progress)
*   `alembic/`: Database migration versions.
*   `tests/`: Extensive test suite covering data, endpoints, hashing, celery, backtest/robustness calculations, and the DSL compiler.

### Configuration & Tooling
*   All linter, formatting, and static typing checks pass.

---

## What Does Not Exist Yet

| Component | Phase |
|---|---|
| Research report generator | 7 |

---

## Next

→ See [`docs/03_NEXT_STAGE.md`](03_NEXT_STAGE.md) for Phase 7 — Research Reports (or remaining Phase 8 tasks).
