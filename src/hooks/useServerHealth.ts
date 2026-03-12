import { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "../api/axiosClient";

export type ServerStatus = "online" | "offline" | "checking";

interface UseServerHealthReturn {
  status: ServerStatus;
  lastOnline: Date | null;
  retry: () => void;
}

const POLL_INTERVAL_MS = 30_000; // alle 30s prüfen wenn online
const RETRY_INTERVAL_MS = 5_000; // alle 5s prüfen wenn offline

export function useServerHealth(): UseServerHealthReturn {
  const [status, setStatus] = useState<ServerStatus>("checking");
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = useCallback(async () => {
    try {
      await apiClient.get("/actuator/health", { timeout: 4_000 });
      setStatus("online");
      setLastOnline(new Date());
    } catch {
      setStatus("offline");
    }
  }, []);

  const scheduleNext = useCallback(
    (currentStatus: ServerStatus) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const delay =
        currentStatus === "offline" ? RETRY_INTERVAL_MS : POLL_INTERVAL_MS;
      timerRef.current = setTimeout(() => check(), delay);
    },
    [check],
  );

  // Re-schedule whenever status changes
  useEffect(() => {
    scheduleNext(status);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, scheduleNext]);

  // Initial check on mount – schedule async to avoid sync setState in effect
  useEffect(() => {
    const t = setTimeout(() => check(), 0);
    return () => clearTimeout(t);
  }, [check]);

  // Also check immediately when tab becomes visible again
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [check]);

  const retry = useCallback(() => {
    setStatus("checking");
    check();
  }, [check]);

  return { status, lastOnline, retry };
}
