import { useState, useEffect, useMemo } from "react";
import type { Skin } from "../types";
import { skinApi } from "../api/skinApi";

interface UseSkinsReturn {
  skins: Skin[];
  skinMap: Map<string, Skin>;
  loading: boolean;
}

// Loads all skins once as a catalogue for mapping skinIds → Skin objects.
export function useSkins(): UseSkinsReturn {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skinApi
      .getAll()
      .then((data) => setSkins(data))
      .finally(() => setLoading(false));
  }, []);

  // O(1) lookup map instead of O(n) .find() calls
  const skinMap = useMemo(
    () => new Map(skins.map((s) => [s.id, s])),
    [skins],
  );

  return { skins, skinMap, loading };
}
