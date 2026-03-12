import { useState, useEffect, useMemo } from "react";
import type { Skin } from "../types";
import { skinApi } from "../api/skinApi";

interface UseSkinsReturn {
  skins: Skin[];
  skinMap: Map<string, Skin>;
  loading: boolean;
}

// Loads all skins once as a catalogue for mapping skinIds → Skin objects.
export function useSkins(enabled: boolean): UseSkinsReturn {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    skinApi
      .getAll()
      .then((data) => setSkins(data))
      .finally(() => setLoading(false));
  }, [enabled]);

  // O(1) lookup map instead of O(n) .find() calls
  const skinMap = useMemo(() => new Map(skins.map((s) => [s.id, s])), [skins]);

  return { skins, skinMap, loading };
}
