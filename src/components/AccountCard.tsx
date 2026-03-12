import React, { useState } from "react";
import type { Account, Skin } from "../types";
import {
  RANK_COLORS,
  RANK_ICONS,
  FALLBACK_ICON,
  profileIconUrl,
} from "../constants";

interface AccountCardProps {
  account: Account;
  skins: Skin[];
  refreshing: boolean;
  onRefresh: () => void;
  onDelete: () => void;
  onAddSkin: () => void;
  onRemoveSkin: (skinId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account: acc,
  skins,
  refreshing,
  onRefresh,
  onDelete,
  onAddSkin,
  onRemoveSkin,
}) => {
  const [lightboxSkin, setLightboxSkin] = useState<Skin | null>(null);

  const accountSkins = acc.skinIds
    .map((id) => skins.find((s) => s.id === id))
    .filter((s): s is Skin => s !== undefined);

  const rank = acc.rank;
  const tier = rank?.tier ?? "UNRANKED";
  const rankColor = RANK_COLORS[tier];
  const lp = rank?.leaguePoints ?? 0;
  const wins = rank?.wins ?? 0;
  const losses = rank?.losses ?? 0;
  const winrate = rank?.winrate ?? 0;
  const fullRank = rank?.fullRank ?? "Unranked";

  const winrateColor =
    winrate >= 55 ? "var(--grn)" : winrate < 50 ? "var(--red)" : "var(--txt)";
  const iconUrl = profileIconUrl(acc.profileIconId);

  return (
    <>
      {lightboxSkin && (
        <div className="skin-lb" onClick={() => setLightboxSkin(null)}>
          <img
            className="skin-lb-img"
            src={lightboxSkin.splashUrl}
            alt={lightboxSkin.skinName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_ICON;
            }}
          />
          <div className="skin-lb-info">
            <div className="skin-lb-champ">{lightboxSkin.championName}</div>
            <div className="skin-lb-name">{lightboxSkin.skinName}</div>
          </div>
        </div>
      )}

      <div className="acct-card">
        <div
          className="card-glow"
          style={{
            background: `linear-gradient(90deg,${rankColor}30,transparent)`,
          }}
        />

        {/* ── Info panel (30%) ── */}
        <div className="card-info-panel">
          {/* Identity */}
          <div className="ci-identity">
            <div className="icon-wrap">
              <img
                className="acct-icon"
                src={iconUrl}
                alt={acc.summonerName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_ICON;
                }}
              />
              <div className="lvl-badge">{acc.summonerLevel}</div>
            </div>
            <div className="acct-info">
              <div className="acct-name">
                {acc.summonerName}
                <span>#{acc.tagLine}</span>
              </div>
              <div className="pills">
                <span className="pill p-region">{acc.region}</span>
              </div>
            </div>
          </div>

          {/* Rank + LP */}
          <div className="ci-rank">
            <div className="rank-emb" style={{ color: rankColor }}>
              {RANK_ICONS[tier]}
            </div>
            <div className="ci-rank-text">
              <div className="rank-nm" style={{ color: rankColor }}>
                {fullRank}
              </div>
              <div className="rank-lp">{lp} LP</div>
            </div>
          </div>
          <div className="ci-lp-bar">
            <div
              className="lp-fill"
              style={{ width: `${Math.min(lp, 100)}%`, background: rankColor }}
            />
          </div>

          {/* Stats */}
          <div className="ci-stats">
            <div className="cstat">
              <div className="cstat-v" style={{ color: "var(--grn)" }}>
                {wins}
              </div>
              <div className="cstat-l">Wins</div>
            </div>
            <div className="cstat">
              <div className="cstat-v" style={{ color: "var(--red)" }}>
                {losses}
              </div>
              <div className="cstat-l">Losses</div>
            </div>
            <div className="cstat">
              <div className="cstat-v" style={{ color: winrateColor }}>
                {winrate}%
              </div>
              <div className="cstat-l">WR</div>
            </div>
          </div>

          {/* Footer */}
          <div className="ci-foot">
            <div className="card-time">
              {acc.rankLastUpdated
                ? `Akt.: ${new Date(acc.rankLastUpdated).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}`
                : "Noch nicht aktualisiert"}
            </div>
            <div className="card-btns">
              <button
                className="ico-btn"
                onClick={onRefresh}
                title="Rank aktualisieren"
                disabled={refreshing}
              >
                ↻
              </button>
              <button
                className="ico-btn del"
                onClick={onDelete}
                title="Löschen"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* ── Skins panel (70%) ── */}
        <div className="card-skins-panel">
          <div className="skins-hd">
            <div className="skins-lbl">
              Skins{" "}
              <span className="skin-count-badge">{accountSkins.length}</span>
            </div>
          </div>
          <div className="skins-row">
            {accountSkins.map((skin) => (
              <div
                key={skin.id}
                className="skin-tile"
                title={`${skin.championName} · ${skin.skinName}`}
                onClick={() => setLightboxSkin(skin)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onRemoveSkin(skin.id);
                }}
              >
                <img src={skin.splashUrl} alt={skin.skinName} />
                <div className="skin-tile-ov" />
                <div className="skin-tile-txt">
                  <span className="stc">{skin.championName}</span>
                  <span className="stn">{skin.skinName}</span>
                </div>
              </div>
            ))}
            <button
              className="skin-add"
              onClick={onAddSkin}
              title="Skin hinzufügen"
            >
              +
            </button>
          </div>

          {refreshing && (
            <div className="refreshing-indicator">
              <div className="dots">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
              <span className="refreshing-text">API wird abgerufen…</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(AccountCard);
