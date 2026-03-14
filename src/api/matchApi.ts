import { apiClient } from "./axiosClient";
import type {
  Match,
  DailyRecap,
  MatchStats,
  LpSnapshot,
  SyncResult,
} from "../types";

export const matchApi = {
  // Manueller Sync — HIGH-Priorität im Backend
  sync: async (accountId: string): Promise<SyncResult> => {
    const { data } = await apiClient.post<SyncResult>(
      `/accounts/${accountId}/matches/sync`,
    );
    return data;
  },

  getRecent: async (accountId: string, limit = 20): Promise<Match[]> => {
    const { data } = await apiClient.get<Match[]>(
      `/accounts/${accountId}/matches`,
      { params: { limit } },
    );
    return data;
  },

  getDailyRecap: async (accountId: string): Promise<DailyRecap> => {
    const { data } = await apiClient.get<DailyRecap>(
      `/accounts/${accountId}/matches/recap`,
    );
    return data;
  },

  getStats: async (accountId: string): Promise<MatchStats> => {
    const { data } = await apiClient.get<MatchStats>(
      `/accounts/${accountId}/matches/stats`,
    );
    return data;
  },

  getLpHistory: async (accountId: string): Promise<LpSnapshot[]> => {
    const { data } = await apiClient.get<LpSnapshot[]>(
      `/accounts/${accountId}/matches/lp`,
    );
    return data;
  },
};
