# Contributing to AlphaLab

Thank you for contributing to AlphaLab.

This document is the engineering workflow bible for this project.
Read it in full before touching any file.

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Git Workflow](#2-git-workflow)
3. [Commit Convention](#3-commit-convention)
4. [Pull Request Process](#4-pull-request-process)
5. [PR Review Checklist](#5-pr-review-checklist)
6. [Documentation Update Matrix](#6-documentation-update-matrix)
7. [Phase Guard — AI Guardrail](#7-phase-guard--ai-guardrail)
8. [Team Workflow](#8-team-workflow)
9. [Code Quality Standards](#9-code-quality-standards)

---

## 1. Philosophy

AlphaLab is an evaluation platform. Finance is the application domain.

Every contribution must serve the research thesis:

> *"Can we distinguish genuinely robust predictive factors from overfit ones using systematic stress testing?"*

Before writing any code, ask:

> *Does this help answer the research thesis?*

If the answer is no — do not build it. Document why it was deferred instead.

If you are unsure whether a change aligns with the thesis, check
[`docs/00_MASTER_PLAN.md`](docs/00_MASTER_PLAN.md) before proceeding.

---

## 2. Git Workflow

### Branch Structure

```
main        ← Protected. Production-ready. Never commit directly. Ever.
  └── dev   ← Integration branch. All PRs merge here first.
        └── feature/<scope>-<description>    ← All work happens here
            bug/<scope>-<description>
            chore/<scope>-<description>
```

### Rules

- `main` is protected. Direct pushes are blocked. No exceptions.
- `dev` is the base branch for all feature branches.
- All feature branches are created from `dev`, not from `main`.
- `main` receives PRs from `dev` only, at phase boundaries.
- Branches are deleted after their PR is merged.

### Branch Naming

```
feature/<scope>-<short-description>
bug/<scope>-<short-description>
chore/<scope>-<short-description>
```

**Scope** matches the package or area being changed:

| Scope | Area |
|---|---|
| `repo` | Repository structure, root files |
| `docs` | Documentation only |
| `infra` | Docker Compose, infrastructure |
| `ci` | GitHub Actions workflows |
| `api` | `src/alphalab/api/` |
| `data` | `src/alphalab/data/` |
| `dsl` | `src/alphalab/dsl/` |
| `engine` | `src/alphalab/engine/` |
| `worker` | `src/alphalab/worker/` |
| `config` | `src/alphalab/config/` |
| `tests` | `tests/` |

**Examples:**

```
feature/data-yahoo-provider
feature/dsl-lexer
bug/engine-sharpe-zero-returns
chore/ci-add-mypy-strict
chore/repo-phase-0-foundation
```

### Common Git Commands

```bash
# Start a new feature
git checkout dev
git pull origin dev
git checkout -b feature/data-yahoo-provider

# Commit work
git add .
git commit -m "feature(data): implement Yahoo Finance provider"

# Push branch
git push -u origin feature/data-yahoo-provider

# Open PR on GitHub targeting dev
```

---

## 3. Commit Convention

### Format

```
<type>(<scope>): <short description>

[optional body]
```

### Types

| Type | When to use |
|---|---|
| `feature` | New capability |
| `bug` | Bug fix |
| `chore` | Maintenance, tooling, documentation |

### Rules

- All lowercase
- Present tense: "implement", not "implemented" or "implementing"
- No period at the end of the subject line
- Subject line ≤ 72 characters
- Body is optional but encouraged for non-obvious changes

### Examples

```
chore(repo): Phase 0 engineering foundation

feature(data): implement Yahoo Finance provider
Adds YahooProvider implementing the MarketDataProvider interface.
Fetches daily OHLCV for .NS tickers. Includes retry logic with
exponential backoff for rate limit handling.

bug(engine): fix Sharpe ratio calculation for zero-return periods
Prevents division by zero when all returns in a window are zero.
Adds corresponding unit test.

chore(ci): add mypy strict mode to lint workflow

feature(dsl): implement DSL lexer
First stage of the compiler pipeline: tokenises factor expressions
into a stream of typed tokens.
```

---

## 4. Pull Request Process

### Rules

- Every PR targets `dev`, not `main`
- PR title must follow the commit convention format
- Every PR must pass all CI checks before requesting review
- The PR body must be complete — reviewers do not chase missing information
- `main` receives PRs from `dev` only, at phase boundaries (one PR per phase)

### PR Body Requirements

Every PR body must include:

1. **What changed** — bullet list of the specific changes
2. **Why** — link to the relevant phase task or GitHub issue
3. **How it was tested** — exact commands run and their output
4. **Documentation checklist** — see the PR template

Use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`) — it is loaded automatically.

---

## 5. PR Review Checklist

Before approving any PR, the reviewer must confirm **every item**:

- [ ] Read every changed file completely
- [ ] Understand why each change was made
- [ ] Verify the change does not conflict with `docs/00_MASTER_PLAN.md`
- [ ] Verify the change is within the current phase's scope (Phase Guard)
- [ ] All CI checks pass (`lint`, `test`, `install`)
- [ ] All affected documentation is updated
- [ ] `internal/development_log/` has an entry for this work
- [ ] Can explain every changed file to a third party without the PR description

**Never approve a PR you cannot fully explain.**

---

## 6. Documentation Update Matrix

Documentation is a first-class artifact. Implementation is not complete
until documentation is complete.

| Type of change | Documentation to update |
|---|---|
| Architecture changes | `docs/01_ARCHITECTURE.md` |
| Phase completed | `docs/02_CURRENT_STATE.md` |
| Next milestone defined | `docs/03_NEXT_STAGE.md` |
| Major architectural decision | `docs/adr/ADR-NNN-*.md` (new ADR) |
| New subsystem introduced | `internal/learning_notes/` (new note) |
| Significant implementation | `internal/development_log/Phase_NN.md` |
| Public behaviour change | `README.md` (if applicable) |
| New file with real logic | `internal/file_reference/` (new reference doc) |

### Workflow Rule

For every completed task:

```
Implement → Test → Update Architecture → Update Current State →
Update Next Stage → Update ADR (if needed) → Update Dev Log →
Update Learning Notes (if new concept) → File Reference (if new file)
```

Only after all applicable steps are complete is a task considered done.

---

## 7. Phase Guard — AI Guardrail

This section contains permanent rules that apply to every contributor,
including AI agents.

### What the AI Agent Must Never Do

- Implement any feature belonging to a future phase
- Invent roadmap items not present in `docs/00_MASTER_PLAN.md`
- Create placeholder API routes or Pydantic models
- Create placeholder database models
- Add abstractions "for future use" without a concrete present need
- Optimise code that has not been proven to be a bottleneck
- Introduce a dependency without a documented justification (ADR or inline comment)

### What the AI Agent Must Do When Uncertain

**Ask. Do not assume.**

If information is missing, the correct action is to ask the engineer,
not to fill in the gap with a reasonable-sounding assumption.

### Before Writing Any File

Ask:

1. Is this file on the current phase's task list?
2. Does this file's content belong to a future phase?

If either check fails: **stop**. Document the consideration. Ask the engineer.

### Scope Creep Examples

These are real mistakes to avoid:

| Tempting action | Why it is wrong |
|---|---|
| Adding Pydantic models in Phase 0 "to save time later" | Phase 0 has no models; this is Phase 6 scope |
| Adding a `settings.py` in Phase 0 "since we'll need it" | Config is Phase 1 scope |
| Adding a base class "because it will be needed" | YAGNI; add abstractions when the second concrete implementation exists |
| Adding `duckdb` as a dependency in Phase 0 | Phase 0 has no data layer; this is Phase 1 scope |

---

## 8. Team Workflow

This project is developed by one engineer (human) collaborating with an AI agent.

### The AI Agent

- Works on feature branches only — never pushes to `main` or `dev` directly
- Produces a complete PR body documenting every decision made
- Flags any uncertainty explicitly rather than making assumptions
- Applies the Phase Guard before writing any file
- Treats the engineering review process as a required step, not a formality

### The Human Engineer

- Reviews every PR before merging — is the sole approver on `main`
- Has final authority on all architectural decisions
- Updates `TASKS.md` to reflect current progress
- Asks for clarification before the AI starts work if requirements are ambiguous

### Escalation

If the AI agent encounters a decision where:
- The master plan is ambiguous
- Two reasonable approaches exist
- A proposed feature may conflict with the thesis

The AI agent stops, documents the decision point, and asks the engineer.

---

## 9. Code Quality Standards

### When Writing New Code

- Every public function must have a type annotation (strict mypy)
- Every public function must have a docstring
- No magic numbers — extract named constants
- No commented-out code — delete it or open a GitHub issue

### When Modifying Existing Code

- Remove dead code (code that is unreachable, untested, and undocumented)
- Improve naming where it is ambiguous
- Add or improve type annotations
- Reduce duplication by extracting shared logic
- Never change behaviour while refactoring — refactoring is a separate commit

### What Is Not Dead Code

Phase 0 package skeletons (`__init__.py` with only a docstring) are **not** dead code.
They are intentional architectural scaffolding with documented future purpose.

### Dependency Policy

Every new dependency added to `pyproject.toml` must:

1. Have a concrete, present justification — not "we'll need this later"
2. Be accompanied by a comment or ADR explaining why it was added
3. Not duplicate functionality already provided by an existing dependency

---

## Local Development Setup

```bash
# Clone
git clone https://github.com/VaishnaviRai287/alphalab.git
cd alphalab

# Virtual environment
python -m venv .venv
source .venv/bin/activate

# Install
pip install -e ".[dev]"

# Pre-commit hooks (required — runs on every git commit)
pre-commit install

# Infrastructure
cp infra/.env.example .env
# Fill in .env values
docker compose -f infra/docker-compose.yml up -d

# Verify
pytest tests/ -v
ruff check .
mypy src/
```
