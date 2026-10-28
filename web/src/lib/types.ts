// Response shapes of the AlphaLab API (see src/alphalab/api/routers/*.py)

export interface CurvePoint {
  date: string;
  cumulative_return: number;
}

/** One row of GET /factors/leaderboard, also built from GET /experiments on History */
export interface FactorSummary {
  id: string;
  name: string;
  formula: string;
  created_at: string;
  sharpe: number | null;
  ic: number | null;
  overall_score: number | null;
}

/** GET /factors/{id} */
export interface FactorDetail {
  id: string;
  name: string;
  formula: string;
  created_at: string;
  metrics: Record<string, number | null>;
  status: string;
  verdict_sharpe: string | null;
  verdict_ic: string | null;
  verdict_mdd: string | null;
  verdict_robustness: string | null;
  daily_mean: number | null;
  daily_std: number | null;
  mdd_peak_date: string | null;
  mdd_trough_date: string | null;
  dominant_failure: string | null;
  explanation: string | null;
  recommendations: string[];
}

/** GET /factors/{id}/backtest */
export interface BacktestPayload {
  equity_curve: CurvePoint[];
  /** Monthly mean IC; empty until the result is (re)computed by engine v2+ */
  ic_series: { month: string; ic: number }[];
}

export interface GridRow {
  perturbation: "noise" | "missing_data";
  level: number;
  sharpe: number;
  retention: number;
}

/** GET /factors/{id}/robustness */
export interface RobustnessPayload {
  overall_score: number | null;
  dominant_failure: string | null;
  explanation: string | null;
  recommendations: string[];
  grid: GridRow[];
  stressed_equity_curve: CurvePoint[] | null;
}

/** GET /experiments (current user's experiments) */
export interface ExperimentOut {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  factors: {
    id: string;
    name: string;
    formula: string;
    created_at: string;
    backtest_result: { sharpe: number | null; ic: number | null } | null;
    robustness_result: { overall_score: number | null } | null;
  }[];
}

/** FastAPI error body: a message, or a list of validation errors */
export interface ApiErrorBody {
  detail?: string | { loc?: (string | number)[]; msg: string }[];
}

/** State returned by the auth / lab server actions to useActionState */
export type ActionState = { error: string } | null | undefined;
