# NIFTY 50 membership history — sources and caveats

`nifty50_history.csv` lists every NIFTY 50 constituent interval from
2019-01-01 to 2025-12-31. `effective_from` is the first day a stock is a
member; `effective_to` is the first day it is **not** (half-open interval).
An empty `effective_to` means still a member at the end of 2025.

## How it was built

1. Start from the end-2025 constituent list on Wikipedia's NIFTY 50 page. BSE
   is replaced by Wipro, because BSE only replaced Wipro on 2026-09-30.
2. Undo each change in Wikipedia's "List of replacements" table in reverse to
   recover the 2019-01-01 list. The set stays at exactly 50 at every step, and
   replaying forward reproduces the end-2025 list.
3. The 2025-03-28 change (BPCL and Britannia out, Jio Financial and Zomato in)
   is confirmed by the NSE press release of 2025-02-21.

| Effective | Out | In |
|---|---|---|
| 2019-03-29 | HINDPETRO | BRITANNIA |
| 2019-09-27 | IBULHSGFIN | NESTLEIND |
| 2020-03-19 | YESBANK | SHREECEM |
| 2020-07-31 | VEDL | HDFCLIFE |
| 2020-09-25 | ZEEL, INFRATEL | SBILIFE, DIVISLAB |
| 2021-03-31 | GAIL | TATACONSUM |
| 2022-03-31 | IOC | APOLLOHOSP |
| 2022-09-30 | SHREECEM | ADANIENT |
| 2023-07-13 | HDFC | LTIM |
| 2024-03-28 | UPL | SHRIRAMFIN |
| 2024-09-30 | DIVISLAB, LTIM | BEL, TRENT |
| 2025-03-28 | BPCL, BRITANNIA | JIOFIN, ETERNAL |
| 2025-09-30 | HEROMOTOCO, INDUSINDBK | INDIGO, MAXHEALTH |

Sources:
- https://en.wikipedia.org/wiki/NIFTY_50 (constituents and list of replacements)
- https://www.niftyindices.com/Press_Release/ind_prs21022025.pdf

## Yahoo Finance symbols

Tickers are stored as current Yahoo symbols, which carry the full history:

| Index-era name | Yahoo symbol |
|---|---|
| Indiabulls Housing Finance (IBULHSGFIN) | SAMMAANCAP.NS |
| Bharti Infratel (INFRATEL) | INDUSTOWER.NS |
| LTIMindtree (LTIM) | LTM.NS |
| Tata Motors | TMPV.NS |
| Zomato | ETERNAL.NS |

## Known gaps

- **HDFC Ltd (HDFC.NS)** was a member until 2023-07-13 but Yahoo no longer serves
  its prices (delisted after the merger with HDFC Bank). Ingestion drops it, so
  the portfolio holds 49 stocks until that date.
- **Tata Motors demerger (Oct 2025):** check TMPV.NS adjusted prices around the
  demerger for an unadjusted drop; the ingestion validators will flag it as a
  price jump. Any temporary index inclusion of the demerged CV business is not
  modelled.
- Wikipedia's table is the single source for 2019–2024; spot-check against NSE
  press releases (niftyindices.com) before relying on exact dates.
