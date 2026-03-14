import { useState, useEffect } from "react";
import type { DailyRecap } from "../types";
import { matchApi } from "../api/matchApi";
import { parseApiError } from "../api/axiosClient";

interface UseDailyRecapReturn {
  recap: DailyRecap | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useDailyRecap(accountId: string | null): UseDailyRecapReturn {
  const [recap, setRecap] = useState<DailyRecap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    matchApi
      .getDailyRecap(accountId)
      .then((data) => {
        if (!cancelled) setRecap(data);
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
  }, [accountId, tick]);

  const reload = () => setTick((t) => t + 1);

  return { recap, isLoading, error, reload };
}
