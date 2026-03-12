import { useState, useCallback, useRef } from "react";

interface UseToastReturn {
  message: string | null;
  show: (msg: string) => void;
}

export function useToast(): UseToastReturn {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string) => {
    // Clear any existing timer to prevent stale dismissals
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), 3000);
  }, []);

  return { message, show };
}
