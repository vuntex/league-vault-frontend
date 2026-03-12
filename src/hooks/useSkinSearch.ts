import { useState, useMemo } from "react";
import type { Account, FlatSkin, Skin } from "../types";

interface UseSkinSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: FlatSkin[] | null;
  allFlat: FlatSkin[];
  totalCount: number;
}

export function useSkinSearch(
  accounts: Account[],
  skinMap: Map<string, Skin>,
): UseSkinSearchReturn {
  const [query, setQuery] = useState("");

  const allFlat = useMemo<FlatSkin[]>(
    () =>
      accounts.flatMap((acc) =>
        acc.skinIds
          .map((id) => skinMap.get(id))
          .filter((s): s is Skin => s !== undefined)
          .map((s) => ({
            ...s,
            accountId: acc.id,
            accountName: acc.displayName,
          })),
      ),
    [accounts, skinMap],
  );

  const results = useMemo<FlatSkin[] | null>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return allFlat.filter(
      (s) =>
        s.championName.toLowerCase().includes(q) ||
        s.skinName.toLowerCase().includes(q) ||
        s.accountName.toLowerCase().includes(q),
    );
  }, [query, allFlat]);

  return { query, setQuery, results, allFlat, totalCount: allFlat.length };
}
