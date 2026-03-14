import { useState, useEffect, useCallback } from "react";
import type {
  Account,
  Match,
  DailyRecap,
  MatchStats,
  LpSnapshot,
} from "../types";
import { publicApi } from "../api/publicApi";

// ── Dashboard-Level (Accounts laden) ─────────────────────────────────────────

interface UsePublicDashboardReturn {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
}

export function usePublicDashboard(): UsePublicDashboardReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .getDashboard()
      .then(setAccounts)
      .catch((e) => setError(e?.response?.data?.detail ?? "Fehler beim Laden"))
      .finally(() => setIsLoading(false));
  }, []);

  return { accounts, isLoading, error };
}

// ── Account-Level (Matches + Stats für einen Account) ────────────────────────

interface UsePublicAccountDataReturn {
  matches: Match[];
  recap: DailyRecap | null;
  stats: MatchStats | null;
  snapshots: LpSnapshot[];
  isLoading: boolean;
}

export function usePublicAccountData(
  accountId: string | null,
): UsePublicAccountDataReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recap, setRecap] = useState<DailyRecap | null>(null);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [snapshots, setSnapshots] = useState<LpSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    setIsLoading(true);

    Promise.all([
      publicApi.getMatches(accountId, 30),
      publicApi.getRecap(accountId),
      publicApi.getStats(accountId),
      publicApi.getLpHistory(accountId),
    ])
      .then(([m, r, s, lp]) => {
        if (cancelled) return;
        setMatches(m);
        setRecap(r);
        setStats(s);
        setSnapshots(lp);
      })
      .catch(() => {
        /* Stille Fehler — Dashboard bleibt leer */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return { matches, recap, stats, snapshots, isLoading };
}
