"""
alphalab.utils — Pure Utility Functions
=========================================

Phase: 1+ (populated incrementally as needed)

Responsibility
--------------
This package contains pure utility functions: functions that:
    1. Take inputs and return outputs
    2. Have no side effects
    3. Do not import from any other alphalab package
    4. Are genuinely reused across two or more other packages

The rule for adding to this package:
    - No domain knowledge. A function that knows what a "factor" or
      "ticker" is does NOT belong here — it belongs in the package
      that owns that concept.
    - No side effects. Functions that write to disk, make network
      requests, or modify global state do NOT belong here.
    - If a utility is used by exactly one package, keep it there.

Planned Contents (added as needed from Phase 1 onwards)
-------------------------------------------------------
date_utils.py       Date arithmetic, trading day calculations
math_utils.py       Statistical helper functions
validation_utils.py Input validation helpers

Phase 0 Status
--------------
Empty skeleton. Do not add any code until a genuine cross-package utility
need arises in Phase 1 or later.
"""
