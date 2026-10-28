"""
tests/dsl/test_panel.py
=======================
Panel (multi-ticker) semantics of the compiled DSL: time-series functions stay
within a ticker, cross-sectional functions work within a date, and constant
arguments cannot be used to sneak in look-ahead.
"""

import pandas as pd
import pytest

from alphalab.common.exceptions import DataLeakageError, DSLCompilationError
from alphalab.dsl import compile_factor


@pytest.fixture
def panel() -> pd.DataFrame:
    """Two tickers x three dates, sorted by ticker then date (as the evaluator does)."""
    return pd.DataFrame(
        {
            "ticker": ["A", "A", "A", "B", "B", "B"],
            "date": pd.to_datetime(["2024-01-01", "2024-01-02", "2024-01-03"] * 2),
            "close": [10.0, 11.0, 12.0, 100.0, 90.0, 80.0],
            "volume": [1.0, 2.0, 3.0, 30.0, 20.0, 10.0],
        }
    )


# ---------------------------------------------------------------------------
# Look-ahead via constant expressions
# ---------------------------------------------------------------------------


@pytest.mark.unit
@pytest.mark.parametrize(
    "formula",
    ["delay(close, 0-1)", "Lag(close, 2 - 3)", "delay(close, -1 * 1)", "delay(close, (0-2)/2)"],
)
def test_negative_shift_constant_expression_rejected(formula: str) -> None:
    with pytest.raises(DataLeakageError, match="negative shift"):
        compile_factor(formula)


@pytest.mark.unit
@pytest.mark.parametrize(
    "formula", ["ts_max(close, 1 - 1)", "Momentum(2 - 5)", "correlation(close, volume, 0)"]
)
def test_non_positive_window_constant_expression_rejected(formula: str) -> None:
    with pytest.raises(DataLeakageError, match="Invalid window size"):
        compile_factor(formula)


@pytest.mark.unit
@pytest.mark.parametrize(
    "formula", ["delay(close, volume)", "Momentum(close)", "ts_rank(close, close - 1)"]
)
def test_data_dependent_window_rejected(formula: str) -> None:
    with pytest.raises(DSLCompilationError, match="must be a constant integer"):
        compile_factor(formula)


@pytest.mark.unit
def test_constant_expression_window_allowed(panel: pd.DataFrame) -> None:
    result = compile_factor("delay(close, 3 - 2)")(panel)
    expected = compile_factor("delay(close, 1)")(panel)
    pd.testing.assert_series_equal(result, expected)


@pytest.mark.unit
def test_unknown_variable_rejected() -> None:
    with pytest.raises(DSLCompilationError, match="Unknown variable: vwap"):
        compile_factor("vwap / close")


# ---------------------------------------------------------------------------
# Time-series functions never cross tickers
# ---------------------------------------------------------------------------


@pytest.mark.unit
def test_delay_does_not_leak_across_tickers(panel: pd.DataFrame) -> None:
    result = compile_factor("delay(close, 1)")(panel)
    # B's first row must be NaN, not A's last close
    assert pd.isna(result.iloc[0])
    assert pd.isna(result.iloc[3])
    assert result.iloc[4] == 100.0


@pytest.mark.unit
def test_momentum_per_ticker(panel: pd.DataFrame) -> None:
    result = compile_factor("Momentum(1)")(panel)
    assert pd.isna(result.iloc[3])
    assert result.iloc[4] == pytest.approx(-0.10)


# ---------------------------------------------------------------------------
# Cross-sectional functions
# ---------------------------------------------------------------------------


@pytest.mark.unit
def test_rank_is_cross_sectional(panel: pd.DataFrame) -> None:
    result = compile_factor("rank(close)")(panel)
    # B (higher close) ranks 1.0 and A 0.5 on every date
    assert result.tolist() == [0.5, 0.5, 0.5, 1.0, 1.0, 1.0]


@pytest.mark.unit
def test_rank_composes_inside_expression(panel: pd.DataFrame) -> None:
    """rank(a) + b must rank a first, not rank the whole expression."""
    result = compile_factor("rank(close) + volume")(panel)
    expected = [0.5 + 1.0, 0.5 + 2.0, 0.5 + 3.0, 1.0 + 30.0, 1.0 + 20.0, 1.0 + 10.0]
    assert result.tolist() == pytest.approx(expected)


@pytest.mark.unit
def test_scale_is_per_date(panel: pd.DataFrame) -> None:
    result = compile_factor("scale(close, 1)")(panel)
    abs_sum_by_date = result.abs().groupby(panel["date"]).sum()
    assert abs_sum_by_date.tolist() == pytest.approx([1.0, 1.0, 1.0])


@pytest.mark.unit
def test_scale_does_not_use_future_data(panel: pd.DataFrame) -> None:
    """Changing a later date's prices must not change an earlier date's value."""
    before = compile_factor("scale(close, 1)")(panel)
    shocked = panel.copy()
    shocked.loc[shocked["date"] == "2024-01-03", "close"] *= 50
    after = compile_factor("scale(close, 1)")(shocked)
    early = panel["date"] < "2024-01-03"
    pd.testing.assert_series_equal(before[early], after[early])
