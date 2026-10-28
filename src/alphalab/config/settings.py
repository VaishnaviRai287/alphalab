"""
alphalab.config.settings
=========================
Manages global configuration parameters and environment variable loading.
"""

from urllib.parse import parse_qsl, urlencode

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Query parameters asyncpg does not accept as connect() kwargs
_ASYNCPG_UNSUPPORTED_PARAMS = {"sslmode", "channel_binding", "options"}


class Settings(BaseSettings):
    """Global configuration settings class for AlphaLab."""

    # Storage Settings
    DUCKDB_PATH: str = "internal/data/alphalab.db"
    DUCKDB_MEMORY_LIMIT: str = "256MB"

    # Yahoo Provider Settings
    YAHOO_HTTP_TIMEOUT: int = 15
    YAHOO_MAX_RETRIES: int = 3

    # Validation Settings
    PRICE_JUMP_THRESHOLD: float = 0.15

    # Database connection parameters
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres_local_password_change_me"
    POSTGRES_DB: str = "alphalab"
    POSTGRES_HOST: str = "localhost"
    # Local Dev / UI Iteration Mode
    MOCK_MODE: bool = False

    # Async Database URL
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres_local_password_change_me@localhost:5432/alphalab"

    @property
    def async_database_url(self) -> str:
        """Automatically converts a standard postgresql:// URL to postgresql+asyncpg://"""
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)

        # Drop query parameters asyncpg rejects, translating libpq's sslmode into
        # asyncpg's ssl. Other parameters are preserved.
        if "?" in url:
            base_url, query = url.split("?", 1)
            params = parse_qsl(query, keep_blank_values=True)
            sslmode = next((v for k, v in params if k == "sslmode"), None)
            kept = [(k, v) for k, v in params if k not in _ASYNCPG_UNSUPPORTED_PARAMS]
            if sslmode and not any(k == "ssl" for k, _ in kept):
                kept.append(("ssl", sslmode))
            url = f"{base_url}?{urlencode(kept)}" if kept else base_url

        return url

    # Redis Task Broker URL
    REDIS_URL: str = "redis://:redis_local_password_change_me@localhost:6379/0"

    @property
    def async_redis_url(self) -> str:
        """Automatically adds ssl_cert_reqs for celery if using rediss:// and encodes password"""
        from urllib.parse import quote, urlparse, urlunparse
        url = self.REDIS_URL

        # Safely URL-encode the password if it contains special characters
        parsed = urlparse(url)
        if '@' in parsed.netloc:
            creds, host = parsed.netloc.rsplit('@', 1)
            if ':' in creds:
                user, pwd = creds.split(':', 1)
                # Only quote if not already quoted (simple heuristic: if it has special unquoted chars)
                if not ("%" in pwd and len(pwd) > 2):
                    pwd = quote(pwd)
                new_netloc = f"{user}:{pwd}@{host}"
                parsed = parsed._replace(netloc=new_netloc)
                url = urlunparse(parsed)

        if url.startswith("rediss://") and "ssl_cert_reqs=" not in url:
            separator = "&" if "?" in url else "?"
            url = f"{url}{separator}ssl_cert_reqs=CERT_NONE"

        return url

    # JWT Authentication Settings
    # Accept both the documented names (.env.example) and the legacy names so
    # existing deployments keep working.
    JWT_SECRET: str = Field(
        default="change_me_in_production_extremely_long_secret_key_here",
        validation_alias=AliasChoices("JWT_SECRET_KEY", "JWT_SECRET"),
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=45,
        validation_alias=AliasChoices(
            "JWT_EXPIRY_MINUTES", "ACCESS_TOKEN_EXPIRE_MINUTES"
        ),
    )

    # Comma-separated browser origins allowed by CORS
    CORS_ORIGINS: str = "http://localhost:3000,https://alphalab-hq.vercel.app"

    # Settings configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Instantiate settings singleton
settings = Settings()
