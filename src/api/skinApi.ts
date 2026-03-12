import { apiClient } from "./axiosClient";
import type { Skin } from "../types";

export interface SkinSearchResult {
  skins: Skin[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const skinApi = {
  getAll: async (): Promise<Skin[]> => {
    const { data } = await apiClient.get<{ skins: Skin[] }>("/skins");
    return data.skins;
  },

  search: async (
    q: string,
    page: number,
    size = 20,
  ): Promise<SkinSearchResult> => {
    const { data } = await apiClient.get<SkinSearchResult>("/skins/search", {
      params: { q, page, size },
    });
    return data;
  },

  getByChampion: async (championId: string): Promise<Skin[]> => {
    const { data } = await apiClient.get<{ skins: Skin[] }>(
      `/skins/champion/${championId}`,
    );
    return data.skins;
  },
};
