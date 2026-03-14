import React from "react";
import type { Account, FlatSkin, Skin } from "../types";
import {
  RANK_COLORS,
  RANK_ICONS,
  FALLBACK_ICON,
  profileIconUrl,
} from "../constants";
import AccountCard from "./AccountCard";

// ─── Shared ───────────────────────────────────────────────────────────────────

const PageHeader: React.FC<{ title: string; sub: string }> = ({
  title,
  sub,
}) => (
  <div className="page-hd">
    <div className="page-title">
      <div className="title-line" />
      {title}
    </div>
    <div className="page-sub">{sub}</div>
  </div>
);

// ─── AccountsPage ─────────────────────────────────────────────────────────────

interface AccountsPageProps {
  accounts: Account[];
  skinMap: Map<string, Skin>;
  totalSkins: number;
  refreshingId: string | null;
  onRefresh: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSkin: (id: string) => void;
  onRemoveSkin: (
    accountId: string,
    skinId: string,
    skipConfirm?: boolean,
  ) => void;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({
  accounts,
  skinMap,
  totalSkins,
  refreshingId,
  onRefresh,
  onDelete,
  onAddSkin,
  onRemoveSkin,
}) => (
  <>
    <PageHeader
      title="Deine Accounts"
      sub={`${accounts.length} Accounts · ${totalSkins} Skins gesamt`}
    />
    <div className="accts-grid">
      {accounts.map((acc) => (
        <AccountCard
          key={acc.id}
          account={acc}
          skinMap={skinMap}
          refreshing={refreshingId === acc.id}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onAddSkin={onAddSkin}
          onRemoveSkin={onRemoveSkin}
        />
      ))}
    </div>
  </>
);

// ─── SkinsPage ────────────────────────────────────────────────────────────────

interface SkinsPageProps {
  accounts: Account[];
  skinMap: Map<string, Skin>;
  totalSkins: number;
  query: string;
  onQueryChange: (q: string) => void;
  searchResults: FlatSkin[] | null;
  onAddSkin: (accountId: string) => void;
  onRemoveSkin: (
    accountId: string,
    skinId: string,
    skipConfirm?: boolean,
  ) => void;
}

export const SkinsPage: React.FC<SkinsPageProps> = ({
  accounts,
  skinMap,
  totalSkins,
  query,
  onQueryChange,
  searchResults,
  onAddSkin,
  onRemoveSkin,
}) => (
  <>
    <PageHeader
      title="Skin-Kollektion"
      sub={`${totalSkins} Skins auf ${accounts.length} Accounts`}
    />
    <div className="search-wrap">
      <span className="search-ico">⌕</span>
      <input
        className="search-inp"
        placeholder="Champion, Skin oder Account durchsuchen…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {query && (
        <span className="search-hits">
          {searchResults?.length ?? 0} TREFFER
        </span>
      )}
    </div>

    {searchResults !== null ? (
      <SearchResultsGrid results={searchResults} />
    ) : (
      <GroupedSkinView
        accounts={accounts}
        skinMap={skinMap}
        onAddSkin={onAddSkin}
        onRemoveSkin={onRemoveSkin}
      />
    )}
  </>
);

const SearchResultsGrid: React.FC<{ results: FlatSkin[] }> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="no-res">
        <div className="no-res-ico">✦</div>
        <div className="no-res-txt">Keine Skins gefunden</div>
        <div className="no-res-sub">Versuche einen anderen Suchbegriff</div>
      </div>
    );
  }
  return (
    <div className="results-grid">
      {results.map((s, i) => (
        <div key={`${s.id}-${i}`} className="res-card">
          <img src={s.splashUrl} alt={s.skinName} />
          <div className="res-ov" />
          <div className="res-info">
            <div className="res-champ">{s.championName}</div>
            <div className="res-skin">{s.skinName}</div>
            <div className="res-acct">◈ {s.accountName}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface GroupedSkinViewProps {
  accounts: Account[];
  skinMap: Map<string, Skin>;
  onAddSkin: (accountId: string) => void;
  onRemoveSkin: (
    accountId: string,
    skinId: string,
    skipConfirm?: boolean,
  ) => void;
}

const GroupedSkinView: React.FC<GroupedSkinViewProps> = ({
  accounts,
  skinMap,
  onAddSkin,
  onRemoveSkin,
}) => (
  <>
    {accounts.map((acc) => {
      const accountSkins = acc.skinIds
        .map((id) => skinMap.get(id))
        .filter((s): s is Skin => s !== undefined);

      return (
        <div key={acc.id} className="group-section">
          <div className="group-hd">
            <img
              className="grp-icon"
              src={profileIconUrl(acc.profileIconId)}
              alt={acc.summonerName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_ICON;
              }}
            />
            <div>
              <div className="grp-name">
                {acc.summonerName}
                <span>#{acc.tagLine}</span>
              </div>
              <div className="grp-sub">
                {acc.rank?.fullRank ?? "Unranked"} · {acc.region}
              </div>
            </div>
            <div className="grp-actions">
              <span className="grp-cnt">{accountSkins.length}</span>
              <button className="grp-add-btn" onClick={() => onAddSkin(acc.id)}>
                + Skin
              </button>
            </div>
          </div>

          {accountSkins.length === 0 ? (
            <div className="empty-grp">
              Noch keine Skins — füge welche hinzu
            </div>
          ) : (
            <div className="grp-grid">
              {accountSkins.map((skin) => (
                <div
                  key={skin.id}
                  className="grp-skin"
                  title={`${skin.championName} · ${skin.skinName}`}
                >
                  <img src={skin.splashUrl} alt={skin.skinName} />
                  <div className="gs-ov" />
                  <div className="gs-info">
                    <div className="gs-champ">{skin.championName}</div>
                    <div className="gs-skin">{skin.skinName}</div>
                  </div>
                  <button
                    className="gs-rmv"
                    onClick={(e) => onRemoveSkin(acc.id, skin.id, e.shiftKey)}
                    title="Entfernen (Shift+Klick zum direkten Löschen)"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </>
);

// ─── StatsPage ────────────────────────────────────────────────────────────────

export const StatsPage: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const totalWins = accounts.reduce((s, a) => s + (a.rank?.wins ?? 0), 0);
  const totalLosses = accounts.reduce((s, a) => s + (a.rank?.losses ?? 0), 0);
  const totalGames = totalWins + totalLosses;
  const totalSkins = accounts.reduce((s, a) => s + a.skinIds.length, 0);
  const overallWr =
    totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Statistiken"
        sub={`${accounts.length} Accounts · ${totalGames} Spiele gesamt`}
      />

      <div className="stats-summary">
        <div className="stats-summary-item">
          <div className="ss-value" style={{ color: "var(--grn)" }}>
            {totalWins}
          </div>
          <div className="ss-label">Wins gesamt</div>
        </div>
        <div className="stats-summary-sep" />
        <div className="stats-summary-item">
          <div className="ss-value" style={{ color: "var(--red)" }}>
            {totalLosses}
          </div>
          <div className="ss-label">Losses gesamt</div>
        </div>
        <div className="stats-summary-sep" />
        <div className="stats-summary-item">
          <div
            className="ss-value"
            style={{
              color:
                overallWr >= 55
                  ? "var(--grn)"
                  : overallWr < 50
                    ? "var(--red)"
                    : "var(--txt)",
            }}
          >
            {overallWr}%
          </div>
          <div className="ss-label">Ø Winrate</div>
        </div>
        <div className="stats-summary-sep" />
        <div className="stats-summary-item">
          <div className="ss-value" style={{ color: "var(--gold)" }}>
            {totalSkins}
          </div>
          <div className="ss-label">Skins gesamt</div>
        </div>
      </div>

      <div className="stats-grid">
        {accounts.map((acc) => {
          const rank = acc.rank;
          const tier = rank?.tier ?? "UNRANKED";
          const rc = RANK_COLORS[tier];
          const winrate = rank?.winrate ?? 0;
          const wrColor =
            winrate >= 55
              ? "var(--grn)"
              : winrate < 50
                ? "var(--red)"
                : "var(--txt)";
          const lp = rank?.leaguePoints ?? 0;

          return (
            <div key={acc.id} className="stat-card">
              <div className="stat-card-hd">
                <img
                  src={profileIconUrl(acc.profileIconId)}
                  className="stat-card-icon"
                  alt={acc.summonerName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_ICON;
                  }}
                />
                <div className="stat-card-identity">
                  <div className="stat-card-name">
                    {acc.summonerName}
                    <span>#{acc.tagLine}</span>
                  </div>
                  <div className="stat-card-meta">
                    {acc.region} · Lv. {acc.summonerLevel}
                  </div>
                </div>
                <div className="stat-card-rank" style={{ color: rc }}>
                  <div className="stat-card-rank-ico">{RANK_ICONS[tier]}</div>
                  <div className="stat-card-rank-nm">
                    {rank?.fullRank ?? "Unranked"}
                  </div>
                </div>
              </div>

              <div className="stat-trio">
                <div className="stat-trio-item">
                  <div className="st-val" style={{ color: "var(--grn)" }}>
                    {rank?.wins ?? 0}
                  </div>
                  <div className="st-lbl">Wins</div>
                </div>
                <div className="stat-trio-item">
                  <div className="st-val" style={{ color: "var(--red)" }}>
                    {rank?.losses ?? 0}
                  </div>
                  <div className="st-lbl">Losses</div>
                </div>
                <div className="stat-trio-item">
                  <div className="st-val" style={{ color: wrColor }}>
                    {winrate}%
                  </div>
                  <div className="st-lbl">Winrate</div>
                </div>
              </div>

              <div className="stat-lp-wrap">
                <div className="stat-lp-row">
                  <span className="stat-lp-label">LP Progress</span>
                  <span className="stat-lp-value" style={{ color: rc }}>
                    {lp} LP
                  </span>
                </div>
                <div className="stat-lp-track">
                  <div
                    className="stat-lp-fill"
                    style={{ width: `${Math.min(lp, 100)}%`, background: rc }}
                  />
                </div>
              </div>

              <div className="stat-card-ft">
                <div className="stat-ft-item">
                  <span className="stat-ft-label">Skins</span>
                  <span className="stat-ft-val">{acc.skinIds.length}</span>
                </div>
                <div className="stat-ft-item">
                  <span className="stat-ft-label">Level</span>
                  <span className="stat-ft-val">{acc.summonerLevel}</span>
                </div>
                <div className="stat-ft-item">
                  <span className="stat-ft-label">Region</span>
                  <span className="stat-ft-val">{acc.region}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
