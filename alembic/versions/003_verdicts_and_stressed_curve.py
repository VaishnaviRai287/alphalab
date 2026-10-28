"""Add verdict/math columns and fix stressed equity curve column name

Revision ID: 003_verdicts_and_stressed_curve
Revises: 0efebb5f285f
Create Date: 2026-10-28 18:00:00.000000

These columns were previously added by ALTER TABLE statements run at API
startup. Every statement is idempotent so this applies cleanly both to fresh
databases and to deployments that already have the columns.

Revision 0efebb5f285f created ``stressed_equity_curves`` (plural), which the
model never used; the model writes ``stressed_equity_curve``.
"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "003_verdicts_and_stressed_curve"
down_revision: str | None = "0efebb5f285f"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

_BACKTEST_COLUMNS = [
    ("verdict_sharpe", "VARCHAR"),
    ("verdict_ic", "VARCHAR"),
    ("verdict_mdd", "VARCHAR"),
    ("daily_mean", "DOUBLE PRECISION"),
    ("daily_std", "DOUBLE PRECISION"),
    ("mdd_peak_date", "VARCHAR"),
    ("mdd_trough_date", "VARCHAR"),
]

_ROBUSTNESS_COLUMNS = [
    ("verdict_robustness", "VARCHAR"),
    ("stressed_equity_curve", "JSON"),
]


def upgrade() -> None:
    for name, type_ in _BACKTEST_COLUMNS:
        op.execute(
            f"ALTER TABLE backtest_results ADD COLUMN IF NOT EXISTS {name} {type_}"
        )
    for name, type_ in _ROBUSTNESS_COLUMNS:
        op.execute(
            f"ALTER TABLE robustness_results ADD COLUMN IF NOT EXISTS {name} {type_}"
        )
    op.execute(
        "ALTER TABLE robustness_results DROP COLUMN IF EXISTS stressed_equity_curves"
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE robustness_results ADD COLUMN IF NOT EXISTS stressed_equity_curves JSON"
    )
    for name, _ in _ROBUSTNESS_COLUMNS:
        op.execute(f"ALTER TABLE robustness_results DROP COLUMN IF EXISTS {name}")
    for name, _ in _BACKTEST_COLUMNS:
        op.execute(f"ALTER TABLE backtest_results DROP COLUMN IF EXISTS {name}")
