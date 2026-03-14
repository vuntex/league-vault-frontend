import axios from "axios";
import type {
  Account,
  Match,
  DailyRecap,
  MatchStats,
  LpSnapshot,
} from "../types";

// Eigener Axios-Client ohne JWT-Interceptor
const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

export const publicApi = {
  getDashboard: async (): Promise<Account[]> => {
    const { data } = await publicClient.get<Account[]>("/public/dashboard");
    return data;
  },

  getMatches: async (accountId: string, limit = 20): Promise<Match[]> => {
    const { data } = await publicClient.get<Match[]>(
      `/public/accounts/${accountId}/matches`,
      { params: { limit } },
    );
    return data;
  },

  getRecap: async (accountId: string): Promise<DailyRecap> => {
    const { data } = await publicClient.get<DailyRecap>(
      `/public/accounts/${accountId}/recap`,
    );
    return data;
  },

  getStats: async (accountId: string): Promise<MatchStats> => {
    const { data } = await publicClient.get<MatchStats>(
      `/public/accounts/${accountId}/stats`,
    );
    return data;
  },

  getLpHistory: async (accountId: string): Promise<LpSnapshot[]> => {
    const { data } = await publicClient.get<LpSnapshot[]>(
      `/public/accounts/${accountId}/lp`,
    );
    return data;
  },
};
