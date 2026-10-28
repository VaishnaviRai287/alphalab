"""
alphalab.engine.evaluator
=========================
Evaluates compiled Factor DSL functions over historical data.
"""

from collections.abc import Callable
from datetime import date

import pandas as pd

from alphalab.common.exceptions import DataError
from alphalab.common.types import UniverseEntry
from alphalab.data.storage.base import Storage


def membership_mask(
    df: pd.DataFrame, membership: list[UniverseEntry]
) -> pd.Series:
    """Boolean mask of rows whose ticker was an index member on that row's date.

    Intervals are half-open: a ticker is a member on ``effective_from`` and
    stops being one on ``effective_to``.
    """
    dates = pd.to_datetime(df["date"])
    mask = pd.Series(False, index=df.index)
    for entry in membership:
        active = (df["ticker"] == entry.ticker) & (
            dates >= pd.Timestamp(entry.effective_from)
        )
        if entry.effective_to is not None:
            active &= dates < pd.Timestamp(entry.effective_to)
        mask |= active
    return mask


class FactorEvaluator:
    """Evaluates compiled factor functions across a universe of tickers."""

    def __init__(self, storage: Storage):
        self.storage = storage

    def evaluate(
        self,
        factor_func: Callable[[pd.DataFrame], pd.Series],
        tickers: list[str],
        start_date: date,
        end_date: date,
        membership: list[UniverseEntry] | None = None,
    ) -> pd.DataFrame:
        """
        Evaluate the factor function across historical data for the given tickers.

        Args:
            factor_func: Compiled Pandas callable from the DSL compiler. It receives
                the full panel (sorted by ticker, date) and is responsible for
                grouping time-series operations by ticker.
            tickers: List of target tickers to evaluate.
            start_date: Historical start date.
            end_date: Historical end date.
            membership: Optional index membership intervals. When given, signals
                are kept only on dates where the ticker was an index member.

        Returns:
            DataFrame containing raw alpha signals with columns ['date', 'ticker', 'signal'].
        """
        # Fetch OHLCV data from storage
        dataset = self.storage.read_ohlcv(tickers, start_date, end_date)
        df = dataset.data

        if df.empty:
            raise DataError(f"No OHLCV data found between {start_date} and {end_date}")

        # Map adj_close to close, drop raw unadjusted close if present to avoid name conflict
        if "adj_close" in df.columns:
            if "close" in df.columns:
                df = df.drop(columns=["close"])
            df = df.rename(columns={"adj_close": "close"})

        # Sort by ticker then date for chronological rolling window evaluation
        df = df.sort_values(by=["ticker", "date"]).reset_index(drop=True)
        df["returns"] = df.groupby("ticker")["close"].pct_change()

        # Add capitalized aliases for backward compatibility with older formulas
        df["Price"] = df["close"]
        df["Volume"] = df["volume"]
        df["Open"] = df["open"]
        df["High"] = df["high"]
        df["Low"] = df["low"]

        signal = factor_func(df)
        result_df = pd.DataFrame(
            {"date": df["date"], "ticker": df["ticker"], "signal": signal.values}
        )

        # Signals are computed on each ticker's full history (no look-ahead), then
        # restricted to the days the ticker was actually in the index.
        if membership is not None:
            result_df = result_df[membership_mask(result_df, membership)]

        # Drop rows where signal is NaN (e.g. from rolling windows/lags) or infinite
        # (division by zero), which would otherwise poison that date's z-scores
        result_df["signal"] = result_df["signal"].replace([float("inf"), float("-inf")], float("nan"))
        return result_df.dropna(subset=["signal"]).reset_index(drop=True)
