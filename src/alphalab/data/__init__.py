"""
alphalab.data — Market Data Layer
==================================

Phase: 1 (Data Foundation)

Responsibility
--------------
This package contains everything required to obtain, validate, and store
market data. It is the lowest layer of the system — nothing above it
should know how data is sourced or stored.

Design Principles
-----------------
1. Provider abstraction: the rest of the system never imports Yahoo Finance
   directly. It imports a MarketDataProvider interface. This makes the
   provider swappable without touching any other package.

2. Universe abstraction: the universe of tickers (NIFTY 50) is NOT a
   hardcoded list. It is defined as "constituents as of date X" to prevent
   survivorship bias in backtests.

3. Validation layer: raw data from Yahoo Finance is not trusted. Every
   ingested dataset passes through validation before reaching DuckDB.

Planned Contents (Phase 1)
--------------------------
providers/
    base.py          MarketDataProvider abstract interface
    yahoo.py         YahooProvider — concrete Yahoo Finance implementation
universe/
    base.py          Universe abstract interface
    nifty50.py       NIFTY50Universe — point-in-time constituent resolution
validation/
    checks.py        Missing bar detection, schema validation, jump detection
pipeline.py          Orchestrates: fetch → validate → transform → store
storage.py           DuckDB read/write operations (OHLCV, universe, factors)

Phase 0 Status
--------------
Empty skeleton. Do not add any code until Phase 1.
"""
