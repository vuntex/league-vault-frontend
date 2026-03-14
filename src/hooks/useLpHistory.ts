import { useState, useEffect } from "react";
import type { LpSnapshot } from "../types";
import { matchApi } from "../api/matchApi";
import { parseApiError } from "../api/axiosClient";

interface UseLpHistoryReturn {
  snapshots: LpSnapshot[];
  isLoading: boolean;
  error: string | null;
}

export function useLpHistory(accountId: string | null): UseLpHistoryReturn {
  const [snapshots, setSnapshots] = useState<LpSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    setIsLoading(true);
    matchApi
      .getLpHistory(accountId)
      .then((data) => {
        if (!cancelled) setSnapshots(data);
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

  return { snapshots, isLoading, error };
}
