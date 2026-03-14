import React, { useState, useEffect } from "react";
import type { Account } from "../../types";
import { useMatches } from "../../hooks/useMatches";
import { profileIconUrl, FALLBACK_ICON } from "../../constants";
import LpChart from "./LpChart";
import MatchStatsPanel from "./MatchStatsPanel";
import { useDailyRecap } from "../../hooks/useDailyRecap";
import { useLpHistory } from "../../hooks/useLpHistory";
import MatchRow from "./MatchRow";
import DailyRecapCard from "./DailyRecapCard";
import { useMatchStats } from "../../hooks/useMatchStats";

interface Props {
  accounts: Account[];
  showToast: (msg: string) => void;
}

const MatchesPage: React.FC<Props> = ({ accounts, showToast }) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    accounts[0]?.id ?? null,
  );

  // Wenn accounts sich ändern und kein Account ausgewählt ist
  useEffect(() => {
    if (!selectedId && accounts.length > 0) {
      setSelectedId(accounts[0].id);
    }
  }, [accounts, selectedId]);

  const {
    matches,
    isLoading: matchesLoading,
    isSyncing,
    load,
    sync,
  } = useMatches();
  const { recap, isLoading: recapLoading } = useDailyRecap(selectedId);
  const { stats, isLoading: statsLoading } = useMatchStats(selectedId);
  const { snapshots, isLoading: lpLoading } = useLpHistory(selectedId);

  // Matches laden wenn Account wechselt
  useEffect(() => {
    if (selectedId) load(selectedId, 30);
  }, [selectedId, load]);

  const handleSync = async () => {
    if (!selectedId) return;
    try {
      const result = await sync(selectedId);
      showToast(
        result.newMatches > 0
          ? `✦ ${result.newMatches} neue Matches gespeichert`
          : "Bereits aktuell",
      );
    } catch {
      showToast("Sync fehlgeschlagen");
    }
  };

  if (accounts.length === 0) {
    return (
      <>
        <PageHeader />
        <div className="match-empty">
          <div className="match-empty-ico">◈</div>
          <div className="match-empty-txt">Noch keine Accounts</div>
          <div className="match-empty-sub">Füge zuerst einen Account hinzu</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />

      {/* Account Auswahl */}
      <div className="account-selector">
        {accounts.map((acc) => (
          <button
            key={acc.id}
            className={`acct-chip ${acc.id === selectedId ? "active" : ""}`}
            onClick={() => setSelectedId(acc.id)}
          >
            <img
              className="acct-chip-img"
              src={profileIconUrl(acc.profileIconId)}
              alt={acc.summonerName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_ICON;
              }}
            />
            <span>{acc.summonerName}</span>
            {acc.rank && (
              <span className="acct-chip-rank">{acc.rank.fullRank}</span>
            )}
          </button>
        ))}
      </div>

      {/* LP Chart (über dem Layout) */}
      {selectedId && <LpChart snapshots={snapshots} isLoading={lpLoading} />}

      {/* Hauptlayout: Match-Liste + Seitenleiste */}
      <div className="match-page-layout" style={{ marginTop: 20 }}>
        {/* Linke Spalte: Match-Liste */}
        <div className="match-main-col">
          <div className="match-hd-controls">
            <div className="match-hd-left">
              <span
                style={{ fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}
              >
                Letzte Matches
              </span>
              {matches.length > 0 && (
                <span className="match-count-badge">{matches.length}</span>
              )}
            </div>
            <button
              className="sync-btn"
              onClick={handleSync}
              disabled={isSyncing || !selectedId}
            >
              <span className={isSyncing ? "sync-spinning" : ""}>↻</span>
              {isSyncing ? "Sync…" : "Sync"}
            </button>
          </div>

          {matchesLoading ? (
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
              <div className="match-empty-sub">
                Klicke Sync um Matches zu laden
              </div>
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

        {/* Rechte Spalte: Recap + Stats */}
        <div className="match-side-col">
          {recap && <DailyRecapCard recap={recap} isLoading={recapLoading} />}
          <MatchStatsPanel stats={stats} isLoading={statsLoading} />
        </div>
      </div>
    </>
  );
};

const PageHeader: React.FC = () => (
  <div className="page-hd">
    <div className="page-title">
      <div className="title-line" />
      Match Tracking
    </div>
    <div className="page-sub">LP-Verlauf, Statistiken und Daily Recap</div>
  </div>
);

export default MatchesPage;
