# AlphaLab

**A robustness-aware factor research platform for NIFTY 50 equities.**

AlphaLab answers one question:

> *"Can we distinguish genuinely robust predictive factors from overfit ones using systematic stress testing?"*

Finance is the application domain. Evaluation is the discipline.

---

## What AlphaLab Does

A quantitative analyst defines a factor using AlphaLab's domain-specific language:

```
Momentum(20) / Volatility(30)
```

AlphaLab:

1. **Compiles** the expression into a validated, executable function (no `eval`, no arbitrary imports)
2. **Backtests** it using walk-forward validation on NIFTY 50 historical data — producing Sharpe, IC, Drawdown, and more
3. **Stress-tests** it by perturbing price/volume data with noise and missing observations
4. **Scores** its robustness: `Average Performance Under Stress / Original Performance`
5. **Reports** the result: metrics, equity curve, robustness heatmap, and failure reasoning — automatically

A factor that survives stress testing is likely capturing a real market dynamic.
A factor that collapses under small perturbations is likely overfit.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js Frontend                                           │
│  Factor Leaderboard  |  Factor Detail + Research Report     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST
┌──────────────────────────────▼──────────────────────────────┐
│  FastAPI Application                                        │
│  /experiments  /factors  /backtest  /robustness  /report    │
└──────────────┬──────────────────────────────┬───────────────┘
               │ PostgreSQL                   │ Redis (enqueue)
┌──────────────▼──────────────┐  ┌───────────▼───────────────┐
│  PostgreSQL                 │  │  Celery Worker            │
│  users, experiments,        │◄─│  run_backtest()           │
│  factors, results           │  │  run_robustness()         │
└─────────────────────────────┘  └───────────┬───────────────┘
                                             │ DuckDB (read)
                                 ┌───────────▼───────────────┐
                                 │  DuckDB                   │
                                 │  OHLCV, universe,         │
                                 │  factor_values            │
                                 └───────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Why |
|---|---|---|
| API | FastAPI | Async, Python-native, OpenAPI generation |
| Task Queue | Celery + Redis | 30–60s backtests require async execution |
| Metadata DB | PostgreSQL (Neon) | Relational metadata, ACID transactions |
| Analytical DB | DuckDB | Columnar, embedded, fast rolling-window computation |
| Auth | JWT (PyJWT) | Stateless, no session storage required |
| Frontend | Next.js | TypeScript, SSR, Vercel deployment |
| CI/CD | GitHub Actions | Repository-native |
| Deployment | Render + Vercel + Neon | Zero-ops, free tier |

---

## Quickstart

### Prerequisites

- Python 3.12
- Docker and Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/VaishnaviRai287/alphalab.git
cd alphalab
```

### 2. Install the package

```bash
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### 3. Configure environment

```bash
cp infra/.env.example .env
# Edit .env — fill in POSTGRES_PASSWORD, REDIS_PASSWORD, etc.
```

### 4. Start infrastructure

```bash
docker compose -f infra/docker-compose.yml up -d
```

### 5. Run tests

```bash
pytest tests/ -v
```

### 6. Install pre-commit hooks (first time only)

```bash
pre-commit install
```

---

## Repository Structure

```
AlphaLab/
├── src/alphalab/          Python package (src layout)
│   ├── api/               FastAPI application (Phase 6)
│   ├── data/              Market data, ingestion (Phase 1)
│   ├── dsl/               Factor DSL compiler (Phase 2)
│   ├── engine/            Backtest + Robustness engines (Phase 3, 5)
│   ├── worker/            Celery tasks (Phase 4)
│   ├── common/            Shared types, exceptions
│   ├── config/            Settings
│   └── utils/             Utility functions
├── web/                   Next.js frontend (Phase 8)
├── tests/                 Test suite
├── infra/                 Docker Compose, environment template
├── docs/                  Public documentation
└── .github/               CI/CD, issue templates
```

---

## Phase Roadmap

| Phase | Objective | Status |
|---|---|---|
| 0 | Engineering Foundation | ✅ Complete |
| 1 | Data Foundation | 🔲 Next |
| 2 | Factor DSL | 🔲 |
| 3 | Backtesting Engine | 🔲 |
| 4 | Background Execution | 🔲 |
| 5 | Robustness Engine | 🔲 |
| 6 | Backend API | 🔲 |
| 7 | Research Reports | 🔲 |
| 8 | Frontend | 🔲 |
| 9 | Testing | 🔲 |
| 10 | Deployment | 🔲 |
| 11 | Polish & Interview Readiness | 🔲 |

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/00_MASTER_PLAN.md`](docs/00_MASTER_PLAN.md) | Project constitution — thesis, goals, roadmap |
| [`docs/01_ARCHITECTURE.md`](docs/01_ARCHITECTURE.md) | System architecture — components, data flow, schema |
| [`docs/02_CURRENT_STATE.md`](docs/02_CURRENT_STATE.md) | Current phase status |
| [`docs/03_NEXT_STAGE.md`](docs/03_NEXT_STAGE.md) | Immediate next milestone |
| [`docs/adr/`](docs/adr/) | Architectural Decision Records |

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the git workflow, commit convention,
PR process, and documentation policy.

---

## License

MIT — see [`LICENSE`](LICENSE).
