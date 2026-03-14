// ─── Navigation ───────────────────────────────────────────────────────────────

export type Tab = "accounts" | "matches" | "skins" | "stats";

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

export type Position =
  | "TOP"
  | "JUNGLE"
  | "MIDDLE"
  | "BOTTOM"
  | "UTILITY"
  | "FILL";

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

// ─── Match Tracking ───────────────────────────────────────────────────────────

export interface Match {
  id: string;
  riotMatchId: string;
  queueId: number;
  win: boolean;
  remake: boolean;
  champion: string;
  position: Position;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  damageDealt: number;
  visionScore: number;
  goldEarned: number;
  csTotal: number;
  csPerMinute: number;
  durationSeconds: number;
  lpBefore: number | null;
  lpAfter: number | null;
  lpChange: number | null;
  playedAt: string;
}

export interface DailyRecap {
  accountDisplayName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  remakes: number;
  lpChange: number;
  avgKda: number;
  mostPlayedChampion: string | null;
  bestChampion: string | null;
  bestGame: Match | null;
  worstGame: Match | null;
  currentWinStreak: number;
  currentLossStreak: number;
}

export interface MatchStats {
  totalGames: number;
  wins: number;
  losses: number;
  winrate: number;
  avgKda: number;
  avgDamage: number;
  avgCsPerMin: number;
  avgVisionScore: number;
  mostPlayedChampion: string;
  mostPlayedGames: number;
  mostPlayedWinrate: number;
  longestWinStreak: number;
  longestLossStreak: number;
}

export interface LpSnapshot {
  tier: Rank;
  division: Division;
  lp: number;
  absoluteLp: number;
  wins: number;
  losses: number;
  recordedAt: string;
}

export interface SyncResult {
  newMatches: number;
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
