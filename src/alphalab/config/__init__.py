"""
alphalab.config — Settings and Environment Loading
===================================================

Phase: 1 (Data Foundation — first use of environment variables)

Responsibility
--------------
This package is the single source of truth for all configuration.
No other package reads environment variables directly.
No other package hardcodes configuration values.

Every piece of configuration that varies between environments
(development, CI, production) lives here.

Design
------
Configuration is loaded using Pydantic's BaseSettings, which:
    1. Reads values from environment variables
    2. Falls back to .env file values
    3. Validates types and raises clear errors for missing required values
    4. Provides IDE autocompletion for all settings

This makes misconfiguration a startup-time error, not a runtime surprise.

Planned Contents (Phase 1)
--------------------------
settings.py     Settings class — all configuration fields with types,
                descriptions, and defaults where appropriate.

                Example fields:
                    DATABASE_URL: str
                    REDIS_URL: str
                    DUCKDB_PATH: str
                    LOG_LEVEL: str = "INFO"
                    ENVIRONMENT: Literal["development", "production"] = "development"

Phase 0 Status
--------------
Empty skeleton. Do not add any code until Phase 1.
"""
