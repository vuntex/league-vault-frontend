import { useState, useCallback } from "react";
import type { Match, SyncResult } from "../types";
import { matchApi } from "../api/matchApi";
import { parseApiError } from "../api/axiosClient";

interface UseMatchesReturn {
  matches: Match[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  load: (accountId: string, limit?: number) => Promise<void>;
  sync: (accountId: string) => Promise<SyncResult>;
}

export function useMatches(): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (accountId: string, limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await matchApi.getRecent(accountId, limit);
      setMatches(data);
    } catch (e) {
      setError(parseApiError(e).detail);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sync = useCallback(async (accountId: string): Promise<SyncResult> => {
    setIsSyncing(true);
    try {
      const result = await matchApi.sync(accountId);
      if (result.newMatches > 0) {
        // Neu laden nach Sync
        const updated = await matchApi.getRecent(accountId, 20);
        setMatches(updated);
      }
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { matches, isLoading, isSyncing, error, load, sync };
}
