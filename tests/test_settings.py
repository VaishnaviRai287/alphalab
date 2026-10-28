"""Tests for environment-driven settings."""

import pytest

from alphalab.config.settings import Settings


@pytest.mark.unit
@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (
            "postgresql://u:p@host/db?sslmode=require&channel_binding=require",
            "postgresql+asyncpg://u:p@host/db?ssl=require",
        ),
        ("postgres://u:p@localhost:5432/db", "postgresql+asyncpg://u:p@localhost:5432/db"),
        (
            "postgresql://u:p@host/db?sslmode=disable&application_name=al",
            "postgresql+asyncpg://u:p@host/db?application_name=al&ssl=disable",
        ),
        ("postgresql://u:p@host/db?options=x", "postgresql+asyncpg://u:p@host/db"),
    ],
)
def test_async_database_url(raw: str, expected: str) -> None:
    assert Settings(DATABASE_URL=raw).async_database_url == expected


@pytest.mark.unit
@pytest.mark.parametrize("name", ["JWT_SECRET_KEY", "JWT_SECRET"])
def test_jwt_secret_env_names(monkeypatch: pytest.MonkeyPatch, name: str) -> None:
    monkeypatch.delenv("JWT_SECRET_KEY", raising=False)
    monkeypatch.delenv("JWT_SECRET", raising=False)
    monkeypatch.setenv(name, "from-env")
    assert Settings(_env_file=None).JWT_SECRET == "from-env"


@pytest.mark.unit
@pytest.mark.parametrize("name", ["JWT_EXPIRY_MINUTES", "ACCESS_TOKEN_EXPIRE_MINUTES"])
def test_jwt_expiry_env_names(monkeypatch: pytest.MonkeyPatch, name: str) -> None:
    monkeypatch.delenv("JWT_EXPIRY_MINUTES", raising=False)
    monkeypatch.delenv("ACCESS_TOKEN_EXPIRE_MINUTES", raising=False)
    monkeypatch.setenv(name, "15")
    assert Settings(_env_file=None).ACCESS_TOKEN_EXPIRE_MINUTES == 15
