import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { LpSnapshot } from "../../types";
import { RANK_COLORS } from "../../constants";

interface Props {
  snapshots: LpSnapshot[];
  isLoading: boolean;
}

// Tier-Grenzen für Referenzlinien (absoluter LP-Wert)
const TIER_THRESHOLDS: { lp: number; label: string }[] = [
  { lp: 400, label: "Bronze" },
  { lp: 800, label: "Silver" },
  { lp: 1200, label: "Gold" },
  { lp: 1600, label: "Plat" },
  { lp: 2000, label: "Emerald" },
  { lp: 2400, label: "Diamond" },
  { lp: 2800, label: "Master" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

function rankLabel(absoluteLp: number): string {
  if (absoluteLp >= 2800) return "Master+";
  if (absoluteLp >= 2400) return "Diamond";
  if (absoluteLp >= 2000) return "Emerald";
  if (absoluteLp >= 1600) return "Platinum";
  if (absoluteLp >= 1200) return "Gold";
  if (absoluteLp >= 800) return "Silver";
  if (absoluteLp >= 400) return "Bronze";
  return "Iron";
}

interface TooltipPayload {
  payload: {
    absoluteLp: number;
    tier: string;
    division: string;
    lp: number;
    recordedAt: string;
  };
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayload[];
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-rank">
        {d.tier !== "MASTER" &&
        d.tier !== "GRANDMASTER" &&
        d.tier !== "CHALLENGER"
          ? `${d.tier} ${d.division} — ${d.lp} LP`
          : `${d.tier} — ${d.lp} LP`}
      </div>
      <div className="chart-tooltip-date">{formatDate(d.recordedAt)}</div>
    </div>
  );
};

const LpChart: React.FC<Props> = ({ snapshots, isLoading }) => {
  const latest = snapshots[snapshots.length - 1];
  const tierColor = latest
    ? (RANK_COLORS[latest.tier] ?? "var(--gold)")
    : "var(--gold)";

  return (
    <div className="lp-chart-card">
      <div className="lp-chart-header">
        <span className="lp-chart-title">LP Verlauf</span>
        {latest && (
          <span className="lp-chart-current" style={{ color: tierColor }}>
            {latest.tier !== "MASTER" &&
            latest.tier !== "GRANDMASTER" &&
            latest.tier !== "CHALLENGER"
              ? `${latest.tier} ${latest.division} ${latest.lp} LP`
              : `${latest.tier} ${latest.lp} LP`}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="lp-chart-empty">
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      ) : snapshots.length < 2 ? (
        <div className="lp-chart-empty">
          Noch zu wenig Daten für einen Verlauf
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart
            data={snapshots}
            margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(200,155,60,0.06)"
              vertical={false}
            />

            {/* Tier-Trennlinien */}
            {TIER_THRESHOLDS.map((t) => {
              const min = snapshots[0].absoluteLp;
              const max = snapshots[snapshots.length - 1].absoluteLp;
              if (t.lp < min - 200 || t.lp > max + 200) return null;
              return (
                <ReferenceLine
                  key={t.label}
                  y={t.lp}
                  stroke="rgba(200,155,60,0.2)"
                  strokeDasharray="4 4"
                  label={{
                    value: t.label,
                    position: "right",
                    fill: "rgba(200,155,60,0.45)",
                    fontSize: 9,
                  }}
                />
              );
            })}

            <XAxis
              dataKey="recordedAt"
              tickFormatter={formatDate}
              tick={{ fill: "var(--txt3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              dataKey="absoluteLp"
              tick={{ fill: "var(--txt3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => rankLabel(v)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="absoluteLp"
              stroke={tierColor}
              strokeWidth={2}
              dot={{ fill: tierColor, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: tierColor, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LpChart;
