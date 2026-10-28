"use client";

import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────── */
interface SubsystemPanel {
  id: string;
  label: string;
  badge: string;
}

const SUBSYSTEMS: SubsystemPanel[] = [
  { id: "api", label: "API & Job Orchestration", badge: "5a" },
  { id: "data", label: "Data Layer (DuckDB)", badge: "5b" },
  { id: "backtest", label: "Backtesting Engine", badge: "5c" },
  { id: "stress", label: "Robustness Grid", badge: "5d" },
  { id: "cache", label: "Results Storage", badge: "5e" },
  { id: "dsl", label: "DSL Compiler", badge: "5f" },
  { id: "eval", label: "Factor Evaluator", badge: "5g" },
  { id: "perturb", label: "PerturbedStorage", badge: "5h" },
  { id: "verdict", label: "LLM Verdict Engine", badge: "5i" },
  { id: "ingest", label: "Data Ingestion Pipeline", badge: "5j" },
];

/* ─────────────────────────────────────────────────────────────────────────
   Inline math helper — renders notation in a monospace span
───────────────────────────────────────────────────────────────────────── */
function M({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        background: "rgba(26,28,24,0.06)",
        padding: "1px 5px",
        borderRadius: 0,
        color: "#1a1c18",
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Formula block
───────────────────────────────────────────────────────────────────────── */
function FormulaBlock({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "#1a1c18",
        background: "#fff",
        border: "1px solid #ddddd9",
        padding: "10px 16px",
        margin: "8px 0",
        lineHeight: 1.8,
        overflowX: "auto",
        whiteSpace: "pre",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Diagram box
───────────────────────────────────────────────────────────────────────── */
function Box({
  label,
  sub,
  accent,
}: {
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${accent ? "#1a1c18" : "#ddddd9"}`,
        background: accent ? "#1a1c18" : "#fff",
        color: accent ? "#fff" : "#1a1c18",
        padding: "9px 13px",
        fontSize: "10px",
        fontWeight: 700,
        fontFamily: "var(--font-sans)",
        minWidth: 120,
        textAlign: "center",
        lineHeight: 1.4,
        flexShrink: 0,
        letterSpacing: "0.2px",
      }}
    >
      {label}
      {sub && (
        <div
          style={{
            fontWeight: 400,
            fontSize: "9px",
            color: accent ? "rgba(255,255,255,0.55)" : "#8a9085",
            marginTop: 3,
            fontFamily: "var(--font-mono)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/* Arrow */
function Arr({ label, dashed }: { label?: string; dashed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0, padding: "0 2px" }}>
      <div
        style={{
          width: 20,
          height: 0,
          borderTop: `1px ${dashed ? "dashed" : "solid"} #5c6059`,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: "8px",
            color: "#8a9085",
            fontWeight: 600,
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "3px solid transparent",
          borderBottom: "3px solid transparent",
          borderLeft: "4px solid #5c6059",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────── */
export default function FlowPage() {
  const [activeSubsystem, setActiveSubsystem] = useState<string>("api");

  return (
    <div className="sardar-flow-page" style={{ maxWidth: "100%" }}>

      {/* ══ §1 INTRODUCTION ══════════════════════════════════════ */}
      <div
        style={{
          paddingBottom: 40,
          borderBottom: "1px solid #ddddd9",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* Left — heading */}
        <div>
          <div className="al-tag" style={{ marginBottom: 10 }}>SYSTEM ARCHITECTURE</div>
          <h1 className="al-title-xl">
            How AlphaLab works
          </h1>
        </div>

        {/* Right — description */}
        <div style={{ paddingTop: 32 }}>
          <p className="al-body" style={{ marginBottom: 14 }}>
            AlphaLab is a stress-testing platform for quantitative alpha factors evaluated against
            NIFTY 50 equities. A user defines a factor expression — for example,{" "}
            <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: "#f3f3f1", padding: "1px 6px" }}>
              Momentum(20) / Volatility(10)
            </code>{" "}
            — and the platform backtests it against historical NIFTY 50 constituent returns.
          </p>
          <p className="al-body">
            The same backtest is then re-run 18 times on deliberately damaged copies of the price
            history — random price noise and missing trading days. How much of the baseline
            Sharpe ratio survives becomes the factor&apos;s robustness score, which separates
            signals that reflect a real pattern from ones overfit to the exact historical prices.
          </p>
        </div>
      </div>

      <div className="sardar-grid-divider" />

      {/* ══ ARCHITECTURE DIAGRAM ══════════════════════════════════ */}
      <div style={{ padding: "32px 0", borderBottom: "1px solid #ddddd9" }}>
        <div style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "end" }}>
          <div>
            <div className="al-tag" style={{ marginBottom: 8 }}>SYSTEM DIAGRAM</div>
            <h2 className="al-title-md">How the components connect</h2>
          </div>
          <p className="al-body">
            Think of AlphaLab like a factory: the browser is the control panel where you
            give instructions, the API is the foreman that receives and routes them,
            the Celery worker is the machine that does the heavy calculation, and
            DuckDB is the raw materials warehouse. Nothing gets computed in the browser
            — it only shows you the finished result.
          </p>
        </div>

        {/* Styled architecture diagram */}
        <div style={{ background: "#fff", border: "1px solid #1a1c18", padding: "32px 24px", overflowX: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, minWidth: 560 }}>

            {/* Browser */}
            <div style={{ width: "100%", maxWidth: 680, border: "1px solid #1a1c18", background: "#fbfbfa" }}>
              <div style={{ background: "#1a1c18", color: "#fff", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>BROWSER</span>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>Next.js / React — Vercel</span>
              </div>
              <div style={{ padding: "14px 20px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Home", "Research Lab", "History", "Flow"].map(pg => (
                  <span key={pg} style={{ fontSize: "10px", fontWeight: 600, color: "#1a1c18", background: "#f3f3f1", border: "1px solid #ddddd9", padding: "3px 10px" }}>{pg}</span>
                ))}
              </div>
            </div>

            {/* Connector: Browser → API */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0" }}>
              <div style={{ width: 1, height: 16, background: "#5c6059" }} />
              <span style={{ fontSize: "9px", color: "#8a9085", fontFamily: "var(--font-mono)", background: "#fbfbfa", padding: "1px 8px", border: "1px solid #ddddd9" }}>HTTP / REST · port 8000</span>
              <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #5c6059" }} />
            </div>

            {/* FastAPI */}
            <div style={{ width: "100%", maxWidth: 680, border: "1px solid #1a1c18", background: "#fff" }}>
              <div style={{ background: "#1a1c18", color: "#fff", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>FASTAPI APPLICATION</span>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>uvicorn · port 8000</span>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  ["POST", "/experiments", "compile formula · enqueue 2 tasks · 201"],
                  ["GET", "/factors/{id}[/backtest|/robustness]", "results (login required)"],
                  ["GET", "/factors/leaderboard", "public, paginated, sortable"],
                ].map(([method, path, desc]) => (
                  <div key={path} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "10px", fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "#0f766e", fontWeight: 700, minWidth: 32 }}>{method}</span>
                    <span style={{ color: "#1a1c18", fontWeight: 600 }}>{path}</span>
                    <span style={{ color: "#8a9085", fontWeight: 400 }}>— {desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Two branches: Postgres + Celery */}
            <div style={{ width: "100%", maxWidth: 680, display: "flex", position: "relative", justifyContent: "space-between", padding: "0 0", marginTop: 0 }}>
              {/* Postgres branch line */}
              <div style={{ position: "absolute", left: "25%", top: 0, height: 32, width: 1, background: "#ddddd9" }} />
              <div style={{ position: "absolute", left: "25%", top: 20, fontSize: "8px", color: "#8a9085", fontFamily: "var(--font-mono)", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>SQLAlchemy</div>
              {/* Redis/Celery branch line */}
              <div style={{ position: "absolute", right: "25%", top: 0, height: 32, width: 1, background: "#ddddd9" }} />
              <div style={{ position: "absolute", right: "25%", top: 20, fontSize: "8px", color: "#8a9085", fontFamily: "var(--font-mono)", transform: "translateX(50%)", whiteSpace: "nowrap" }}>Redis queue</div>
              <div style={{ height: 40 }} />
            </div>

            {/* Side-by-side: Postgres + Celery */}
            <div style={{ width: "100%", maxWidth: 680, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* PostgreSQL */}
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa" }}>
                <div style={{ background: "#5c6059", color: "#fff", padding: "7px 14px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px" }}>POSTGRESQL</span>
                  <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-mono)" }}>asyncpg · SQLAlchemy</span>
                </div>
                <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 3 }}>
                  {["users", "experiments", "factors", "backtest_results", "robustness_results"].map(t => (
                    <span key={t} style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5c6059" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Celery Worker */}
              <div style={{ border: "1px solid #1a1c18", background: "#fff" }}>
                <div style={{ background: "#1a1c18", color: "#fff", padding: "7px 14px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px" }}>CELERY WORKER</span>
                  <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-mono)" }}>--pool=solo</span>
                </div>
                <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5c6059" }}>run_backtest_task(factor_id)</span>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5c6059" }}>run_robustness_task(factor_id)</span>
                  <div style={{ marginTop: 6, padding: "5px 8px", background: "rgba(15,118,110,0.07)", border: "1px solid rgba(15,118,110,0.2)" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#0f766e", fontFamily: "var(--font-mono)" }}>★ Robustness grid</span>
                    <div style={{ fontSize: "8px", color: "#0f766e", marginTop: 2, fontFamily: "var(--font-mono)" }}>18 seeded perturbed backtests</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector: Celery → DuckDB */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", maxWidth: 680, padding: "0 8px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0", width: "calc(25% + 8px)" }}>
                <div style={{ width: 1, height: 16, background: "#5c6059" }} />
                <span style={{ fontSize: "9px", color: "#8a9085", fontFamily: "var(--font-mono)", background: "#fbfbfa", padding: "1px 8px", border: "1px solid #ddddd9", whiteSpace: "nowrap" }}>in-process read</span>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #5c6059" }} />
              </div>
            </div>

            {/* DuckDB */}
            <div style={{ width: "50%", alignSelf: "flex-end", border: "1px solid #1a1c18", background: "#fff" }}>
              <div style={{ background: "#1a1c18", color: "#fff", padding: "7px 14px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px" }}>DUCKDB</span>
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-mono)" }}>alphalab.db · embedded</span>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  ["ohlcv", "price history (adj_close)"],
                  ["universe", "NIFTY 50 point-in-time members"],
                ].map(([tbl, desc]) => (
                  <div key={tbl} style={{ display: "flex", gap: 10, fontSize: "9px", fontFamily: "var(--font-mono)" }}>
                    <span style={{ fontWeight: 700, color: "#1a1c18", minWidth: 90 }}>{tbl}</span>
                    <span style={{ color: "#8a9085" }}>— {desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="sardar-grid-divider" />

      {/* ══ §2 TECHNOLOGY STACK ══════════════════════════════════ */}
      <div style={{ padding: "32px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="al-tag" style={{ marginBottom: 8 }}>TECHNOLOGY STACK</div>
          <h2 className="al-title-lg">Seven components, one pipeline</h2>
        </div>

        <div style={{ border: "1px solid #1a1c18", background: "#fff" }}>
          {[
            {
              component: "Next.js / React",
              role: "Frontend UI",
              desc: "App Router, TypeScript, RSC for initial leaderboard fetch, client components for interactive chart rendering. Deployed to Vercel.",
            },
            {
              component: "Recharts",
              role: "Visualization",
              desc: "Declarative React charting. Renders the baseline equity curve, the stressed curve overlay, the perturbation grid and the factor landscape — all from JSON returned by the API.",
            },
            {
              component: "FastAPI",
              role: "REST API layer",
              desc: "Async Python web framework. Validates requests and compiles formulas, records experiments in PostgreSQL, enqueues computation tasks, and serves results back to the browser. Performs no backtesting itself.",
            },
            {
              component: "Celery",
              role: "Distributed task execution",
              desc: "Executes the backtest and robustness jobs in a separate worker process (solo pool, one task at a time) so the API stays responsive. Single FIFO queue; re-running a task overwrites its own result row.",
            },
            {
              component: "Redis",
              role: "Message broker + result backend",
              desc: "Message broker between FastAPI and the Celery worker. Experiment status and all results live in PostgreSQL, not Redis.",
            },
            {
              component: "DuckDB",
              role: "Analytical data store",
              desc: "Embedded columnar database holding daily OHLCV prices for every stock that was in the NIFTY 50 between 2020 and 2025. No network round-trip; queried in-process by the Celery worker. Factor signals are computed on demand, never precomputed.",
            },
            {
              component: "Backtesting engine",
              role: "Vectorized compute core",
              desc: "Pure Python + NumPy/pandas vectorized engine. Converts factor signals into dollar-neutral weights and computes returns, Sharpe, drawdown and IC. The same code path executes the baseline and all 18 stressed runs.",
            },
          ].map((row, i, arr) => (
            <div
              key={row.component}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 160px 1fr",
                borderBottom: i < arr.length - 1 ? "1px solid #ddddd9" : "none",
              }}
            >
              <div
                style={{
                  padding: "13px 16px",
                  borderRight: "1px solid #ddddd9",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#1a1c18",
                  }}
                >
                  {row.component}
                </span>
              </div>
              <div
                style={{
                  padding: "13px 16px",
                  borderRight: "1px solid #ddddd9",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    color: "#0f766e",
                    textTransform: "uppercase",
                  }}
                >
                  {row.role}
                </span>
              </div>
              <div style={{ padding: "13px 16px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.55 }}>
                  {row.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sardar-grid-divider" />

      {/* ══ §3 USE CASES ════════════════════════════════════════ */}
      <div style={{ padding: "32px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="al-tag" style={{ marginBottom: 8 }}>USE CASES</div>
          <h2 className="al-title-lg">What questions does AlphaLab answer?</h2>
          <p className="al-body" style={{ maxWidth: 520, margin: "10px auto 0" }}>
            Each question below corresponds to a check AlphaLab actually runs on every
            submitted factor.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #1a1c18" }}>
          {[
            {
              num: "01",
              plain: "Is my signal real, or overfit to exact prices?",
              q: "If every historical price is jittered by 0.5–2% Gaussian noise, how much of the factor's baseline Sharpe ratio survives? A real pattern should barely notice; an overfit one collapses.",
            },
            {
              num: "02",
              plain: "Does my signal need a perfect data feed?",
              q: "With 5%, 10% or 20% of each stock's trading days removed in multi-day gaps, do the factor's rolling windows and lags still produce a profitable portfolio?",
            },
            {
              num: "03",
              plain: "Am I accidentally using tomorrow's data?",
              q: "Before anything runs, the DSL validator rejects formulas that shift data backwards in time — including disguised ones like delay(close, 0-1) — so a backtest can never look into the future.",
            },
            {
              num: "04",
              plain: "Which of my candidate factors holds up best?",
              q: "Across every factor submitted to the platform, the leaderboard and landscape chart rank candidates by robustness score against baseline Sharpe, so you can compare parameter windows and variants side by side.",
            },
          ].map((tile, i) => (
            <div
              key={tile.num}
              style={{
                padding: "26px 28px",
                borderRight: i % 2 === 0 ? "1px solid #1a1c18" : "none",
                borderBottom: i < 2 ? "1px solid #1a1c18" : "none",
                background: "#fff",
              }}
            >
              <div className="al-tag" style={{ color: "#0f766e", marginBottom: 8 }}>USE CASE {tile.num}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 500, color: "#1a1c18", marginBottom: 10, lineHeight: 1.3 }}>
                {tile.plain}
              </div>
              <p style={{ fontSize: "12px", color: "#8a9085", lineHeight: 1.7, margin: 0, borderTop: "1px solid #f3f3f1", paddingTop: 10 }}>
                {tile.q}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="sardar-grid-divider" />

      {/* ══ §4 REQUEST LIFECYCLE ═════════════════════════════════ */}
      <div style={{ padding: "32px 0" }}>
        <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "end" }}>
          <div>
            <div className="al-tag" style={{ marginBottom: 8 }}>REQUEST LIFECYCLE</div>
            <h2 className="al-title-lg">What happens when you run a backtest?</h2>
          </div>
          <p className="al-body">
            When you hit &quot;Run&quot;, your request travels through five distinct layers before
            results appear on screen. The heavy computation always happens in the background
            worker — the browser never crunches numbers, it only sends instructions and
            displays the finished output.
          </p>
        </div>

        {/* Step cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #1a1c18" }}>
          {[
            {
              step: "01",
              from: "Browser",
              to: "FastAPI",
              async: false,
              title: "You submit your request",
              plain: "You write a factor formula in the Research Lab and click Run. The browser sends a single HTTP request to the API with your experiment name and formula.",
              technical: "POST /experiments — synchronous HTTP with {name, description, factors: [{name, formula}]} in the JSON body.",
            },
            {
              step: "02",
              from: "FastAPI",
              to: "FastAPI",
              async: false,
              title: "The API validates and acknowledges",
              plain: "The server checks your request and compiles the formula (rejecting look-ahead), saves the experiment, and immediately sends it back. It doesn't make you wait — the actual work hasn't started yet.",
              technical: "Pydantic schema validation → compile_factor() → experiment + factor rows written with status=RUNNING → 201 Created {experiment} returned to browser.",
            },
            {
              step: "03",
              from: "FastAPI",
              to: "Redis",
              async: true,
              title: "The task is queued",
              plain: "The API drops a task message into Redis (the queue). This is asynchronous — the API's work is done. The message sits in the queue waiting for a worker to pick it up.",
              technical: "Celery .delay() → task message serialized to Redis broker. API returns immediately without blocking.",
            },
            {
              step: "04",
              from: "Redis",
              to: "Celery worker",
              async: true,
              title: "The worker picks up the job",
              plain: "The Celery worker process is always listening. It picks up your task from the queue and loads your factor from the database.",
              technical: "Worker dequeues run_backtest_task / run_robustness_task(factor_id) → loads the Factor row from Postgres.",
            },
            {
              step: "05",
              from: "Celery worker",
              to: "DuckDB → Celery worker",
              async: false,
              title: "The real calculation happens — entirely on the server",
              plain: "This is the core step. The worker reads NIFTY 50 stock prices directly from DuckDB, runs the baseline backtest, then re-runs it 18 times on deliberately damaged copies of the same data (price noise and missing days). Every run uses the exact same calculation code — only the input data differs.",
              technical: "(5a) SELECT ohlcv from DuckDB. (5b) Vectorized baseline backtest. (5c) ★ PerturbedStorage applies Gaussian price noise or drops runs of bars, seeded per run. (5d) Identical backtest re-run on each perturbed copy.",
              highlight: true,
            },
            {
              step: "06",
              from: "Celery worker",
              to: "PostgreSQL",
              async: false,
              title: "Results are stored and status updated",
              plain: "The worker saves the baseline metrics and equity curve, the robustness scores and a stressed equity curve, and marks the experiment Completed once both are saved.",
              technical: "INSERT into backtest_results / robustness_results (Postgres). UPDATE experiments SET status='COMPLETED' when both exist; 'FAILED' on error.",
            },
            {
              step: "07–08",
              from: "Browser",
              to: "FastAPI → Browser",
              async: true,
              title: "Your browser polls and receives results",
              plain: "While the worker was running, the browser kept checking \"is it done yet?\" every 3 seconds. Once the status flips to Complete, the browser fetches the full results and Recharts draws the two equity curves side by side.",
              technical: "Results page re-fetches GET /factors/{id}, /backtest and /robustness every 3 s. Once both results exist: render baseline + stressed curves via Recharts.",
            },
          ].map((s, i, arr) => (
            <div
              key={s.step}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                borderBottom: i < arr.length - 1 ? "1px solid #ddddd9" : "none",
                background: s.highlight ? "rgba(15,118,110,0.03)" : "#fff",
              }}
            >
              {/* Step number column */}
              <div
                style={{
                  borderRight: s.highlight ? "3px solid #0f766e" : "1px solid #ddddd9",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: s.highlight ? "#0f766e" : "#8a9085",
                  }}
                >
                  {s.step}
                </span>
              </div>

              {/* Content column */}
              <div style={{ padding: "20px 24px" }}>
                {/* Route badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", fontFamily: "var(--font-mono)", background: "#f3f3f1", border: "1px solid #ddddd9", padding: "2px 8px", whiteSpace: "nowrap" }}>
                    {s.from}
                  </span>
                  <span style={{ fontSize: "9px", color: "#8a9085" }}>{s.async ? "- - - -▶" : "──────▶"}</span>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", fontFamily: "var(--font-mono)", background: "#f3f3f1", border: "1px solid #ddddd9", padding: "2px 8px", whiteSpace: "nowrap" }}>
                    {s.to}
                  </span>
                  {s.async && <span style={{ fontSize: "8px", color: "#8a9085", fontStyle: "italic" }}>async</span>}
                </div>

                {/* Title */}
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: s.highlight ? "#0f766e" : "#1a1c18", marginBottom: 8, lineHeight: 1.3 }}>
                  {s.title}
                </div>

                {/* Plain explanation */}
                <p style={{ fontSize: "13px", color: "#5c6059", lineHeight: 1.7, margin: "0 0 10px" }}>
                  {s.plain}
                </p>

                {/* Technical detail */}
                <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#8a9085", background: "#fbfbfa", border: "1px solid #f0f0ee", padding: "7px 12px", lineHeight: 1.6 }}>
                  {s.technical}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integrity callout */}
        <div
          style={{
            marginTop: 16,
            border: "1px solid #ddddd9",
            borderLeft: "3px solid #0f766e",
            background: "rgba(15,118,110,0.03)",
            padding: "14px 20px",
            display: "flex",
            gap: 14,
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, color: "#0f766e", paddingTop: 1, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            INTEGRITY NOTE
          </div>
          <p style={{ fontSize: "11px", color: "#5c6059", lineHeight: 1.65, margin: 0 }}>
            Step 05 runs entirely server-side in the Celery worker. An earlier version of AlphaLab had a bug where the
            stressed series was generated in the browser using random numbers disconnected from real market data — meaning
            the comparison was meaningless. The robustness grid now reads the same DuckDB prices as the baseline,
            applies seeded price noise or removes trading days, and re-runs the identical backtest logic — so any difference
            you see between the two curves is attributable only to the perturbation.
          </p>
        </div>
      </div>

      <div className="sardar-grid-divider" />

      {/* ══ §5 SUBSYSTEM DEEP-DIVES ═════════════════════════════ */}
      <div style={{ padding: "32px 0" }}>
        <div style={{ marginBottom: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "end" }}>
          <div>
            <div className="al-tag" style={{ marginBottom: 8 }}>SUBSYSTEM DEEP-DIVES</div>
            <h2 className="al-title-lg">How every layer connects</h2>
          </div>
          <p className="al-body">
            Click any node in the interactive architecture map below to inspect the mathematical transformations,
            code symbols, and database interfaces running at that layer.
          </p>
        </div>

        {/* ── Detailed Lifecycle Walkthrough (Surrounding Prose) ───── */}
        <div style={{ marginTop: 24, marginBottom: 48 }}>
          <div className="al-tag" style={{ marginBottom: 12 }}>SYSTEM LIFECYCLE SEQUENCE</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {[
              {
                step: "01",
                title: "Client request payload transmission",
                flow: "Browser UI ──[ JSON HTTP Request ]──> FastAPI Web Server",
                prose: "Triggered when the user clicks 'Run Backtest & Evaluate' in the Research Lab. A Next.js server action sends the experiment name and the factor's DSL formula to the API with the user's bearer token. The universe (NIFTY 50) and date range (all stored history) are fixed server-side, and the stress grid is the same for every factor.",
                tech: "POST /experiments\nPayload: {\n  \"name\": \"Momentum Strategy\",\n  \"factors\": [{\n    \"name\": \"Risk-adjusted momentum\",\n    \"formula\": \"Momentum(20) / Volatility(10)\"\n  }]\n}"
              },
              {
                step: "02",
                title: "API validation, persistence, and task enqueueing",
                flow: "FastAPI Web Server ──[ SQL INSERT / Task Serialization ]──> PostgreSQL / Redis Broker",
                prose: "FastAPI receives the inbound HTTP payload and validates it against Pydantic models. It compiles each formula with the DSL compiler, rejecting syntax errors and look-ahead with a 422 before anything is saved. It then writes the experiment (status RUNNING) and its factors to PostgreSQL with SQLAlchemy. To avoid HTTP timeouts, the API does not run the backtest; it enqueues one backtest task and one robustness task per factor to Redis.",
                tech: "Experiment row inserted: status = 'RUNNING'\nCelery: run_backtest_task.delay(factor_id); run_robustness_task.delay(factor_id)\nHTTP Response returned to client: 201 Created { \"id\": \"uuid-v4\", \"status\": \"RUNNING\", \"factors\": [...] }"
              },
              {
                step: "03",
                title: "Celery task allocation and resource distribution",
                flow: "Redis Broker ──[ Celery Task Reservation ]──> Worker Process Pool",
                prose: "A single Celery worker, started alongside the API by render-start.sh, takes tasks from Redis one at a time in the order they were queued. The solo pool runs each task in the worker's main process, which keeps memory low on the free hosting tier; pandas vectorisation does the heavy lifting inside each task. Because the queue is FIFO, a factor's backtest finishes before its robustness task starts, so robustness can reuse the baseline Sharpe.",
                tech: "celery -A alphalab.worker.celery worker --pool=solo\nQueue Name: celery (single FIFO queue)\nConcurrency: 1 task at a time"
              },
              {
                step: "04",
                title: "DuckDB columnar database pricing queries",
                flow: "Celery Worker ──[ SQL Read Query ]──> DuckDB Storage",
                prose: "The worker opens the embedded DuckDB file in-process. It resolves every stock that was a NIFTY 50 member at any point in the stored date range, then reads their full daily price history in one columnar query, straight into a pandas DataFrame. Signals are later restricted to the days each stock was actually in the index.",
                tech: "SQL Query: SELECT ticker, date, open, high, low, close, volume, adj_close FROM ohlcv WHERE ticker IN ('RELIANCE.NS', 'TCS.NS', ...) AND date >= ? AND date <= ? ORDER BY ticker, date;\nReturns: pd.DataFrame with one row per (ticker, trading day)"
              },
              {
                step: "05",
                title: "Baseline backtest & robustness grid",
                flow: "Celery Worker ──[ Pandas math transformations ]──> Backtest Engine",
                prose: "The backtest task evaluates the compiled formula over the whole price panel, converts the signals into dollar-neutral weights each day, and computes the portfolio's next-day returns, Sharpe, drawdown and IC. The robustness task then re-runs that pipeline 18 times through the PerturbedStorage proxy, which derives each perturbed dataset from the real prices rather than generating fake data. It multiplies price columns by noise drawn from a normal distribution N(1, s^2) or drops consecutive chunks of trading bars. Noise is drawn independently per row, so it does not preserve cross-stock correlation. Each run uses its own fixed seed for reproducibility.",
                tech: "Baseline return: Rp,t = sum(w_i,t * r_i,t+1)\nNoise: P_perturbed = P_actual * (1 + N(0, sigma^2)),  sigma in {0.5%, 1%, 2%}\nSeeding: np.random.default_rng(42 + iteration), reproducible per run"
              },
              {
                step: "06",
                title: "Persisting backtest output",
                flow: "Celery Worker ──[ SQL INSERT / UPDATE ]──> PostgreSQL",
                prose: "The backtest task writes Sharpe, max drawdown, IC, the equity curve and one-sentence verdicts to PostgreSQL. The robustness task writes the noise, missing-data and overall scores, the 6-level perturbation grid and a representative stressed equity curve. When both results exist, the experiment is marked COMPLETED; if either task raises, it is marked FAILED. Results are not cached — every submission is computed fresh.",
                tech: "INSERT INTO backtest_results (factor_id, sharpe, max_drawdown, ic, equity_curve, ...)\nINSERT INTO robustness_results (factor_id, overall_score, perturbation_grid, stressed_equity_curve, ...)\nUPDATE experiments SET status = 'COMPLETED' WHERE id = ..."
              },
              {
                step: "07",
                title: "Client-side job polling loop",
                flow: "Browser UI ──[ Polling HTTP GET ]──> FastAPI Web Server",
                prose: "While the worker process executes the calculations, the results page re-renders on the server every 3 seconds and re-fetches the factor's detail, backtest and robustness endpoints. Once both results are present it shows the dashboard; if the experiment is FAILED it shows an error instead of waiting forever.",
                tech: "GET /factors/{id}  ·  GET /factors/{id}/backtest  ·  GET /factors/{id}/robustness\nPolling Interval: fixed 3000 ms (router.refresh())\nStops when: backtest and robustness results exist, or status = FAILED"
              },
              {
                step: "08",
                title: "Result rendering and chart visualization",
                flow: "FastAPI Web Server ──[ JSON Response ]──> Browser UI (Recharts)",
                prose: "The results page receives three JSON payloads: scalar metrics with verdict sentences, the baseline equity curve, and the robustness grid with the stressed curve. Recharts draws the baseline and stressed equity curves together with their divergence and a drawdown chart, and a bar chart of Sharpe at each of the six stress levels. Verdict sentences annotate each metric, and the page can be exported as a PDF tear sheet.",
                tech: "Visual Render: Recharts LineChart over { date, Baseline Factor, Stressed Factor, Divergence }\nGrid: BarChart of Sharpe per stress level\nAnnotations: verdict strings stored with the results"
              }
            ].map(item => (
              <div key={item.step} style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: "#1a1c18",
                      color: "#fff",
                      padding: "2px 6px"
                    }}>
                      {item.step}
                    </span>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1c18", margin: 0 }}>
                      {item.title}
                    </h3>
                  </div>
                  <span style={{ fontSize: "9.5px", fontFamily: "var(--font-mono)", color: "#8a9085", fontWeight: 600 }}>
                    {item.flow}
                  </span>
                </div>
                
                <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, margin: 0 }}>
                  {item.prose}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Technical architecture diagram ───────────────── */}
        {(() => {
          const activeCol = "#0f766e";

          // Define node dimensions and coordinates
          type TechNode = {
            id: string;
            label: string;
            badge: string;
            cx: number;
            cy: number;
            w: number;
            h: number;
            type: "orch" | "compute" | "storage" | "external";
            sub: string;
          };

          const NODES: TechNode[] = [
            { id: "api",     label: "API Orchestration",        badge: "5a", cx: 450, cy: 40,  w: 160, h: 46, type: "orch",     sub: "FastAPI + Celery dispatch" },
            { id: "dsl",     label: "DSL Compiler",             badge: "5f", cx: 160, cy: 110, w: 140, h: 42, type: "compute",  sub: "AST static validator" },
            { id: "ingest",  label: "Ingestion Pipeline",       badge: "5j", cx: 740, cy: 110, w: 140, h: 42, type: "compute",  sub: "Yahoo Finance feed" },
            { id: "eval",    label: "Factor Evaluator",         badge: "5g", cx: 160, cy: 190, w: 140, h: 42, type: "compute",  sub: "Signal weight matrix" },
            { id: "data",    label: "DuckDB Database",          badge: "5b", cx: 740, cy: 190, w: 140, h: 42, type: "storage",  sub: "Columnar OHLCV" },
            { id: "backtest",label: "Backtesting Engine",       badge: "5c", cx: 160, cy: 270, w: 140, h: 42, type: "compute",  sub: "Baseline simulation" },
            { id: "perturb", label: "PerturbedStorage",         badge: "5h", cx: 450, cy: 190, w: 140, h: 42, type: "storage",  sub: "Storage intercept proxy" },
            { id: "stress",  label: "Robustness Grid",          badge: "5d", cx: 450, cy: 270, w: 160, h: 42, type: "compute",  sub: "18 perturbed backtests" },
            { id: "cache",   label: "Results Storage",          badge: "5e", cx: 450, cy: 350, w: 160, h: 46, type: "storage",  sub: "PostgreSQL" },
            { id: "verdict", label: "LLM Verdict Engine",      badge: "5i", cx: 740, cy: 350, w: 140, h: 42, type: "external", sub: "Gemini / OpenAI API" },
          ];

          type TechEdge = {
            from: string;
            to: string;
            label: string;
            fromPort: "t" | "b" | "l" | "r";
            toPort: "t" | "b" | "l" | "r";
            dashed?: boolean;
          };

          const EDGES: TechEdge[] = [
            { from: "api",      to: "dsl",      label: "factor formula string",           fromPort: "l", toPort: "t" },
            { from: "api",      to: "ingest",   label: "startup bootstrap (not per request)", fromPort: "r", toPort: "t", dashed: true },
            { from: "dsl",      to: "eval",     label: "compiled execute() callable",     fromPort: "b", toPort: "t" },
            { from: "ingest",   to: "data",     label: "clean OHLCV DataFrame",           fromPort: "b", toPort: "t" },
            { from: "data",     to: "eval",     label: "2020–2025 OHLCV panel",      fromPort: "l", toPort: "r", dashed: true },
            { from: "eval",     to: "backtest", label: "portfolio weights matrix",        fromPort: "b", toPort: "t" },
            { from: "data",     to: "perturb",  label: "OHLCV data intercepts",           fromPort: "l", toPort: "r", dashed: true },
            { from: "perturb",  to: "stress",   label: "perturbed pricing arrays",        fromPort: "b", toPort: "t" },
            { from: "backtest", to: "cache",    label: "baseline metrics + curve",          fromPort: "b", toPort: "l" },
            { from: "stress",   to: "cache",    label: "scores + grid + curve",          fromPort: "b", toPort: "t" },
            { from: "cache",    to: "verdict",  label: "Sharpe/Drawdown metrics dict",    fromPort: "r", toPort: "l" },
            { from: "verdict",  to: "cache",    label: "single-sentence diagnostic text", fromPort: "b", toPort: "r", dashed: true },
          ];

          const getPortCoords = (node: TechNode, port: "t" | "b" | "l" | "r") => {
            if (port === "t") return { x: node.cx, y: node.cy - node.h / 2 };
            if (port === "b") return { x: node.cx, y: node.cy + node.h / 2 };
            if (port === "l") return { x: node.cx - node.w / 2, y: node.cy };
            return { x: node.cx + node.w / 2, y: node.cy };
          };

          const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

          const typeColors = {
            orch:     { fill: "#1a1c18", stroke: "#1a1c18", text: "#ffffff" },
            compute:  { fill: "#f0fdf4", stroke: "#16a34a", text: "#166534" },
            storage:  { fill: "#ecfeff", stroke: "#0891b2", text: "#155e75" },
            external: { fill: "#fff7ed", stroke: "#ea580c", text: "#9a3412" },
          } as const;

          return (
            <div style={{ marginBottom: 0 }}>
              {/* Legend & Categories */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fbfbfa",
                border: "1px solid #ddddd9",
                padding: "12px 18px",
                borderBottom: "none",
                flexWrap: "wrap",
                gap: 12
              }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {Object.entries(typeColors).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 14,
                        height: 10,
                        background: value.fill,
                        border: `1px solid ${value.stroke}`,
                        borderRadius: 1
                      }} />
                      <span style={{ fontSize: "9px", color: "#5c6059", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                        {key === "orch" ? "Orchestration" : key === "compute" ? "Execution / Math" : key === "storage" ? "Data / Storage" : "External APIs"}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 18, height: 1, borderTop: "1px solid #1a1c18" }} />
                    <span style={{ fontSize: "9px", color: "#8a9085", fontFamily: "var(--font-mono)" }}>Synchronous call</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 18, height: 1, borderTop: "1px dashed #8a9085" }} />
                    <span style={{ fontSize: "9px", color: "#8a9085", fontFamily: "var(--font-mono)" }}>Asynchronous dispatch</span>
                  </div>
                </div>
              </div>

              {/* SVG Map */}
              <div style={{ border: "1px solid #1a1c18", background: "#ffffff", overflowX: "auto" }}>
                <svg
                  viewBox="0 0 900 410"
                  style={{ width: "100%", maxWidth: 900, display: "block", userSelect: "none" }}
                >
                  <defs>
                    <marker id="arrowhead" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#4b5563" />
                    </marker>
                    <marker id="arrowhead-active" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={activeCol} />
                    </marker>
                  </defs>

                  {/* Edges / Connections */}
                  {EDGES.map((edge, i) => {
                    const fromNode = nodeMap[edge.from];
                    const toNode = nodeMap[edge.to];
                    if (!fromNode || !toNode) return null;

                    const fp = getPortCoords(fromNode, edge.fromPort);
                    const tp = getPortCoords(toNode, edge.toPort);

                    const isHighlight = activeSubsystem === edge.from || activeSubsystem === edge.to;
                    const strokeColor = isHighlight ? activeCol : "#cbd5e1";
                    const strokeWidth = isHighlight ? 1.8 : 1;

                    // Draw clean path with a midpoint bend if they are far
                    const dx = tp.x - fp.x;
                    const dy = tp.y - fp.y;
                    let pathD = `M ${fp.x} ${fp.y}`;

                    if (Math.abs(dx) > 10 && Math.abs(dy) > 10) {
                      // Curved helper path
                      const cx1 = fp.x + (edge.fromPort === "l" ? -dx * 0.3 : edge.fromPort === "r" ? dx * 0.3 : 0);
                      const cy1 = fp.y + (edge.fromPort === "t" ? -dy * 0.3 : edge.fromPort === "b" ? dy * 0.3 : 0);
                      const cx2 = tp.x + (edge.toPort === "l" ? -dx * 0.3 : edge.toPort === "r" ? dx * 0.3 : 0);
                      const cy2 = tp.y + (edge.toPort === "t" ? -dy * 0.3 : edge.toPort === "b" ? dy * 0.3 : 0);
                      pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tp.x} ${tp.y}`;
                    } else {
                      // Straight or L-bend
                      pathD += ` L ${tp.x} ${tp.y}`;
                    }

                    return (
                      <g key={i}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={edge.dashed ? "4 3" : undefined}
                          markerEnd={isHighlight ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                          style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                        />
                        {/* Edge Label text container */}
                        <text
                          x={fp.x + dx * 0.5}
                          y={fp.y + dy * 0.5 - 5}
                          fontSize={7.5}
                          fontFamily="var(--font-mono)"
                          fill={isHighlight ? activeCol : "#64748b"}
                          textAnchor="middle"
                          style={{ pointerEvents: "none", transition: "fill 0.2s" }}
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Labeled Boxes */}
                  {NODES.map(node => {
                    const isActive = activeSubsystem === node.id;
                    const styleConf = typeColors[node.type];

                    const strokeColor = isActive ? activeCol : styleConf.stroke;
                    const fillColor = isActive ? "rgba(15,118,110,0.06)" : styleConf.fill;
                    const strokeWidth = isActive ? 2.5 : 1.2;

                    return (
                      <g
                        key={node.id}
                        onClick={() => setActiveSubsystem(node.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Main box */}
                        <rect
                          x={node.cx - node.w / 2}
                          y={node.cy - node.h / 2}
                          width={node.w}
                          height={node.h}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          rx={2}
                          style={{ transition: "all 0.15s ease" }}
                        />
                        {/* Section badge code indicator */}
                        <text
                          x={node.cx - node.w / 2 + 6}
                          y={node.cy - node.h / 2 + 11}
                          fontSize={7}
                          fontFamily="var(--font-mono)"
                          fill={isActive ? activeCol : "#94a3b8"}
                          fontWeight={700}
                        >
                          §{node.badge}
                        </text>
                        {/* Main label text */}
                        <text
                          x={node.cx}
                          y={node.cy + 1}
                          fontSize={9.5}
                          fontWeight={700}
                          fontFamily="var(--font-sans)"
                          fill={isActive ? activeCol : (node.type === "orch" ? "#ffffff" : "#1e293b")}
                          textAnchor="middle"
                        >
                          {node.label}
                        </text>
                        {/* Subtitle description */}
                        <text
                          x={node.cx}
                          y={node.cy + 11}
                          fontSize={7.5}
                          fontFamily="var(--font-sans)"
                          fill={isActive ? activeCol : (node.type === "orch" ? "#cbd5e1" : "#64748b")}
                          textAnchor="middle"
                        >
                          {node.sub}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Status bar */}
              <div style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fbfbfa",
                border: "1px solid #1a1c18",
                padding: "8px 16px"
              }}>
                <span style={{ fontSize: "11px", color: "#8a9085", fontFamily: "var(--font-mono)" }}>
                  ACTIVE DOCUMENTATION LAYER:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SUBSYSTEMS.map(n => (
                    <button
                      key={n.id}
                      onClick={() => setActiveSubsystem(n.id)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "9px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        cursor: "pointer",
                        border: activeSubsystem === n.id ? "1px solid #0f766e" : "1px solid #ddddd9",
                        background: activeSubsystem === n.id ? "rgba(15,118,110,0.07)" : "#ffffff",
                        color: activeSubsystem === n.id ? "#0f766e" : "#8a9085",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n.badge} {n.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}


        <div style={{ border: "1px solid #1a1c18", borderTop: "1px solid #ddddd9", background: "#fff", marginTop: 16 }}>

          {/* ── 5a API ──────────────────────────────────────────── */}
          {activeSubsystem === "api" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>
                API &amp; Job Orchestration Layer
              </h3>
              <p className="al-body" style={{ marginBottom: 28 }}>
                FastAPI handles all inbound HTTP traffic. It validates and records experiments and
                hands the work to Celery — the API itself performs no backtesting.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>FLOWCHART — Request path</div>
              <div
                style={{
                  border: "1px solid #ddddd9",
                  background: "#fbfbfa",
                  padding: 20,
                  marginBottom: 28,
                  overflowX: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 0,
                    minWidth: 560,
                    marginBottom: 16,
                  }}
                >
                  <Box label="POST /experiments" sub="name + factors[{name, formula}]" />
                  <Arr label="validate" />
                  <Box label="Pydantic + compile_factor" sub="422 on bad or leaking formula" />
                  <Arr label="pass" />
                  <Box label="Insert experiment" sub="status = RUNNING" />
                  <Arr label="201" />
                  <Box label="Celery .delay() × 2" sub="backtest + robustness → Redis" />
                  <Arr label="async" dashed />
                  <Box label="Worker runs tasks" sub="in queue order" accent />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 0,
                    minWidth: 400,
                  }}
                >
                  <Box label="GET /factors/{id} + /backtest + /robustness" sub="results page, every 3 s" />
                  <Arr label="reads" />
                  <Box label="PostgreSQL" sub="experiment status + result rows" />
                  <Arr label="returns" />
                  <Box label="{ status, metrics, curves }" sub="404 until a result exists" accent />
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>EXPLANATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Access
                  </div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7 }}>
                    Submitting experiments and reading factor details need a JWT bearer token. The
                    leaderboard is public and lists every user&apos;s factors; <M>GET /experiments</M>{" "}
                    (the History page) returns only the logged-in user&apos;s own work.
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Experiment status
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {["RUNNING", "→", "COMPLETED"].map((s, i) => (
                      <span key={i} style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: s === "→" ? "#8a9085" : "#1a1c18",
                        background: s === "→" ? "transparent" : "#f3f3f1",
                        padding: s === "→" ? 0 : "3px 8px",
                        border: s === "→" ? "none" : "1px solid #ddddd9",
                      }}>{s}</span>
                    ))}
                    <span style={{ color: "#8a9085", fontSize: "10px" }}>or</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600, color: "#b91c1c", background: "#fef2f2", padding: "3px 8px", border: "1px solid #fca5a5" }}>FAILED</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7 }}>
                    The API creates experiments as RUNNING. The worker sets COMPLETED once every
                    factor has both results, or FAILED if a task raises. The browser only reads status.
                  </p>
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>POLLING</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                  While results are missing, the results page calls <M>router.refresh()</M> on a fixed interval,
                  which re-runs the server component and re-fetches all three factor endpoints:
                </p>
                <FormulaBlock>{"interval = 3000 ms   (fixed)\n\nstop when:  backtest and robustness results exist\n       or:  experiment status = FAILED"}</FormulaBlock>
                <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 8, lineHeight: 1.6 }}>
                  On the hosted deployment a full run (one backtest plus 18 robustness backtests) typically takes
                  a minute or more, longer if the server is waking from sleep.
                </p>
              </div>
            </div>
          )}

          {/* ── 5b Data Layer ────────────────────────────────────── */}
          {activeSubsystem === "data" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>
                Data Layer — DuckDB
              </h3>
              <p className="al-body" style={{ marginBottom: 28 }}>
                Daily prices for every stock that was in the NIFTY 50 between 2020 and 2025 are stored in
                an embedded DuckDB file. The worker reads from it in-process — no TCP connection, no
                serialization overhead.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>SCHEMA DIAGRAM</div>
              <div
                style={{
                  border: "1px solid #ddddd9",
                  background: "#fbfbfa",
                  padding: 20,
                  marginBottom: 28,
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                  {[
                    {
                      name: "ohlcv",
                      cols: ["ticker   VARCHAR", "date     DATE", "open     FLOAT", "high     FLOAT", "low      FLOAT", "close    FLOAT", "volume   BIGINT", "adj_close FLOAT"],
                    },
                    {
                      name: "universe",
                      cols: ["ticker         VARCHAR", "index_name     VARCHAR", "effective_from DATE", "effective_to   DATE"],
                    },
                  ].map((tbl, ti, arr) => (
                    <React.Fragment key={tbl.name}>
                      <div style={{ border: "1px solid #1a1c18", background: "#fff", minWidth: 150 }}>
                        <div style={{ background: "#1a1c18", color: "#fff", padding: "5px 12px", fontSize: "9px", fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>
                          {tbl.name}
                        </div>
                        {tbl.cols.map((c) => (
                          <div key={c} style={{ padding: "3px 12px", fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5c6059", borderBottom: "1px solid #f3f3f1" }}>{c}</div>
                        ))}
                      </div>
                      {ti < arr.length - 1 && (
                        <div style={{ display: "flex", alignItems: "center", paddingTop: 40 }}>
                          <Arr label="membership filter" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", paddingTop: 40 }}>
                    <Arr label="→ worker DataFrame" />
                  </div>
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>EXPLANATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Why DuckDB?</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7 }}>
                    DuckDB is columnar: a rolling 20-day mean across 50 tickers scans a single column, not
                    50 × 20 row lookups. PostgreSQL (row-oriented, network-bound) is optimized for OLTP;
                    DuckDB is purpose-built for this analytical scan pattern. No server process means zero
                    cold-start latency.
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Stored vs. on-demand</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7 }}>
                    Only raw OHLCV prices are stored. Factor signals and daily returns are computed
                    on demand from <M>adj_close</M>. Index membership comes from a versioned CSV of
                    constituent intervals, so each stock only counts on days it was actually in the
                    NIFTY 50 — including stocks that later left the index (no survivorship bias).
                  </p>
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>RETURN CALCULATION</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                  Daily simple returns from split/dividend-adjusted close prices:
                </p>
                <FormulaBlock>{"r_t = (P_t − P_{t−1}) / P_{t−1}"}</FormulaBlock>
                <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 8, lineHeight: 1.6 }}>
                  <M>{"P_t"}</M> is the adjusted close price on day <em>t</em>. Using{" "}
                  <M>adj_close</M> means stock splits and dividends are already reflected — the
                  return series is economically comparable across the full lookback window without
                  an additional corporate-action adjustment step.
                </p>
              </div>
            </div>
          )}

          {/* ── 5c Backtesting Engine ───────────────────────────── */}
          {activeSubsystem === "backtest" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>
                Backtesting Engine — Baseline Path
              </h3>
              <p className="al-body" style={{ marginBottom: 28 }}>
                The backtesting engine converts factor signals into daily portfolio weights and
                computes the resulting return series and metrics. The computation is vectorized
                pandas — no per-stock Python loops.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>PIPELINE DIAGRAM — Vectorized computation</div>
              <div
                style={{
                  border: "1px solid #ddddd9",
                  background: "#fbfbfa",
                  padding: 20,
                  marginBottom: 28,
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "nowrap", minWidth: 640 }}>
                  <Box label="Factor signals" sub="[date × ticker] long table" />
                  <Arr label="cross-sect. z-score" />
                  <Box label="Weights w_{i,t}" sub="long-short, sum-to-zero" />
                  <Arr label="× next-day return" />
                  <Box label="Returns r_{i,t+1}" sub="from DuckDB adj_close" />
                  <Arr label="Σ w·r" />
                  <Box label="R_{p,t}" sub="portfolio return, scalar/day" />
                  <Arr label="cumprod" />
                  <Box label="C_t — equity curve" sub="cumulative return series" accent />
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>EXPLANATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Factor signals to weights</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7 }}>
                    On each date <em>t</em>, signals are z-scored across that day&apos;s index members.
                    Stocks above the day&apos;s mean get positive weight in proportion to their z-score,
                    stocks below it get negative weight. Weights sum to zero (dollar-neutral long/short)
                    and are scaled so <M>{"|w|_1 = 1"}</M>.
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Vectorization</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7 }}>
                    The formula is evaluated once over the whole price panel with grouped pandas
                    operations (time-series functions per ticker, cross-sectional ones per date), not a
                    Python loop per stock or day. A 6-year, ~65-stock backtest takes well under a second.
                  </p>
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>MATHEMATICS</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Portfolio return (daily)
                    </div>
                    <FormulaBlock>{"R_{p,t} = Σᵢ wᵢ,ₜ · rᵢ,ₜ₊₁   (i = 1…N_t)"}</FormulaBlock>
                    <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 6, lineHeight: 1.6 }}>
                      <M>{"N_t"}</M> = index members with a signal on date <em>t</em>. Weights set at
                      day <em>t</em>&apos;s close earn day <em>t+1</em>&apos;s return. No transaction costs
                      or slippage are modelled.
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Equity curve and metrics
                    </div>
                    <FormulaBlock>{"C_t = Πˢ⁼¹ᵗ (1 + R_{p,s})          (starts at 1.0)\n\nSharpe = mean(R_p) · 252 / (std(R_p) · √252)\nMaxDD  = max_t (peak_t − C_t) / peak_t\nIC     = mean_t SpearmanCorr(signal_t, r_{t+1})"}</FormulaBlock>
                    <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 6, lineHeight: 1.6 }}>
                      Baseline and stressed runs use these same formulas — they differ only in their
                      input prices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 5d Robustness Grid ───────────────────────────────── */}
          {activeSubsystem === "stress" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>
                Robustness Grid
              </h3>
              <p className="al-body" style={{ marginBottom: 4 }}>
                The differentiating subsystem of AlphaLab. After the baseline backtest, the same factor is
                re-run 18 times on deliberately damaged copies of the real price history. A factor whose
                Sharpe ratio survives the damage is scored as robust; one whose Sharpe collapses is flagged
                as likely overfit to the exact historical prices.
              </p>
              <div
                style={{
                  marginBottom: 28,
                  padding: "9px 14px",
                  background: "rgba(15,118,110,0.05)",
                  border: "1px solid rgba(15,118,110,0.2)",
                  fontSize: "11px",
                  color: "#0f766e",
                  fontWeight: 500,
                }}
              >
                Every run happens server-side in the Celery worker, on the real DuckDB prices, through the
                same evaluator, portfolio and metrics code as the baseline (see §5h PerturbedStorage).
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>PIPELINE DIAGRAM — 18-run grid</div>
              <div
                style={{
                  border: "1px solid #ddddd9",
                  background: "#fbfbfa",
                  padding: 20,
                  marginBottom: 28,
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "nowrap", marginBottom: 10, minWidth: 660 }}>
                  <Box label="Baseline Sharpe S₀" sub="from the backtest task" />
                  <Arr />
                  <Box label="6 stress levels" sub="3 noise · 3 missing-data" />
                  <Arr label="× 3 seeds" />
                  <Box label="★ 18 perturbed backtests" sub="seed = 42, 43, 44 per level" accent />
                  <Arr label="avg per level" />
                  <Box label="Retention per level" sub="S̄_level / S₀, clamped [0, 1]" />
                  <Arr />
                  <Box label="Robustness score" sub="mean of both families" accent />
                </div>
                <p style={{ fontSize: "9px", color: "#8a9085", marginTop: 10 }}>
                  ★ Seeds differ between the three runs of a level, so they are independent draws; each run is still exactly reproducible.
                </p>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>THE STRESS GRID</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fff", marginBottom: 28 }}>
                {[
                  { type: "Gaussian price noise", desc: "Levels σ = 0.5%, 1%, 2%. Every OHLC price on every stock-day is multiplied by (1 + ε), ε ~ N(0, σ²); volume gets its own independent draw. Tests whether the signal depends on exact price levels rather than a real pattern." },
                  { type: "Missing trading days", desc: "Levels 5%, 10%, 20% of each stock's rows removed, mostly in runs of 5 consecutive days. Rolling windows and lags then span the gaps. Tests whether the signal needs a perfectly clean, gap-free feed." },
                  { type: "Runs per level", desc: "3 iterations with seeds 42, 43 and 44; the level's Sharpe is the average of the three. 2 families × 3 levels × 3 seeds = 18 backtests." },
                ].map((s, i, arr) => (
                  <div key={s.type} style={{ padding: "12px 20px", borderBottom: i < arr.length - 1 ? "1px solid #f3f3f1" : "none", display: "flex", gap: 16 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, color: "#1a1c18", minWidth: 160, paddingTop: 2, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.3px" }}>{s.type}</div>
                    <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>MATHEMATICS — SCORING</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* 1 */}
                <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>1 — Sharpe retention per level</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                    For each stress level <M>ℓ</M>, average the Sharpe of its three seeded runs and compare it with the clean baseline <M>S₀</M>:
                  </p>
                  <FormulaBlock>{"S̄_ℓ = (S_ℓ,42 + S_ℓ,43 + S_ℓ,44) / 3\n\nretention_ℓ = clamp( S̄_ℓ / S₀ , 0, 1 )       if S₀ > 0\nretention_ℓ = 0                                if S₀ ≤ 0"}</FormulaBlock>
                  <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 8, lineHeight: 1.6 }}>
                    Retention is capped at 1 because noise cannot make a factor more robust than its own clean baseline. A factor that loses money at baseline scores 0 — robustness is not meaningful for it.
                  </p>
                </div>

                {/* 2 */}
                <div style={{ border: "1px solid #1a1c18", background: "#fbfbfa", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#1a1c18", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>2 — Robustness score ★</div>
                  <FormulaBlock>{"noise_score        = mean(retention at σ = 0.5%, 1%, 2%)\nmissing_data_score = mean(retention at 5%, 10%, 20% dropped)\n\noverall_score = (noise_score + missing_data_score) / 2\n\nRobust  ⇔  overall_score ≥ 0.80"}</FormulaBlock>
                  <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 8, lineHeight: 1.6 }}>
                    In words: a robust factor keeps at least 80% of its baseline Sharpe, on average, across the six stress levels. This is the x-axis of the Home page landscape chart.
                  </p>
                </div>

                {/* 3 */}
                <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>3 — Failure diagnosis</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                    Each family score is compared with a 0.70 sensitivity threshold to name the dominant weakness shown on the results page:
                  </p>
                  <FormulaBlock>{"S₀ ≤ 0                                 → not_profitable\nnoise < 0.70  and  missing < 0.70    → both\nnoise < 0.70                          → noise_sensitive\nmissing < 0.70                        → missing_data_sensitive\notherwise                             → none"}</FormulaBlock>
                </div>

                {/* 4 */}
                <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>4 — Stressed equity curve</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 0 }}>
                    The first run of each of the six levels produces an equity curve. The curves are sorted by maximum drawdown and the median one is stored and drawn as the &quot;Stressed Factor&quot; line next to the baseline — a typical stressed outcome, neither the best nor the worst.
                  </p>
                </div>

                {/* 5 */}
                <div style={{ border: "1px solid #ddddd9", borderLeft: "3px solid #b45309", background: "#fffbeb", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#b45309", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>5 — What the score does not measure</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, margin: 0 }}>
                    The perturbations are synthetic. Noise is drawn independently for every stock-day, so it does not preserve correlation between stocks, and there is no volatility-regime, crash-replay or walk-forward out-of-sample test. A high score means the signal is stable under data-quality damage — not that it will make money in live markets. Backtests also ignore transaction costs and slippage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── 5e Results Storage ───────────────────────────────── */}
          {activeSubsystem === "cache" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>
                Results Storage
              </h3>
              <p className="al-body" style={{ marginBottom: 28 }}>
                Each factor has one backtest row and one robustness row in PostgreSQL. There is no results
                cache: every submission is computed fresh, and re-running a task overwrites its own row.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>WRITE PATH</div>
              <div
                style={{
                  border: "1px solid #ddddd9",
                  background: "#fbfbfa",
                  padding: 20,
                  marginBottom: 28,
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "nowrap", marginBottom: 16, minWidth: 560 }}>
                  <Box label="run_backtest_task" sub="metrics + equity curve + verdicts" />
                  <Arr label="upsert" />
                  <Box label="backtest_results" sub="PK factor_id" accent />
                  <Arr />
                  <Box label="Completion check" sub="both rows at current engine version?" />
                  <Arr label="yes" />
                  <Box label="experiments.status" sub="→ COMPLETED" accent />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "nowrap", minWidth: 560 }}>
                  <Box label="run_robustness_task" sub="scores + grid + stressed curve" />
                  <Arr label="upsert" />
                  <Box label="robustness_results" sub="PK factor_id" accent />
                  <Arr label="on exception" dashed />
                  <Box label="experiments.status" sub="→ FAILED" />
                </div>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>STORED COLUMNS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                <FormulaBlock>{"backtest_results\n  sharpe, max_drawdown, ic\n  equity_curve       JSON [{date, cumulative_return}]\n  verdict_sharpe / _ic / _mdd\n  daily_mean, daily_std\n  mdd_peak_date, mdd_trough_date\n  engine_version"}</FormulaBlock>
                <FormulaBlock>{"robustness_results\n  noise_score, missing_data_score\n  overall_score\n  perturbation_grid      JSON (6 levels)\n  failure_reasons        JSON\n  stressed_equity_curve  JSON\n  verdict_robustness, engine_version"}</FormulaBlock>
              </div>

              <div className="al-tag" style={{ marginBottom: 12 }}>KEEPING RESULTS CURRENT</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20 }}>
                <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                  Every row records the engine version that produced it. When the methodology changes the version is bumped, and on every server start a maintenance step re-queues factors whose results are missing or out of date:
                </p>
                <FormulaBlock>{"stale ⇔ experiment not FAILED  and\n        (backtest missing  or  backtest.engine_version ≠ ENGINE_VERSION\n         or robustness missing  or  robustness.engine_version ≠ ENGINE_VERSION)"}</FormulaBlock>
                <p style={{ fontSize: "11px", color: "#8a9085", marginTop: 8, lineHeight: 1.6 }}>
                  The same check recovers jobs interrupted by a server restart. Each result is saved as soon as it finishes, so an interrupted re-run resumes with only the remaining factors. Factors whose formula no longer passes the validator have their old results removed and are marked FAILED.
                </p>
              </div>
            </div>
          )}

          {/* --- 5f DSL Compiler ------------------------------------ */}
          {activeSubsystem === "dsl" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>DSL Compiler</h3>
              <p className="al-body" style={{ marginBottom: 6 }}>
                Every factor you type - e.g. <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: "#f3f3f1", padding: "1px 6px" }}>Momentum(20) / Volatility(10)</code> - is a formula written in AlphaLab&apos;s own Domain-Specific Language. Before any backtest runs, that string is compiled in five sequential stages into an executable Python function.
              </p>
              <p className="al-body" style={{ marginBottom: 24, color: "#8a9085" }}>
                Think of it like a tiny programming language purpose-built for quant signals. The compiler checks your formula for mathematical validity and - critically - rejects any formula that would peek at future data and thus produce a misleadingly good backtest.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>COMPILATION PIPELINE</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20, marginBottom: 28, overflowX: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 640 }}>
                  <Box label="Raw formula string" sub='"Momentum(20)/Volatility(10)"' />
                  <Arr label="step 1" />
                  <Box label="Lexer" sub="tokenises into NUMBER / IDENTIFIER / OP" />
                  <Arr label="step 2" />
                  <Box label="Parser" sub="recursive descent -> AST" />
                  <Arr label="step 3" />
                  <Box label="StaticValidator" sub="arity + look-ahead bias checks" accent />
                  <Arr label="step 4" />
                  <Box label="PandasCompiler" sub="AST -> Python callable" />
                  <Arr label="step 5" />
                  <Box label="execute(df)" sub="returns Series of signals" accent />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Step 1 - Lexer (lexer.py)</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                    Scans the raw string character-by-character using a regex OR-chain and emits a flat list of typed tokens: NUMBER, IDENTIFIER, LPAREN, RPAREN, COMMA, and the four operators. Whitespace is silently dropped. Unknown characters raise DSLCompilationError.
                  </p>
                  <FormulaBlock>{`"Momentum(20)" ->\n  IDENTIFIER("Momentum")  LPAREN  NUMBER(20)  RPAREN`}</FormulaBlock>
                </div>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Step 2 - Parser (parser.py)</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                    Recursive-descent parser that consumes the token stream and builds an Abstract Syntax Tree. Handles operator precedence (* / before + -), unary minus, parentheses and nested function calls. Produces four node types: FunctionCall, BinaryOp, NumberLiteral, Variable.
                  </p>
                  <FormulaBlock>{`Momentum(20) / Volatility(10) ->\n  BinaryOp(\n    left  = FunctionCall(Momentum, [20]),\n    op    = \"/\",\n    right = FunctionCall(Volatility, [10])\n  )`}</FormulaBlock>
                </div>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Step 3 - StaticValidator (validator.py)</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                    Traverses the AST and enforces: (1) every function is in the registry (13 primitives) and every variable is a known column, (2) argument counts match declared arity, (3) window and shift arguments are constants - they are folded first, so delay(close, 0-1) is caught exactly like delay(close, -1). Raises DataLeakageError for look-ahead and DSLCompilationError for everything else. The API runs this on submission and returns 422.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      ["Momentum / Volatility / RollingMean / RollingStd", "1 arg * constant window > 0"],
                      ["delay / Lag", "2 args * constant shift >= 0 (negative -> DataLeakageError)"],
                      ["delta / ts_max / ts_min / ts_rank", "2 args * constant window > 0"],
                      ["correlation", "3 args * constant window > 0"],
                      ["rank", "1 arg * cross-sectional, per date"],
                      ["scale", "2 args * constant target"],
                      ["variables", "open high low close volume returns (+ Price/Volume/Open/High/Low)"],
                    ].map(([fn, rule]) => (
                      <div key={fn} style={{ display: "flex", gap: 12, fontSize: "10px", fontFamily: "var(--font-mono)", alignItems: "flex-start" }}>
                        <span style={{ fontWeight: 700, color: "#1a1c18", minWidth: 200, flexShrink: 0 }}>{fn}</span>
                        <span style={{ color: "#8a9085" }}>- {rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Step 4 - PandasCompiler (compiler.py)</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 8 }}>
                    Recursively transforms each AST node into a Python lambda over the full price panel (all tickers, sorted by ticker then date). Time-series functions group by ticker so no stock sees another&apos;s data; rank and scale group by date. The root lambda becomes the execute function handed to FactorEvaluator.
                  </p>
                  <FormulaBlock>{`FunctionCall(Momentum, [20])\n  -> close.groupby(ticker).transform(\n       lambda s: s.pct_change(20))\n\nFunctionCall(rank, [x])\n  -> x.groupby(date).rank(pct=True)\n\nBinaryOp(left, \"/\", right)\n  -> lambda df: left(df) / right(df)`}</FormulaBlock>
                </div>
              </div>
            </div>
          )}

          {/* --- 5g Factor Evaluator + Portfolio Constructor --------- */}
          {activeSubsystem === "eval" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>Factor Evaluator & Portfolio Constructor</h3>
              <p className="al-body" style={{ marginBottom: 6 }}>
                Once the DSL compiler produces an execute(df) function, two classes turn it into a weighted portfolio ready for backtesting.
              </p>
              <p className="al-body" style={{ marginBottom: 24, color: "#8a9085" }}>
                The evaluator applies the compiled function to the whole price panel and keeps each stock only on the days it was an index member, then the portfolio constructor converts those signals into dollar-neutral weights by cross-sectionally z-scoring them each day. Long positions go to stocks with above-average signals; short positions to below-average.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>SIGNAL-TO-WEIGHT PIPELINE</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20, marginBottom: 28, overflowX: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 680 }}>
                  <Box label="compiled execute(df)" sub="DSL output" />
                  <Arr label="whole panel" />
                  <Box label="FactorEvaluator" sub="signals_df: date x ticker x signal" accent />
                  <Arr label="point-in-time" />
                  <Box label="Membership filter" sub="index members on each date" />
                  <Arr label="z-score" />
                  <Box label="PortfolioConstructor" sub="weights_df: date x ticker x weight" accent />
                  <Arr label="to backtest" />
                  <Box label="PerformanceCalculator" sub="daily portfolio returns" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>FactorEvaluator - evaluator.py</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 10 }}>
                    Reads OHLCV from storage (adj_close is renamed to close), adds returns = close.pct_change() per ticker, and calls execute(df) once on the full panel. Signals are computed on each stock&apos;s whole history, then kept only on days the stock was in the index. NaN rows (rolling warm-up) and infinite values (division by zero) are dropped.
                  </p>
                  <FormulaBlock>{`panel  = sort(ohlcv, by=[ticker, date])\nsignal = execute(panel)        # one call, all tickers\n\nkeep rows where ticker was an index\n  member on that date            # effective_from <= d < effective_to\n\ndrop NaN and +/-inf`}</FormulaBlock>
                </div>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>PortfolioConstructor - portfolio.py</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 10 }}>
                    On each trading day, z-scores the cross-section of signals, then normalises so gross exposure = 1.0. Positive z-scores give long positions; negative give short. If all signals are identical (zero cross-sectional variance), all weights are zeroed to prevent division-by-zero.
                  </p>
                  <FormulaBlock>{`For each date t:\n  z_i = (signal_i - mean_t) / std_t     # cross-sectional\n  w_i = z_i / Sum|z_i|               # gross exposure = 1\n\n  if std_t == 0:  w_i = 0  (all weights zero)\n\nR_{p,t} = Sum_i  w_{i,t} * r_{i,t+1}  # forward return`}</FormulaBlock>
                </div>
              </div>
            </div>
          )}

          {/* --- 5h PerturbedStorage --------------------------------- */}
          {activeSubsystem === "perturb" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>PerturbedStorage - the real stress mechanism</h3>
              <p className="al-body" style={{ marginBottom: 6 }}>
                The robustness grid does not modify formulas or weights. It wraps the DuckDB storage layer in a transparent proxy that intercepts read_ohlcv() calls and returns perturbed price data - so the backtest engine runs its normal code without knowing the data has been shocked.
              </p>
              <p className="al-body" style={{ marginBottom: 24, color: "#8a9085" }}>
                There are two perturbation functions. Gaussian noise jitters every price to test whether the signal depends on exact price levels. Missing-data drops remove runs of trading days to simulate exchange halts or failed data feeds.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>PROXY ARCHITECTURE</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20, marginBottom: 28, overflowX: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 600, marginBottom: 14 }}>
                  <Box label="Backtest engine" sub="calls read_ohlcv(tickers, t0, t1)" />
                  <Arr />
                  <Box label="PerturbedStorage" sub="intercepts the call" accent />
                  <Arr />
                  <Box label="DuckDBStorage" sub="reads real prices" />
                  <Arr label="apply perturb_func" />
                  <Box label="perturbed DataFrame" sub="returned to engine" accent />
                </div>
                <FormulaBlock>{`class PerturbedStorage(Storage):   # transparent proxy\n  def read_ohlcv(self, ...) -> MarketDataset:\n    dataset  = self.base_storage.read_ohlcv(...)  # real data\n    perturbed = self.perturb_func(dataset.data)   # apply shock\n    return MarketDataset(data=perturbed, ...)      # engine sees this`}</FormulaBlock>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>perturb_gaussian - Gaussian price noise</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 10 }}>
                    Multiplies every price column (open, high, low, close, adj_close) by a common per-row noise factor drawn from N(1, sigma^2). Using the same multiplier across OHLC preserves bar logic (high &gt;= low) - then a max/min clamp enforces this exactly. Volume gets its own independent draw.
                  </p>
                  <FormulaBlock>{`rng = np.random.default_rng(42 + iteration)\nnoise_i ~ N(0, noise_level^2)         # per row i\n\nprice_col_i  *= (1 + noise_i)        # same factor for OHLC\nhigh_i = max(open_i, close_i, high_i)  # re-clamp\nlow_i  = min(open_i, close_i, low_i)\n\nSigma levels in use: 0.5%  1%  2%`}</FormulaBlock>
                </div>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>perturb_missing_data - consecutive bar drops</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 10 }}>
                    For each ticker independently, drops drop_rate x N rows in chunks of chunk_size=5 consecutive days. Chunked dropping simulates real-world missing-data patterns (exchange halts, provider outages) rather than random scatter across isolated days.
                  </p>
                  <FormulaBlock>{`rng = np.random.default_rng(42 + iteration)\nfor each ticker group:\n  num_to_drop  = int(N * drop_rate)\n  num_chunks   = num_to_drop // chunk_size (=5)\n  for each chunk:\n    start = rng.integers(0, N - chunk_size)\n    drop indices [start, start + chunk_size)\n  top up with random single days if short\n\ndrop_rate levels: 5%  10%  20%`}</FormulaBlock>
                </div>
              </div>
            </div>
          )}

          {/* --- 5i LLM Verdict Engine ------------------------------- */}
          {activeSubsystem === "verdict" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>LLM Verdict Engine</h3>
              <p className="al-body" style={{ marginBottom: 6 }}>
                After every completed backtest, AlphaLab automatically generates a one-sentence human-readable verdict for each key metric - Sharpe ratio, Information Coefficient, Max Drawdown, and overall Robustness Score. These appear as annotations next to the numbers in the results UI.
              </p>
              <p className="al-body" style={{ marginBottom: 24, color: "#8a9085" }}>
                The verdict is generated by Gemini 1.5 Flash when GEMINI_API_KEY is set, or by GPT-4o-mini when only OPENAI_API_KEY is set, using a structured prompt with the exact metric values. If no key is set, or the call errors or exceeds 8 seconds, a deterministic rule-based verdict is used instead - so the backtest job never fails because of the LLM.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>VERDICT GENERATION FLOW</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20, marginBottom: 28, overflowX: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 680 }}>
                  <Box label="Backtest complete" sub="Sharpe, IC, MDD, robustness_score" />
                  <Arr />
                  <Box label="verdicts.py" sub="4 verdict functions" accent />
                  <Arr label="GEMINI_API_KEY?" />
                  <Box label="Gemini 1.5 Flash" sub="temp=0.1 * max_tokens=60 * timeout=8s" />
                  <Arr label="else OPENAI_API_KEY?" />
                  <Box label="GPT-4o-mini" sub="same prompt and limits" />
                  <Arr label="no key / error / timeout" />
                  <Box label="Rule-based string" sub="deterministic, always fires" accent />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  {
                    fn: "get_sharpe_verdict(sharpe, mean, std)",
                    rules: ["sharpe < 0.5  ->  \"Weak risk-adjusted returns\"", "sharpe >= 1.0  ->  \"Strong risk-adjusted returns\"", "else         ->  \"Moderate risk-adjusted returns\""],
                    prompt: "Analyze Sharpe={sharpe:.4f}, daily_mean={mean:.6f}, std={std:.6f}. One sentence, under 20 words, on risk-adjusted returns.",
                  },
                  {
                    fn: "get_ic_verdict(ic)",
                    rules: ["ic < 0     ->  \"Anti-predictive signal\"", "ic >= 0.05  ->  \"Strong predictive power\"", "else       ->  \"Weak predictive signal\""],
                    prompt: "Analyze IC={ic:.4f}. One sentence on alpha predictability, under 20 words.",
                  },
                  {
                    fn: "get_mdd_verdict(mdd, peak_date, trough_date)",
                    rules: ["mdd > 30%  ->  \"Severe drawdown risk\"", "else       ->  \"Controlled drawdown risk\""],
                    prompt: "Analyze MDD={mdd*100:.2f}%, peak={peak_date}, trough={trough_date}. One sentence on capital preservation.",
                  },
                  {
                    fn: "get_robustness_verdict(score, baseline_sharpe, stressed_avg, failure_reasons)",
                    rules: ["score < 0.80  ->  \"Flagged as overfit\"", "score >= 0.80  ->  \"Highly robust factor\""],
                    prompt: "Analyze robustness_score={score:.4f} (threshold 0.80). One sentence on overfit vs stable.",
                  },
                ].map(v => (
                  <div key={v.fn} style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                    <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#0f766e", marginBottom: 10, wordBreak: "break-all" }}>{v.fn}</div>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Rule-based fallback</div>
                    {v.rules.map(r => <div key={r} style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#5c6059", marginBottom: 2 }}>{r}</div>)}
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginTop: 10, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>LLM prompt shape</div>
                    <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#8a9085", lineHeight: 1.6 }}>{v.prompt}</div>
                  </div>
                ))}
              </div>

              <div style={{ border: "1px solid #ddddd9", borderLeft: "3px solid #0f766e", background: "rgba(15,118,110,0.03)", padding: "14px 20px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Output sanitisation</div>
                <p style={{ fontSize: "11px", color: "#5c6059", lineHeight: 1.65, margin: 0 }}>
                  The LLM response is passed through clean_verdict(): strip quote characters, take only the first sentence, hard-truncate to 120 characters. Temperature is 0.1 to minimise hallucination. The 8-second timeout is enforced via httpx.Client(timeout=8.0) - on timeout the exception is caught, the fallback fires, and the backtest job continues normally.
                </p>
              </div>
            </div>
          )}

          {/* --- 5j Data Ingestion Pipeline ------------------------- */}
          {activeSubsystem === "ingest" && (
            <div style={{ padding: 32 }}>
              <h3 className="al-title-md" style={{ marginBottom: 6 }}>Data Ingestion Pipeline</h3>
              <p className="al-body" style={{ marginBottom: 6 }}>
                Before any backtest can run, the system needs 2020–2025 price history for every stock that was in the NIFTY 50 during that window. The ingestion pipeline downloads it from Yahoo Finance, runs it through 4 validators, and writes the clean subset. It runs from python scripts/bootstrap.py, which render-start.sh calls on every server start.
              </p>
              <p className="al-body" style={{ marginBottom: 24, color: "#8a9085" }}>
                Bootstrap skips ingestion when DuckDB already has data; on the hosted free tier the disk is not persistent, so a fresh start re-downloads it. Tickers that fail validation are dropped before writing - a bad ticker cannot corrupt the stored dataset.
              </p>

              <div className="al-tag" style={{ marginBottom: 12 }}>INGESTION PIPELINE - 7 STAGES</div>
              <div style={{ border: "1px solid #ddddd9", background: "#fbfbfa", padding: 20, marginBottom: 28, overflowX: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 780 }}>
                  <Box label="NIFTY50Universe" sub="every member during the window" />
                  <Arr label="tickers list" />
                  <Box label="YahooProvider" sub="bulk download · drop pre-listing rows" accent />
                  <Arr label="raw_df" />
                  <Box label="DataTransformer" sub="standardise columns -> MarketDataset" />
                  <Arr label="dataset" />
                  <Box label="ValidatorSuite" sub="4 validators in sequence" accent />
                  <Arr label="filter errors" />
                  <Box label="DuckDB write" sub="ohlcv + universe tables" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>4 Validators (data/validation/)</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      ["SchemaValidator", "ERROR on null prices or volume, negative values, or dates in the future - the ticker is dropped."],
                      ["QualityValidator", "WARNING when a ticker has fewer bars than the best-covered ticker, or a single-day close move above 15%."],
                      ["CalendarValidator", "WARNING for rows on weekends and for missing Monday-Friday dates (it does not know NSE holidays, so holidays are flagged too)."],
                      ["CorporateActionsValidator", "WARNING when the close / adj_close ratio changes by more than 1% between days - a sign of a split or dividend adjustment."],
                    ].map(([name, desc]) => (
                      <div key={name}>
                        <div style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#1a1c18", marginBottom: 3 }}>{name}</div>
                        <div style={{ fontSize: "11px", color: "#8a9085", lineHeight: 1.55 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ border: "1px solid #ddddd9", background: "#fff", padding: 20 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#8a9085", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Validation output: errors vs warnings</div>
                  <p style={{ fontSize: "12px", color: "#5c6059", lineHeight: 1.7, marginBottom: 12 }}>
                    Validators emit errors or warnings. Only errors cause a ticker to be dropped entirely. Warnings are logged but the ticker survives. A ticker with a few missing days stays in the dataset; a ticker with wrong column types is excluded entirely.
                  </p>
                  <FormulaBlock>{`ValidationReport:\n  warnings: list[Issue]  # logged, ticker kept\n  errors:   list[Issue]  # ticker removed before write\n\nclean_df = raw_df[\n  ~raw_df["ticker"].isin(error_tickers)\n]\n\n# universe entries filtered to match clean tickers\n# -> DuckDB ohlcv <-> universe always consistent`}</FormulaBlock>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
