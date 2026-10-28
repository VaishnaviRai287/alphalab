"""
alphalab.data.universe.nifty50
==============================
NIFTY 50 concrete constituent loader reading from versioned CSV resource.
"""

import datetime
import logging
import os
from datetime import date
from typing import Any

import pandas as pd

from alphalab.common.types import UniverseEntry
from alphalab.data.universe.base import Universe

logger = logging.getLogger("alphalab.data.universe.nifty50")


def _parse_date(x: Any) -> datetime.date | None:
    if pd.isna(x) or not str(x).strip() or str(x).strip() in ("nan", "None"):
        return None
    return datetime.datetime.strptime(str(x).strip()[:10], "%Y-%m-%d").date()


class NIFTY50Universe(Universe):
    """Historical NIFTY 50 constituent resolver parsing local CSV index duration intervals.

    Intervals are half-open: a ticker is a member from ``effective_from``
    (inclusive) until ``effective_to`` (exclusive), so on a rebalance date the
    incoming stock is a member and the outgoing one is not.
    """

    def __init__(self, csv_path: str | None = None) -> None:
        """Initialize the Universe resolver.

        Args:
            csv_path: Optional custom path to nifty50_history.csv.
                      If not provided, resolves relative to package path.
        """
        if csv_path is None:
            current_dir = os.path.dirname(__file__)
            self.csv_path = os.path.abspath(
                os.path.join(current_dir, "../resources/nifty50_history.csv")
            )
        else:
            self.csv_path = csv_path

    def _load(self) -> pd.DataFrame | None:
        """Read and normalize the NIFTY50 rows of the CSV resource."""
        if not os.path.exists(self.csv_path):
            logger.error(
                f"[DataIngestion] [NIFTY50Universe] CSV resource not found at: {self.csv_path}"
            )
            return None

        df = pd.read_csv(self.csv_path, engine="python")
        df["ticker"] = df["ticker"].str.strip()
        df["index_name"] = df["index_name"].str.strip()
        df["effective_from"] = df["effective_from"].apply(_parse_date)
        df["effective_to"] = df["effective_to"].apply(_parse_date)
        return df[df["index_name"] == "NIFTY50"]

    @staticmethod
    def _to_entries(df: pd.DataFrame) -> list[UniverseEntry]:
        return [
            UniverseEntry(
                ticker=row["ticker"],
                index_name=row["index_name"],
                effective_from=row["effective_from"],
                effective_to=row["effective_to"],
            )
            for _, row in df.iterrows()
        ]

    def get_constituents(self, as_of_date: date) -> list[UniverseEntry]:
        """Resolve NIFTY 50 active index constituent intervals for a point-in-time date.

        Args:
            as_of_date: Historical query date.

        Returns:
            List of UniverseEntry active on the target date.
        """
        logger.info(
            f"[DataIngestion] [NIFTY50Universe] Resolving NIFTY50 constituents for date: {as_of_date}"
        )
        df = self._load()
        if df is None:
            return []

        started = df["effective_from"] <= as_of_date
        not_ended = df["effective_to"].isnull() | (df["effective_to"] > as_of_date)
        entries = self._to_entries(df[started & not_ended])

        logger.info(
            f"[DataIngestion] [NIFTY50Universe] Resolved {len(entries)} constituents for {as_of_date}"
        )
        return entries

    def get_constituents_between(
        self, start_date: date, end_date: date
    ) -> list[UniverseEntry]:
        """Resolve every NIFTY 50 interval overlapping [start_date, end_date].

        Args:
            start_date: Start of the window.
            end_date: End of the window.

        Returns:
            List of UniverseEntry intervals active at any point in the window.
        """
        df = self._load()
        if df is None:
            return []

        started = df["effective_from"] <= end_date
        not_ended = df["effective_to"].isnull() | (df["effective_to"] > start_date)
        entries = self._to_entries(df[started & not_ended])

        logger.info(
            f"[DataIngestion] [NIFTY50Universe] Resolved {len(entries)} constituent intervals "
            f"between {start_date} and {end_date}"
        )
        return entries
