"""
alphalab.worker.maintenance
===========================
Startup maintenance: re-queue factors whose stored results are stale.

A factor is stale when its backtest or robustness result is missing or was
produced by an older ENGINE_VERSION. This covers two cases:

  * The engine changed in a deploy, so old results are no longer comparable.
  * The instance restarted mid-job (e.g. free-tier sleep), orphaning a RUNNING
    experiment whose task was already taken off the queue.

Each task saves its result as soon as it finishes, so an interrupted rerun
resumes on the next start with only the remaining factors.
"""

import logging
import uuid
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from alphalab.api.models.factor import Factor
from alphalab.common.exceptions import DataLeakageError, DSLCompilationError
from alphalab.dsl import compile_factor
from alphalab.engine.version import ENGINE_VERSION

logger = logging.getLogger("alphalab.worker.maintenance")


@dataclass(frozen=True)
class StaleFactor:
    """A factor that needs (part of) its analysis recomputed."""

    factor_id: uuid.UUID
    needs_backtest: bool
    needs_robustness: bool


async def find_stale_factors(session: AsyncSession) -> list[StaleFactor]:
    """Return factors with missing or outdated results, oldest first.

    Factors in FAILED experiments are skipped so a factor that keeps failing is
    not retried on every start. Factors whose formula no longer compiles (the
    validator got stricter) have their stale results deleted, their experiment
    marked FAILED, and are skipped.
    """
    stmt = (
        select(Factor)
        .options(
            selectinload(Factor.experiment),
            selectinload(Factor.backtest_result),
            selectinload(Factor.robustness_result),
        )
        .order_by(Factor.created_at)
    )
    factors = (await session.execute(stmt)).scalars().all()

    stale: list[StaleFactor] = []
    for f in factors:
        if f.experiment is None or f.experiment.status == "FAILED":
            continue

        b_res, r_res = f.backtest_result, f.robustness_result
        needs_backtest = b_res is None or b_res.engine_version != ENGINE_VERSION
        needs_robustness = (
            needs_backtest or r_res is None or r_res.engine_version != ENGINE_VERSION
        )
        if not needs_robustness:
            continue

        try:
            compile_factor(f.formula)
        except (DSLCompilationError, DataLeakageError) as e:
            logger.warning(
                f"[Maintenance] Factor {f.id} formula no longer valid ({e}); "
                "deleting its results and marking experiment FAILED"
            )
            # Old results may be look-ahead artifacts; keep them off the leaderboard
            for res in (b_res, r_res):
                if res is not None:
                    await session.delete(res)
            f.experiment.status = "FAILED"
            continue

        stale.append(StaleFactor(f.id, needs_backtest, needs_robustness))

    await session.commit()
    return stale


def enqueue_stale(stale: list[StaleFactor]) -> None:
    """Queue analysis tasks. Backtests go first so robustness sees the new Sharpe
    (the worker runs a single FIFO queue)."""
    from alphalab.worker.tasks import run_backtest_task, run_robustness_task

    for s in stale:
        if s.needs_backtest:
            run_backtest_task.delay(str(s.factor_id))
        if s.needs_robustness:
            run_robustness_task.delay(str(s.factor_id))
