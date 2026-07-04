"""
alphalab.engine — Evaluation Engines
======================================

Phase: 3 (Backtesting Engine) + Phase 5 (Robustness Engine)

Responsibility
--------------
This package contains the two core research engines that implement
AlphaLab's research thesis. Every other component in the system exists
to support what happens here.

Engine 1 — Backtesting Engine (Phase 3)
----------------------------------------
Evaluates factor performance using walk-forward validation. Walk-forward
validation rolls the train/test boundary forward through time, preventing
the look-ahead bias that plagues random train/test splits on time-series data.

Outputs per factor:
    Sharpe Ratio        risk-adjusted return
    Sortino Ratio       downside-risk-adjusted return
    Calmar Ratio        return / max drawdown
    Max Drawdown        largest peak-to-trough decline
    Information Coefficient (IC)    rank correlation between factor and forward returns
    Rank IC             Spearman rank correlation
    Turnover            portfolio churn rate

Engine 2 — Robustness Engine (Phase 5)
----------------------------------------
The core differentiator of AlphaLab. Stress-tests factors under two
perturbation regimes:

    1. Noise Injection — perturb price/volume by ±0.5%, ±1%, ±2%
    2. Missing Data   — randomly drop 5%, 10%, 20% of observations

For each perturbation level, the factor is re-evaluated. The robustness
score is the ratio of stressed performance to original performance.

    Robustness Score = Average Performance Under Stress / Original Performance

A high robustness score means the factor's signal is stable and likely
to persist out-of-sample. A low score means the factor is noise-sensitive
and likely overfit.

Planned Contents (Phase 3 + 5)
-------------------------------
backtest/
    engine.py           Walk-forward validation orchestration
    metrics.py          Sharpe, Sortino, Calmar, IC, RankIC, Drawdown, Turnover
    windows.py          Rolling and expanding window generators
robustness/
    engine.py           Stress test orchestration
    noise.py            Noise injection perturbation
    missing.py          Missing data perturbation
    scoring.py          Robustness score calculation and failure reasoning

Phase 0 Status
--------------
Empty skeleton. Do not add any code until Phase 3.
"""
