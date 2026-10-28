"""Record which engine version produced each stored result

Revision ID: 004_result_engine_version
Revises: 003_verdicts_and_stressed_curve
Create Date: 2026-10-28 20:00:00.000000

Existing rows keep NULL, meaning they were computed before versioning and are
re-queued by scripts/rerun_stale_factors.py on the next start.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "004_result_engine_version"
down_revision: str | None = "003_verdicts_and_stressed_curve"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "backtest_results", sa.Column("engine_version", sa.Integer(), nullable=True)
    )
    op.add_column(
        "robustness_results", sa.Column("engine_version", sa.Integer(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("robustness_results", "engine_version")
    op.drop_column("backtest_results", "engine_version")
