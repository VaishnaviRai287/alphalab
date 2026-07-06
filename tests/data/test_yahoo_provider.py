import json
from datetime import date

import pandas as pd
import pytest
import responses

from alphalab.common.exceptions import DataError
from alphalab.data.providers.yahoo_provider import YahooProvider


@pytest.fixture
def provider():
    return YahooProvider(timeout=5, max_retries=1)


@responses.activate
def test_fetch_ohlcv_success(provider):
    """Test successful bulk download from Yahoo API mock."""
    start_date = date(2023, 1, 1)
    end_date = date(2023, 1, 2)
    tickers = ["AAPL"]

    # Mock the Yahoo Finance download JSON endpoint
    # yfinance uses various endpoints under the hood, but primarily v8/finance/chart
    url = "https://query2.finance.yahoo.com/v8/finance/chart/AAPL"
    
    mock_payload = {
        "chart": {
            "result": [
                {
                    "meta": {"symbol": "AAPL", "currency": "USD"},
                    "timestamp": [1672756200, 1672842600],
                    "indicators": {
                        "quote": [
                            {
                                "open": [130.0, 131.0],
                                "high": [132.0, 133.0],
                                "low": [129.0, 130.0],
                                "close": [131.0, 132.0],
                                "volume": [10000, 15000],
                            }
                        ]
                    },
                }
            ],
            "error": None,
        }
    }

    responses.add(
        responses.GET,
        url,
        json=mock_payload,
        status=200,
        match_querystring=False
    )

    df = provider.fetch_ohlcv(tickers, start_date, end_date)
    assert not df.empty
    assert "ticker" in df.columns
    assert "close" in df.columns
    assert df.iloc[0]["ticker"] == "AAPL"


@responses.activate
def test_fetch_ohlcv_server_error(provider):
    """Test handling of HTTP 500 from Yahoo API."""
    start_date = date(2023, 1, 1)
    end_date = date(2023, 1, 2)
    tickers = ["AAPL"]

    url = "https://query2.finance.yahoo.com/v8/finance/chart/AAPL"
    responses.add(
        responses.GET,
        url,
        json={"error": "Internal Server Error"},
        status=500,
        match_querystring=False
    )

    # yfinance might suppress errors and just return an empty dataframe
    df = provider.fetch_ohlcv(tickers, start_date, end_date)
    assert df.empty
