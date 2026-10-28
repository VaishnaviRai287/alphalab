"""Tests for startup re-queueing of stale factors."""

import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from alphalab.api.models.experiment import Experiment
from alphalab.api.models.factor import Factor
from alphalab.api.models.results import BacktestResult, RobustnessResult
from alphalab.engine.version import ENGINE_VERSION
from alphalab.worker.maintenance import StaleFactor, enqueue_stale, find_stale_factors


def _factor(status: str, formula: str = "Momentum(5)", bt=None, rb=None) -> Factor:
    f = Factor(id=uuid.uuid4(), name="f", formula=formula)
    f.experiment = Experiment(id=uuid.uuid4(), status=status)
    f.backtest_result = (
        BacktestResult(factor_id=f.id, engine_version=bt) if bt != "missing" else None
    )
    f.robustness_result = (
        RobustnessResult(factor_id=f.id, engine_version=rb) if rb != "missing" else None
    )
    return f


async def _run(
    factors: list[Factor], session: AsyncMock | None = None
) -> list[StaleFactor]:
    session = session or AsyncMock()
    result = MagicMock()
    result.scalars().all.return_value = factors
    session.execute.return_value = result
    return await find_stale_factors(session)


@pytest.mark.unit
def test_find_stale_factors_classification() -> None:
    import asyncio

    v = ENGINE_VERSION
    current = _factor("COMPLETED", bt=v, rb=v)
    old = _factor("COMPLETED", bt=None, rb=None)  # pre-versioning rows
    rb_only = _factor("COMPLETED", bt=v, rb=v - 1)
    orphan = _factor("RUNNING", bt="missing", rb="missing")  # restart mid-job
    failed = _factor("FAILED", bt="missing", rb="missing")
    invalid = _factor("COMPLETED", formula="delay(close, 0-1)", bt=None, rb=None)

    session = AsyncMock()
    stale = asyncio.run(_run([current, old, rb_only, orphan, failed, invalid], session))
    by_id = {s.factor_id: s for s in stale}

    assert current.id not in by_id
    assert failed.id not in by_id
    assert by_id[old.id] == StaleFactor(old.id, True, True)
    assert by_id[rb_only.id] == StaleFactor(rb_only.id, False, True)
    assert by_id[orphan.id] == StaleFactor(orphan.id, True, True)

    # A formula the stricter validator rejects is not retried forever
    assert invalid.id not in by_id
    assert invalid.experiment.status == "FAILED"
    # ...and its old (possibly look-ahead) results are removed from the leaderboard
    deleted = [c.args[0] for c in session.delete.call_args_list]
    assert deleted == [invalid.backtest_result, invalid.robustness_result]


@pytest.mark.unit
@patch("alphalab.worker.tasks.run_robustness_task")
@patch("alphalab.worker.tasks.run_backtest_task")
def test_enqueue_stale_order(mock_bt: MagicMock, mock_rb: MagicMock) -> None:
    calls: list[str] = []
    mock_bt.delay.side_effect = lambda fid: calls.append(f"bt:{fid}")
    mock_rb.delay.side_effect = lambda fid: calls.append(f"rb:{fid}")
    a, b = uuid.uuid4(), uuid.uuid4()

    enqueue_stale([StaleFactor(a, True, True), StaleFactor(b, False, True)])

    assert calls == [f"bt:{a}", f"rb:{a}", f"rb:{b}"]
