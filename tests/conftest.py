"""
tests/conftest.py — Shared Pytest Fixtures
===========================================

This file is automatically loaded by pytest before any test runs.
It is the correct place for fixtures that are shared across multiple
test modules.

Phase 0 Status
--------------
No fixtures are needed yet — all Phase 0 tests are pure import and
structure checks that require no setup or teardown.

Fixtures will be added here starting in Phase 1 when tests begin to
require database connections, mock providers, and test data factories.

Future fixtures (planned, not implemented):
    - db_session: a SQLAlchemy session against a test database
    - duckdb_connection: an in-memory DuckDB connection for data tests
    - mock_yahoo_provider: a mock MarketDataProvider for unit tests
    - sample_ohlcv: a small DataFrame of synthetic OHLCV data
"""
