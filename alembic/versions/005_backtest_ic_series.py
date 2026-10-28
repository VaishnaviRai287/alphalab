"""Store the monthly IC series with each backtest result

Revision ID: 005_backtest_ic_series
Revises: 004_result_engine_version
Create Date: 2026-10-28 21:00:00.000000

Filled for existing factors when the startup re-run recomputes them.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "005_backtest_ic_series"
down_revision: str | None = "004_result_engine_version"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("backtest_results", sa.Column("ic_series", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("backtest_results", "ic_series")
