"""
alphalab.data.universe.base
===========================
Defines the abstract interface for universe constituent resolution.
"""

from abc import ABC, abstractmethod
from datetime import date

from alphalab.common.types import UniverseEntry


class Universe(ABC):
    """Abstract base class representing an index universe resolver."""

    @abstractmethod
    def get_constituents(self, as_of_date: date) -> list[UniverseEntry]:
        """Resolve active index constituents for a specific point-in-time date.

        Args:
            as_of_date: Point-in-time calculation date.

        Returns:
            List of UniverseEntry domain objects active on the target date.
        """
        pass

    def get_constituents_between(
        self, start_date: date, end_date: date
    ) -> list[UniverseEntry]:
        """Resolve every constituent interval active at any point in a date range.

        Used to fetch and backtest all stocks that were in the index during the
        window, not just the survivors at the end. The default falls back to the
        end-date snapshot; resolvers backed by interval data should override it.

        Args:
            start_date: Start of the window.
            end_date: End of the window.

        Returns:
            List of UniverseEntry intervals overlapping the window.
        """
        return self.get_constituents(end_date)
