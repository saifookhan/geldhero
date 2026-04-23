"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Users,
  Award,
  Activity,
} from "lucide-react";

interface ScoreBreakdown {
  factor: string;
  factor_slug: string;
  userValue: string | number;
  matchedCondition: string;
  score: number;
  maxPoints: number;
}

interface RiskScore {
  id: number;
  user_email: string;
  calculator_response_id: number;
  total_score: number;
  max_possible_score: number;
  score_breakdown: ScoreBreakdown[];
  derived_metrics?: {
    monthly_surplus?: number | null;
    expense_ratio?: number | null;
    net_additional_cash_flow?: number | null;
    savings_coverage?: number | null;
    liabilities_annual_income_ratio?: number | null;
  } | null;
  calculated_at: string;
  created_at: string;
}

const formatMetricValue = (
  value: number | null | undefined,
  options?: { percent?: boolean; currency?: boolean },
) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  if (options?.percent) {
    return `${(value * 100).toFixed(2)}%`;
  }
  if (options?.currency) {
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return Number(value).toFixed(2);
};

const getRiskBand = (score: number, max: number) => {
  const pct = (score / max) * 100;
  if (pct <= 35)
    return {
      label: "Low",
      pct,
      bg: "bg-rose-500",
      soft: "bg-rose-50 text-rose-600 border-rose-200",
      bar: "bg-rose-400",
    };
  if (pct <= 65)
    return {
      label: "Medium",
      pct,
      bg: "bg-amber-400",
      soft: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-400",
    };
  return {
    label: "High",
    pct,
    bg: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-400",
  };
};

const ScoreMeter = ({ score, max }: { score: number; max: number }) => {
  const band = getRiskBand(score, max);
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${band.bar}`}
          style={{ width: `${Math.min(band.pct, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 tabular-nums w-8 text-right">
        {score}
      </span>
    </div>
  );
};

export default function Page() {
  const [scores, setScores] = useState<RiskScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<RiskScore>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [recalcRow, setRecalcRow] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("risk_capacity_scores")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setScores(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("risk_capacity_scores")
      .delete()
      .eq("id", id);
    if (!error) {
      setScores((p) => p.filter((s) => s.id !== id));
      setDeleteConfirm(null);
    }
  };

  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from("risk_capacity_scores")
      .update(editValues)
      .eq("id", id);
    if (!error) {
      setScores((p) =>
        p.map((s) => (s.id === id ? { ...s, ...editValues } : s)),
      );
      setEditingRow(null);
    }
  };

  const handleRecalculate = async (row: RiskScore) => {
    setErrorMsg(null);
    setRecalcRow(row.id);
    try {
      const res = await fetch("/api/scoring/user_response_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: row.user_email, scoreId: row.id }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed");
      setScores((p) =>
        p.map((s) =>
          s.id === row.id
            ? {
                ...s,
                total_score: data.totalScore,
                max_possible_score: data.maxPossibleScore,
                score_breakdown: data.scoreBreakdown,
                derived_metrics: data.derivedMetrics ?? s.derived_metrics,
                calculated_at: new Date().toISOString(),
              }
            : s,
        ),
      );
      // Ensure UI and DB are in sync after recalculation.
      await fetchData();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Recalculation failed");
    } finally {
      setRecalcRow(null);
    }
  };

  const filtered = scores.filter((s) =>
    s.user_email.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Stats ──────────────────────────────────────────────
  const avg = scores.length
    ? Math.round(scores.reduce((a, s) => a + s.total_score, 0) / scores.length)
    : 0;
  const high = scores.filter(
    (s) => getRiskBand(s.total_score, s.max_possible_score).label === "High",
  ).length;
  const medium = scores.filter(
    (s) => getRiskBand(s.total_score, s.max_possible_score).label === "Medium",
  ).length;
  const low = scores.filter(
    (s) => getRiskBand(s.total_score, s.max_possible_score).label === "Low",
  ).length;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          <span className="text-sm">Loading scores…</span>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Risk Capacity Scores
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {scores.length} total submissions
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Submissions",
            value: scores.length,
            icon: Users,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Average Score",
            value: avg,
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "High Risk",
            value: high,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Low Risk",
            value: low,
            icon: Award,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}
              >
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Error ── */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {errorMsg}
          <button onClick={() => setErrorMsg(null)} className="ml-auto">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Score
              </th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                Progress
              </th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Band
              </th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Factors
              </th>
              <th className="px-5 py-3.5 text-left   text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Date
              </th>
              <th className="px-5 py-3.5 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((row) => {
              const band = getRiskBand(row.total_score, row.max_possible_score);
              const isExpanded = expandedRow === row.id;
              const isEditing = editingRow === row.id;
              const breakdown = Array.isArray(row.score_breakdown)
                ? row.score_breakdown
                : [];
              const derivedMetrics = row.derived_metrics;

              return (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50/60 transition-colors group">
                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-800">
                        {row.user_email}
                      </span>
                    </td>

                    {/* Score — editable */}
                    <td className="px-5 py-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                            value={editValues.total_score}
                            onChange={(e) =>
                              setEditValues((p) => ({
                                ...p,
                                total_score: +e.target.value,
                              }))
                            }
                          />
                          <span className="text-gray-300">/</span>
                          <input
                            type="number"
                            className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                            value={editValues.max_possible_score}
                            onChange={(e) =>
                              setEditValues((p) => ({
                                ...p,
                                max_possible_score: +e.target.value,
                              }))
                            }
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">
                          {row.total_score}
                          <span className="font-normal text-gray-400 text-xs">
                            /{row.max_possible_score}
                          </span>
                        </span>
                      )}
                    </td>

                    {/* Progress bar */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <ScoreMeter
                        score={row.total_score}
                        max={row.max_possible_score}
                      />
                    </td>

                    {/* Band badge */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${band.soft}`}
                      >
                        {band.label}
                      </span>
                    </td>

                    {/* Factor count */}
                    <td className="px-5 py-4 text-center text-gray-400 text-xs hidden lg:table-cell">
                      {breakdown.length} factors
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(row.calculated_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Expand */}
                        <button
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : row.id)
                          }
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Details"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {/* Edit / Save / Cancel */}
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(row.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingRow(null)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingRow(row.id);
                              setEditValues({
                                total_score: row.total_score,
                                max_possible_score: row.max_possible_score,
                              });
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}

                        {/* Recalculate */}
                        <button
                          onClick={() => handleRecalculate(row)}
                          disabled={recalcRow === row.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors disabled:opacity-40"
                          title="Recalculate"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${recalcRow === row.id ? "animate-spin" : ""}`}
                          />
                        </button>

                        {/* Delete */}
                        {deleteConfirm === row.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                            <span className="text-xs text-red-600 font-medium">
                              Sure?
                            </span>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="text-xs text-red-600 font-semibold hover:text-red-800"
                            >
                              Yes
                            </button>
                            <span className="text-red-200">·</span>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(row.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* ── Expanded breakdown ── */}
                  {isExpanded && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-5 bg-gray-50/80 border-b border-gray-100"
                      >
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                          Score Breakdown
                        </p>
                        <div className="grid gap-2">
                          {breakdown.map((b, i) => {
                            const pct =
                              b.maxPoints > 0 ? b.score / b.maxPoints : 0;
                            const col =
                              pct >= 0.75
                                ? "bg-emerald-400"
                                : pct >= 0.4
                                  ? "bg-amber-400"
                                  : "bg-rose-400";
                            const soft =
                              pct >= 0.75
                                ? "text-emerald-700 bg-emerald-50"
                                : pct >= 0.4
                                  ? "text-amber-700 bg-amber-50"
                                  : "text-rose-700 bg-rose-50";
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 border border-gray-100"
                              >
                                <div className="w-32 shrink-0">
                                  <p className="text-xs font-semibold text-gray-700 truncate">
                                    {b.factor}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {b.matchedCondition ?? "—"}
                                  </p>
                                </div>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${col} transition-all duration-500`}
                                    style={{
                                      width: `${Math.min(pct * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs text-gray-400 hidden sm:block">
                                    Answer:{" "}
                                    <span className="text-gray-600 font-medium">
                                      {String(b.userValue ?? "—")}
                                    </span>
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${soft}`}
                                  >
                                    {b.score}/{b.maxPoints}
                                  </span>
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${soft}`}
                                  >
                                    {Math.round(pct * 100)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3">
                          Derived Metrics
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {[
                            {
                              label: "Monthly Surplus",
                              unit: "EUR / month",
                              value: formatMetricValue(
                                derivedMetrics?.monthly_surplus,
                                { currency: true },
                              ),
                            },
                            {
                              label: "Expense Ratio",
                              unit: "%",
                              value: formatMetricValue(
                                derivedMetrics?.expense_ratio,
                                { percent: true },
                              ),
                            },
                            {
                              label: "Net Additional Cash Flow",
                              unit: "EUR / year",
                              value: formatMetricValue(
                                derivedMetrics?.net_additional_cash_flow,
                                { currency: true },
                              ),
                            },
                            {
                              label: "Savings Coverage",
                              unit: "months",
                              value: formatMetricValue(
                                derivedMetrics?.savings_coverage,
                              ),
                            },
                            {
                              label: "Liabilities / Annual Income",
                              unit: "ratio",
                              value: formatMetricValue(
                                derivedMetrics?.liabilities_annual_income_ratio,
                              ),
                            },
                          ].map((metric) => (
                            <div
                              key={metric.label}
                              className="bg-white rounded-xl px-4 py-3 border border-gray-100"
                            >
                              <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                                {metric.label}
                              </p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {metric.value}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {metric.unit}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {search ? "No results match your search." : "No submissions yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
