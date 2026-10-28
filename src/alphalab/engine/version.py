"""
alphalab.engine.version
=======================
Version of the evaluation methodology that produced a stored result.

Bump ENGINE_VERSION whenever a change alters computed results (DSL semantics,
portfolio construction, metrics, robustness grid, universe or market data).
On the next deploy, scripts/rerun_stale_factors.py re-queues every factor whose
stored results carry an older version.

History:
    1  Original engine (results stored before versioning have NULL).
    2  Distinct robustness seeds, constant-folded look-ahead checks, panel-wide
       rank/scale, point-in-time NIFTY 50 universe, monthly IC series stored.
"""

ENGINE_VERSION = 2
