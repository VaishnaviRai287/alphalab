# Phase 06 — Backend API Expansion

## Goal
Expand the FastAPI backend to support frontend screens, including Factor Leaderboards and Factor Details endpoints, storing complex output objects cleanly.

## Execution Summary
- Added `equity_curve` and `perturbation_grid` JSON columns to PostgreSQL models (`BacktestResult` and `RobustnessResult`).
- Generated and applied Alembic migration `002_add_series_json.py`.
- Introduced distinct DTO layers (Response schemas like `LeaderboardResponse`, `BacktestResponse`) to decouple internal database architecture from the external API contract.
- Built a paginated `GET /factors/leaderboard` endpoint with dynamic sorting capabilities (Sharpe, IC, Overall Score).
- Built granular endpoints (`/factors/{id}`, `/factors/{id}/backtest`, `/factors/{id}/robustness`) to cleanly serve artifact data.
- Enriched `RobustnessEvaluator` output to include `dominant_failure`, `explanation`, and `recommendations` based on the heuristics implemented in Phase 5.
- Defined `ADR-014` documenting that experiment results are intentionally overwritten on reruns (not versioned) to keep the data model simple.
- Created `test_factors.py` for comprehensive integration testing using synchronous `TestClient` and `AsyncMock` to validate pagination and payload shapes.

## Architectural Decisions
1. **JSON Artifact Storage:** Rather than normalizing timeseries data (equity curve) or perturbation arrays into their own row-level tables, we stored them as structured JSON objects. Since these artifacts are only accessed in their entirety and belong explicitly to a single experiment run, normalization would have been unnecessary over-engineering.
2. **Experiment Overwrites (ADR-014):** Results belong to the factor. If a factor is re-evaluated, its backtest and robustness results are upserted. Historical "runs" are not tracked to minimize complexity for a V1 prototype.
3. **DTO Separation:** The API enforces a strict separation between SQLAlchemy database models and Pydantic response schemas. This prevents unintentional leakage of internal DB structures and protects the frontend from backend refactors.

## Lessons Learned & Interview Defense
- **Defending the JSON choice:** When asked why we used JSON instead of a timeseries DB or a normalized `equity_curve_points` table: "Because the access pattern strictly retrieves the entire curve per experiment. We don't query individual points, we don't join against them. Normalizing would be an antipattern for this specific requirement, leading to slower reads and more complex ORM logic."
- **Defending the DTO layer:** "Never let database schemas dictate your API contract. By explicitly mapping the SQLAlchemy results to Pydantic models, we protect the frontend from future database schema changes and tightly control exactly what data is exposed over the network."
- **Pagination logic:** Implementing sorting and limit/offset at the database level using SQLAlchemy is crucial for the leaderboard, since querying all factors into memory would not scale.

## Status
- **Result:** Complete and committed.
- **Ready for:** Phase 7 (Research Reports) and eventually frontend integration.
