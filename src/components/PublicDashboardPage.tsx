import React, { useState, useEffect } from "react";
import {
  usePublicDashboard,
  usePublicAccountData,
} from "../hooks/usePublicDashboard";
import { profileIconUrl, FALLBACK_ICON, RANK_COLORS } from "../constants";
import LpChart from "./matches/LpChart";
import MatchRow from "./matches/MatchRow";
import DailyRecapCard from "./matches/DailyRecapCard";
import MatchStatsPanel from "./matches/MatchStatsPanel";

const PublicDashboardPage: React.FC = () => {
  const { accounts, isLoading: accountsLoading, error } = usePublicDashboard();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && accounts.length > 0) {
      setSelectedId(accounts[0].id);
    }
  }, [accounts, selectedId]);

  const { matches, recap, stats, snapshots, isLoading } =
    usePublicAccountData(selectedId);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (accountsLoading) {
    return (
      <div className="public-dash-loading">
        <div className="dots">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>
    );
  }

  if (error || accounts.length === 0) {
    return (
      <div className="public-dash-empty">
        <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 12 }}>◈</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--txt2)" }}>
          Kein Dashboard verfügbar
        </div>
      </div>
    );
  }

  const selected = accounts.find((a) => a.id === selectedId);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="public-dash">
      {/* Header */}
      <div className="public-dash-header">
        <div className="public-dash-logo">
          <span className="logo-hex" style={{ cursor: "default" }}>
            ⚜
          </span>
          <div>
            <div className="logo-text">VAULT</div>
            <div className="logo-sub">Public Dashboard</div>
          </div>
        </div>
      </div>

      <div className="public-dash-body">
        {/* Account-Auswahl als Cards */}
        <div className="public-acct-row">
          {accounts.map((acc) => {
            const tier = acc.rank?.tier ?? "UNRANKED";
            const color = RANK_COLORS[tier];
            return (
              <button
                key={acc.id}
                className={`public-acct-card ${acc.id === selectedId ? "active" : ""}`}
                onClick={() => setSelectedId(acc.id)}
                style={
                  acc.id === selectedId
                    ? { borderColor: color, background: `${color}12` }
                    : {}
                }
              >
                <img
                  className="public-acct-icon"
                  src={profileIconUrl(acc.profileIconId)}
                  alt={acc.summonerName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_ICON;
                  }}
                />
                <div className="public-acct-info">
                  <div className="public-acct-name">
                    {acc.summonerName}
                    <span>#{acc.tagLine}</span>
                  </div>
                  <div className="public-acct-rank" style={{ color }}>
                    {acc.rank?.fullRank ?? "Unranked"}
                  </div>
                  <div className="public-acct-region">{acc.region}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {selected && (
          <>
            {/* LP Chart */}
            <div style={{ marginBottom: 20 }}>
              <LpChart snapshots={snapshots} isLoading={isLoading} />
            </div>

            {/* Match-Liste + Seitenleiste */}
            <div className="match-page-layout">
              <div className="match-main-col">
                <div className="match-hd-controls">
                  <div className="match-hd-left">
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--txt2)",
                        fontWeight: 600,
                      }}
                    >
                      Letzte Matches
                    </span>
                    {matches.length > 0 && (
                      <span className="match-count-badge">
                        {matches.length}
                      </span>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <div className="match-empty">
                    <div className="dots">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="match-empty">
                    <div className="match-empty-ico">◉</div>
                    <div className="match-empty-txt">Noch keine Matches</div>
                  </div>
                ) : (
                  <div className="match-list">
                    {matches.map((m, i) => (
                      <MatchRow
                        key={m.id}
                        match={m}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="match-side-col">
                {recap && (
                  <DailyRecapCard recap={recap} isLoading={isLoading} />
                )}
                <MatchStatsPanel stats={stats} isLoading={isLoading} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicDashboardPage;
