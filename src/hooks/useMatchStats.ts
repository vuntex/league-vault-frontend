import { useState, useEffect } from "react";
import type { MatchStats } from "../types";
import { matchApi } from "../api/matchApi";
import { parseApiError } from "../api/axiosClient";

interface UseMatchStatsReturn {
  stats: MatchStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useMatchStats(accountId: string | null): UseMatchStatsReturn {
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    setIsLoading(true);
    matchApi
      .getStats(accountId)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) setError(parseApiError(e).detail);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return { stats, isLoading, error };
}
