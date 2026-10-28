# ruff: noqa: E402
"""
scripts/rerun_stale_factors.py
==============================
Queue recomputation for factors whose stored results are missing or were
produced by an older engine version (see alphalab.engine.version).

Runs automatically from render-start.sh on every start; it is cheap when
nothing is stale. Can also be run by hand:

    python scripts/rerun_stale_factors.py            # queue stale factors
    python scripts/rerun_stale_factors.py --dry-run  # only list them
"""

import argparse
import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from alphalab.api.database.connection import async_session_maker
from alphalab.engine.version import ENGINE_VERSION
from alphalab.worker.maintenance import enqueue_stale, find_stale_factors


async def main(dry_run: bool) -> None:
    async with async_session_maker() as session:
        stale = await find_stale_factors(session)

    print(f"[Maintenance] Engine v{ENGINE_VERSION}: {len(stale)} factor(s) need recomputation.")
    for s in stale:
        parts = [p for p, needed in (("backtest", s.needs_backtest), ("robustness", s.needs_robustness)) if needed]
        print(f"  {s.factor_id}: {' + '.join(parts)}")

    if stale and not dry_run:
        enqueue_stale(stale)
        print("[Maintenance] Tasks queued; the worker will process them in order.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="List stale factors without queueing")
    asyncio.run(main(parser.parse_args().dry_run))
