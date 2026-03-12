import { useState, useEffect, useCallback } from "react";
import type { Account, NewAccountForm, RefreshCooldown } from "../types";
import { accountApi } from "../api/accountApi";
import { parseApiError } from "../api/axiosClient";

interface UseAccountsReturn {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  addAccount: (form: NewAccountForm) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  refreshRank: (id: string) => Promise<RefreshCooldown | null>;
  addSkin: (accountId: string, skinId: string) => Promise<void>;
  removeSkin: (accountId: string, skinId: string) => Promise<void>;
  reload: () => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Initial load ──────────────────────────────────────────────────────────

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await accountApi.getAll();
      setAccounts(data);
    } catch (e) {
      const err = parseApiError(e);
      setError(err.detail);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const addAccount = useCallback(async (form: NewAccountForm) => {
    const id = await accountApi.create(form);
    await accountApi.refreshRank(id);
    const created = await accountApi.getById(id);
    setAccounts((prev) => [...prev, created]);
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    await accountApi.delete(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const refreshRank = useCallback(
    async (id: string): Promise<RefreshCooldown | null> => {
      // Cooldown vorab prüfen
      const cooldown = await accountApi.getCooldown(id);
      if (!cooldown.canRefresh) return cooldown;

      await accountApi.refreshRank(id);
      // Aktualisierten Account nachladen
      const updated = await accountApi.getById(id);
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return null;
    },
    [],
  );

  const addSkin = useCallback(async (accountId: string, skinId: string) => {
    await accountApi.addSkin(accountId, skinId);
    const updated = await accountApi.getById(accountId);
    setAccounts((prev) => prev.map((a) => (a.id === accountId ? updated : a)));
  }, []);

  const removeSkin = useCallback(async (accountId: string, skinId: string) => {
    await accountApi.removeSkin(accountId, skinId);
    const updated = await accountApi.getById(accountId);
    setAccounts((prev) => prev.map((a) => (a.id === accountId ? updated : a)));
  }, []);

  return {
    accounts,
    isLoading,
    error,
    addAccount,
    deleteAccount,
    refreshRank,
    addSkin,
    removeSkin,
    reload,
  };
}
