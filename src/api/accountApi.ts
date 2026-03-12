import { apiClient } from "./axiosClient";
import type { Account, NewAccountForm, RefreshCooldown, Skin } from "../types";

/**
 * Placeholder password – the backend requires a password field on account
 * creation, but it is not actually used for authentication in this context.
 * Ideally the backend should make this field optional.
 */
const PLACEHOLDER_PASSWORD = "randomPassword123!";


export const accountApi = {
  getAll: async (): Promise<Account[]> => {
    const { data } = await apiClient.get<{ accounts: Account[] }>("/accounts");
    return data.accounts;
  },

  getById: async (id: string): Promise<Account> => {
    const { data } = await apiClient.get<Account>(`/accounts/${id}`);
    return data;
  },

  create: async (form: NewAccountForm): Promise<string> => {
    const { data } = await apiClient.post<{ id: string }>("/accounts", {
      summonerName: form.summonerName,
      tagLine: form.tagLine,
      region: form.region,
      password: PLACEHOLDER_PASSWORD, // Backend erfordert ein Passwort, wird aber nicht aktiv genutzt
    });
    return data.id;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accounts/${id}`);
  },

  refreshRank: async (id: string): Promise<void> => {
    await apiClient.post(`/accounts/${id}/refresh`);
  },

  getCooldown: async (id: string): Promise<RefreshCooldown> => {
    const { data } = await apiClient.get<RefreshCooldown>(
      `/accounts/${id}/refresh/cooldown`,
    );
    return data;
  },

  addSkin: async (accountId: string, skinId: string): Promise<void> => {
    await apiClient.post(`/accounts/${accountId}/skins`, { skinId });
  },

  removeSkin: async (accountId: string, skinId: string): Promise<void> => {
    await apiClient.delete(`/accounts/${accountId}/skins/${skinId}`);
  },

  getSkins: async (accountId: string): Promise<Skin[]> => {
    const { data } = await apiClient.get<{ skins: Skin[] }>(
      `/accounts/${accountId}/skins`,
    );
    return data.skins;
  },
};
