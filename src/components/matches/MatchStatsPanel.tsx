import React from "react";
import type { MatchStats } from "../../types";

interface Props {
  stats: MatchStats | null;
  isLoading: boolean;
}

const MatchStatsPanel: React.FC<Props> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="match-stats-card">
        <div className="match-stats-card-header">Gesamt-Statistiken</div>
        <div style={{ padding: "28px", textAlign: "center" }}>
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalGames === 0) {
    return (
      <div className="match-stats-card">
        <div className="match-stats-card-header">Gesamt-Statistiken</div>
        <div
          style={{
            padding: "20px",
            color: "var(--txt3)",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Noch keine Matches gespeichert
        </div>
      </div>
    );
  }

  const wrColor =
    stats.winrate >= 55
      ? "var(--grn)"
      : stats.winrate < 50
        ? "var(--red)"
        : "var(--txt)";

  const kdaColor =
    stats.avgKda >= 4
      ? "var(--gold)"
      : stats.avgKda >= 2.5
        ? "var(--grn)"
        : stats.avgKda < 1.5
          ? "var(--red)"
          : "var(--txt)";

  return (
    <div className="match-stats-card">
      <div className="match-stats-card-header">Gesamt-Statistiken</div>

      {/* 2x2 Grid */}
      <div className="match-stats-grid2">
        <div className="ms-cell">
          <div className="ms-val">{stats.totalGames}</div>
          <div className="ms-lbl">Spiele</div>
        </div>
        <div className="ms-cell">
          <div className="ms-val" style={{ color: wrColor }}>
            {stats.winrate}%
          </div>
          <div className="ms-lbl">Winrate</div>
        </div>
        <div className="ms-cell">
          <div className="ms-val" style={{ color: kdaColor }}>
            {stats.avgKda.toFixed(2)}
          </div>
          <div className="ms-lbl">Ø KDA</div>
        </div>
        <div className="ms-cell">
          <div className="ms-val">{stats.avgCsPerMin.toFixed(1)}</div>
          <div className="ms-lbl">Ø CS/min</div>
        </div>
        <div className="ms-cell">
          <div className="ms-val">{(stats.avgDamage / 1000).toFixed(1)}k</div>
          <div className="ms-lbl">Ø Damage</div>
        </div>
        <div className="ms-cell">
          <div className="ms-val">{stats.avgVisionScore}</div>
          <div className="ms-lbl">Ø Vision</div>
        </div>
      </div>

      {/* Most played champion */}
      {stats.mostPlayedChampion && stats.mostPlayedChampion !== "-" && (
        <div className="ms-champ-row">
          <span className="ms-champ-label">Meist gespielt</span>
          <div>
            <div className="ms-champ-name">{stats.mostPlayedChampion}</div>
            <div className="ms-champ-sub">
              {stats.mostPlayedGames} Spiele · {stats.mostPlayedWinrate}% WR
            </div>
          </div>
        </div>
      )}

      {/* Streaks */}
      <div className="ms-champ-row">
        <span className="ms-champ-label">Längste Streaks</span>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="streak-pill win">🔥 {stats.longestWinStreak}W</span>
          <span className="streak-pill loss">
            💀 {stats.longestLossStreak}L
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchStatsPanel;
