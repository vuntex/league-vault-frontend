// ─── Navigation ───────────────────────────────────────────────────────────────

export type Tab = "accounts" | "skins" | "stats";

// ─── Rank & Division ──────────────────────────────────────────────────────────

export type Rank =
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "EMERALD"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER"
  | "UNRANKED";

export type Division = "I" | "II" | "III" | "IV";

export type Region =
  | "EUW1"
  | "EUNE"
  | "NA"
  | "KR"
  | "JP"
  | "BR"
  | "LAN"
  | "LAS";

// ─── Skin ─────────────────────────────────────────────────────────────────────

export interface RankInfo {
  tier: Rank;
  division: Division;
  leaguePoints: number;
  wins: number;
  losses: number;
  winrate: number;
  fullRank: string;
}

export interface Account {
  id: string; // UUID from backend
  summonerName: string;
  tagLine: string;
  region: Region;
  displayName: string; // summonerName#tagLine
  rank: RankInfo | null;
  summonerLevel: number;
  profileIconId: number;
  skinIds: string[]; // UUID[]
  rankLastUpdated: string | null;
  createdAt: string;
}

export interface Skin {
  id: string; // UUID from backend
  riotSkinId: number;
  championId: string;
  championName: string;
  skinName: string;
  splashUrl: string;
  loadingUrl: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  userId: string;
}

// ─── Cooldown ─────────────────────────────────────────────────────────────────

export interface RefreshCooldown {
  canRefresh: boolean;
  availableAt: string | null;
  secondsRemaining: number;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface NewAccountForm {
  summonerName: string;
  tagLine: string;
  password: string;
  region: Region;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

// ─── Derived / View Types ─────────────────────────────────────────────────────

export interface FlatSkin extends Skin {
  accountId: string;
  accountName: string;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  title: string;
  detail: string;
  status: number;
  secondsRemaining?: number;
  availableAt?: string;
}
