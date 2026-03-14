import React from "react";
import type { Match } from "../../types";
import { championSquareUrl } from "../../constants";

interface MatchRowProps {
  match: Match;
  style?: React.CSSProperties;
}

// ── Queue Labels ──────────────────────────────────────────────────────────────
const QUEUE_LABELS: Record<
  number,
  { label: string; short: string; ranked: boolean }
> = {
  // ── Ranked ─────────────────────────────────────────────────────────────────
  420: { label: "Ranked Solo/Duo", short: "Solo/Duo", ranked: true },
  440: { label: "Ranked Flex", short: "Flex", ranked: true },

  // ── Normal SR ──────────────────────────────────────────────────────────────
  400: { label: "Normal Draft", short: "Draft", ranked: false },
  430: { label: "Normal Blind", short: "Blind", ranked: false },
  480: { label: "Normal", short: "Normal", ranked: false },
  490: { label: "Quickplay", short: "Quick", ranked: false }, // bis Patch 25.07
  1900: { label: "Swiftplay", short: "Swiftplay", ranked: false }, // ab Patch 25.S1.1

  // ── ARAM ───────────────────────────────────────────────────────────────────
  450: { label: "ARAM", short: "ARAM", ranked: false },
  720: { label: "ARAM Clash", short: "ARAM Clash", ranked: false },

  // ── Clash ──────────────────────────────────────────────────────────────────
  700: { label: "Clash", short: "Clash", ranked: false },

  // ── Arena ──────────────────────────────────────────────────────────────────
  1700: { label: "Arena", short: "Arena", ranked: false },
  1701: { label: "Arena", short: "Arena", ranked: false },

  // ── Sonstige Modi ──────────────────────────────────────────────────────────
  900: { label: "ARURF", short: "URF", ranked: false },
  1010: { label: "Snow ARURF", short: "URF", ranked: false },
  1020: { label: "One for All", short: "OFA", ranked: false },
  1300: { label: "Nexus Blitz", short: "Blitz", ranked: false },
  1400: { label: "Ultimate Spellbook", short: "USB", ranked: false },
  2000: { label: "Brawl", short: "Brawl", ranked: false },

  // ── Co-op vs AI ────────────────────────────────────────────────────────────
  830: { label: "Co-op vs AI", short: "Bot", ranked: false },
  840: { label: "Co-op vs AI", short: "Bot", ranked: false },
  850: { label: "Co-op vs AI", short: "Bot", ranked: false },
};

function getQueue(queueId: number) {
  return (
    QUEUE_LABELS[queueId] ?? {
      label: `Mode ${queueId}`,
      short: "?",
      ranked: false,
    }
  );
}

// ── Position Labels ───────────────────────────────────────────────────────────
const POSITION_LABELS: Record<string, string> = {
  TOP: "Top",
  JUNGLE: "Jgl",
  MIDDLE: "Mid",
  BOTTOM: "Bot",
  UTILITY: "Sup",
};

// ── Formatierung ──────────────────────────────────────────────────────────────
function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor(diff / 60_000);

  if (days >= 14) return `vor ${Math.floor(days / 7)} Wochen`;
  if (days >= 7) return "vor einer Woche";
  if (days === 1) return "gestern";
  if (days > 1) return `vor ${days} Tagen`;
  if (hours === 1) return "vor einer Stunde";
  if (hours > 1) return `vor ${hours} Stunden`;
  if (mins === 1) return "vor einer Minute";
  if (mins > 1) return `vor ${mins} Minuten`;
  return "gerade eben";
}

function formatDamage(dmg: number): string {
  if (dmg >= 1000) return `${(dmg / 1000).toFixed(1)}k`;
  return String(dmg);
}

// ── Component ─────────────────────────────────────────────────────────────────
const MatchRow: React.FC<MatchRowProps> = ({ match, style }) => {
  const resultClass = match.remake ? "remake" : match.win ? "win" : "loss";
  const resultLabel = match.remake ? "REM" : match.win ? "WIN" : "LOSS";
  const queue = getQueue(match.queueId);

  const kdaColor =
    match.kda >= 5
      ? "var(--gold)"
      : match.kda >= 3
        ? "var(--grn)"
        : match.kda < 1
          ? "var(--red)"
          : "var(--txt2)";

  // LP — nur bei Ranked anzeigen
  const showLp = queue.ranked && !match.remake;
  const lpClass = !showLp
    ? "none"
    : match.lpChange == null
      ? "none"
      : match.lpChange > 0
        ? "pos"
        : match.lpChange < 0
          ? "neg"
          : "zero";

  const lpLabel = !showLp
    ? "—"
    : match.lpChange == null
      ? "—"
      : match.lpChange > 0
        ? `+${match.lpChange} LP`
        : `${match.lpChange} LP`;

  const posLabel = POSITION_LABELS[match.position];

  return (
    <div className={`match-row ${resultClass}`} style={style}>
      {/* ── Ergebnis + Dauer ── */}
      <div className="match-result">
        <span className={`match-result-label ${resultClass}`}>
          {resultLabel}
        </span>
        <span className="match-duration">
          {formatDuration(match.durationSeconds)}
        </span>
      </div>

      {/* ── Champion Icon + Position Badge ── */}
      <div className="match-champ-wrap">
        <img
          className="match-champ-img"
          src={championSquareUrl(match.champion)}
          alt={match.champion}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/Ryze.png`;
          }}
        />
        {posLabel && <span className="match-pos-badge">{posLabel}</span>}
      </div>

      {/* ── Champion + KDA ── */}
      <div className="match-kda-col">
        <div className="match-champion-name">{match.champion}</div>
        <div className="match-kda-nums">
          {match.kills} / <span>{match.deaths}</span> / {match.assists}
        </div>
        <div className="match-kda-ratio" style={{ color: kdaColor }}>
          {match.kda.toFixed(2)} KDA
        </div>
      </div>

      {/* ── Stats (CS · DMG · Vision) ── */}
      <div className="match-stats-mini">
        <div className="match-mini-stat">
          <span className="match-mini-lbl">CS</span>
          <span className="match-mini-val">{match.csTotal}</span>
          <span className="match-mini-sub">
            {match.csPerMinute.toFixed(1)}/min
          </span>
        </div>
        <div className="match-mini-stat">
          <span className="match-mini-lbl">DMG</span>
          <span className="match-mini-val">
            {formatDamage(match.damageDealt)}
          </span>
        </div>
        <div className="match-mini-stat">
          <span className="match-mini-lbl">Vision</span>
          <span className="match-mini-val">{match.visionScore}</span>
        </div>
      </div>

      {/* ── Queue + Zeit ── */}
      <div className="match-queue-col">
        <span
          className={`match-queue-badge ${queue.ranked ? "ranked" : "normal"}`}
        >
          {queue.short}
        </span>
        <span className="match-time-ago">{formatTimeAgo(match.playedAt)}</span>
      </div>

      {/* ── LP Delta ── */}
      <div className="match-lp-badge">
        <div className={`lp-delta ${lpClass}`}>{lpLabel}</div>
        {showLp && match.lpBefore != null && match.lpAfter != null && (
          <div className="lp-values">
            {match.lpBefore} → {match.lpAfter}
          </div>
        )}
        {(!showLp || match.lpChange == null) && (
          <div className="lp-values" style={{ opacity: 0.35 }}>
            —
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchRow;
