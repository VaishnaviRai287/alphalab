# AlphaLab — Next Stage

> **Upcoming phase:** Phase 1 — Data Foundation
> **Depends on:** Phase 0 complete ✅
> **Last updated:** 2026-07-05

---

## Objective

Build the complete market data layer: everything required to obtain,
validate, and store NIFTY 50 market data in a form that the engine
can use for backtesting.

No factor computation. No backtesting. Data layer only.

---

## Deliverables

| Deliverable | Description |
|---|---|
| `MarketDataProvider` interface | Abstract base class — the rest of the system never imports Yahoo Finance directly |
| `YahooProvider` | Concrete implementation using `yfinance` |
| `Universe` interface | Abstract base class for index constituent resolution |
| `NIFTY50Universe` | Point-in-time constituent resolution — prevents survivorship bias |
| Validation layer | Missing bar detection, schema checks, corporate action flagging |
| DuckDB schema | `ohlcv`, `universe`, `factor_values` tables |
| Ingestion pipeline | `fetch → validate → transform → store` orchestration |
| Phase 1 tests | Unit tests for validation logic, provider mock tests |
| Phase 1 learning notes | DuckDB, provider pattern, universe abstraction, corporate actions |
| Phase 1 ADRs | Market data provider, DuckDB, universe |

---

## Files Expected to Change or Be Created

```
src/alphalab/data/
    providers/
        __init__.py
        base.py             MarketDataProvider abstract interface
        yahoo.py            YahooProvider implementation
    universe/
        __init__.py
        base.py             Universe abstract interface
        nifty50.py          NIFTY50Universe
    validation/
        __init__.py
        checks.py           Missing bar, schema, price jump detection
    pipeline.py             Ingestion orchestration
    storage.py              DuckDB read/write

src/alphalab/common/
    types.py                Ticker, OHLCV, UniverseEntry type definitions
    exceptions.py           DataError, ValidationError

src/alphalab/config/
    settings.py             Settings class (DATABASE_URL, DUCKDB_PATH, etc.)

tests/
    data/
        test_provider.py    YahooProvider unit tests (mocked)
        test_universe.py    NIFTY50Universe unit tests
        test_validation.py  Validation logic unit tests
        test_pipeline.py    Integration test (mock provider → DuckDB)

docs/
    01_ARCHITECTURE.md      Updated: data layer section
    02_CURRENT_STATE.md     Updated: Phase 1 complete
    03_NEXT_STAGE.md        Rewritten: Phase 2
    adr/
        ADR-004-market-data-provider.md
        ADR-005-duckdb.md
        ADR-006-universe-abstraction.md

internal/
    development_log/Phase_01.md
    learning_notes/
        DuckDB.md
        Provider_Pattern.md
        Universe_Abstraction.md
        Corporate_Actions.md
    file_reference/
        data/providers/base.md
        data/providers/yahoo.md
        data/universe/base.md
        data/universe/nifty50.md
        data/validation/checks.md
        data/pipeline.md
        data/storage.md
```

---

## Dependencies

- Phase 0 complete (repository structure, tooling, CI/CD) ✅
- `yfinance` added to `pyproject.toml`
- `duckdb` added to `pyproject.toml`
- `pydantic-settings` added to `pyproject.toml`
- Docker Compose postgres + redis running (for integration tests)

---

## Acceptance Criteria

Phase 1 is complete when all of the following are true:

- [ ] `YahooProvider` fetches NIFTY 50 daily OHLCV for a given date range
- [ ] `NIFTY50Universe` returns point-in-time constituents for a given date
- [ ] The validation layer detects missing bars and flags price jumps > 15%
- [ ] The ingestion pipeline writes clean OHLCV to DuckDB `ohlcv` table
- [ ] DuckDB `universe` table contains point-in-time constituent records
- [ ] `pytest tests/data/ -v` passes with ≥80% coverage on `src/alphalab/data/`
- [ ] All CI checks pass
- [ ] `docs/01_ARCHITECTURE.md` updated with data layer detail
- [ ] Three ADRs written (provider, DuckDB, universe)
- [ ] `internal/development_log/Phase_01.md` complete
- [ ] Learning notes written for DuckDB, provider pattern, universe abstraction

---

## Risks

| Risk | Mitigation |
|---|---|
| Yahoo Finance API rate limiting | Add retry logic with exponential backoff |
| NIFTY 50 historical constituency data not available from Yahoo | Use a static CSV of historical NIFTY 50 constituents as fallback; document limitation |
| Corporate action noise on `.NS` tickers | Flag jumps > 15% for review; do not auto-correct |
| DuckDB concurrent access (multiple test processes) | Use separate DuckDB files per test (tmpdir fixture) |

---

## Key Concepts (Phase 1 Interview Topics)

- **Provider pattern / Strategy pattern** — why abstract the data source
- **Point-in-time universe** — why hardcoded ticker lists cause survivorship bias
- **DuckDB** — columnar vs row-oriented, embedded vs server, OLAP vs OLTP
- **Validation as a pipeline stage** — why validation is not optional
- **Corporate actions** — splits, bonuses, dividends, adjusted close

---

## Implementation Order

1. `src/alphalab/config/settings.py` — Settings class (needed by everything else)
2. `src/alphalab/common/types.py` and `exceptions.py` — shared types
3. `src/alphalab/data/providers/base.py` — abstract interface
4. `src/alphalab/data/providers/yahoo.py` — concrete implementation
5. `src/alphalab/data/universe/base.py` — abstract interface
6. `src/alphalab/data/universe/nifty50.py` — concrete implementation
7. `src/alphalab/data/validation/checks.py` — validation logic
8. `src/alphalab/data/storage.py` — DuckDB read/write
9. `src/alphalab/data/pipeline.py` — orchestration
10. Tests (unit → integration)
11. Documentation (ADRs → architecture update → dev log → learning notes)
