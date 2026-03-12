import type { Rank } from "../types";

// ─── Rank Meta ────────────────────────────────────────────────────────────────

export const RANKS: Rank[] = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

export const RANK_COLORS: Record<Rank, string> = {
  IRON: "#8a8a8a",
  BRONZE: "#cd7f32",
  SILVER: "#c0c0c0",
  GOLD: "#ffd700",
  PLATINUM: "#00c9a7",
  EMERALD: "#50c878",
  DIAMOND: "#b9f2ff",
  MASTER: "#9d4dca",
  GRANDMASTER: "#e84057",
  CHALLENGER: "#f4c874",
  UNRANKED: "#555555",
};

export const RANK_ICONS: Record<Rank, string> = {
  IRON: "⬡",
  BRONZE: "◆",
  SILVER: "◈",
  GOLD: "✦",
  PLATINUM: "❋",
  EMERALD: "◉",
  DIAMOND: "◇",
  MASTER: "★",
  GRANDMASTER: "☆",
  CHALLENGER: "⚜",
  UNRANKED: "—",
};

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const REGIONS: string[] = [
  "EUW",
  "EUNE",
  "NA",
  "KR",
  "JP",
  "BR",
  "LAN",
  "LAS",
];

const ICON_BASE =
  "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon";
export const FALLBACK_ICON = `${ICON_BASE}/1.png`;

export const profileIconUrl = (iconId: number) => `${ICON_BASE}/${iconId}.png`;
