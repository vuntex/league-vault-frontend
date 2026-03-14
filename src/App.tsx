import React, { useState, useMemo, useCallback } from "react";
import type { Tab, NewAccountForm } from "./types";
import { useAuth } from "./context/useAuth";
import Sidebar from "./components/Sidebar";
import { AccountsPage, SkinsPage, StatsPage } from "./components/Pages";
import {
  AddAccountModal,
  AddSkinModal,
  DeleteAccountModal,
  DeleteSkinModal,
} from "./components/Modals";
import AuthPage from "./components/AuthPage";
import { useToast } from "./hooks/useToast";
import { useAccounts } from "./hooks/useAccounts";
import { useSkins } from "./hooks/useSkins";
import { useSkinSearch } from "./hooks/useSkinSearch";
import { parseApiError } from "./api/axiosClient";
import { useServerHealth } from "./hooks/useServerHealth";
import ServerStatusBanner from "./components/ServerStatusBanner";
import MobileNav from "./components/MobileNav";

const EMPTY_FORM: NewAccountForm = {
  summonerName: "",
  tagLine: "EUW",
  password: "",
  region: "EUW1",
};

const App: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("accounts");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [skinModalForId, setSkinModalForId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSkinConfirm, setDeleteSkinConfirm] = useState<{
    accountId: string;
    skinId: string;
  } | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [newAccountForm, setNewAccountForm] =
    useState<NewAccountForm>(EMPTY_FORM);

  // ── Server health ──────────────────────────────────────────────────────────
  const {
    status: serverStatus,
    lastOnline,
    retry: retryServer,
  } = useServerHealth();

  // ── Domain hooks ───────────────────────────────────────────────────────────
  const { message: toast, show: showToast } = useToast();
  const {
    accounts,
    isLoading: accountsLoading,
    error: accountsError,
    addAccount,
    deleteAccount,
    refreshRank,
    addSkin,
    removeSkin,
  } = useAccounts(isAuthenticated);
  const { skinMap } = useSkins(isAuthenticated);
  const {
    query,
    setQuery,
    results: searchResults,
    totalCount: totalSkins,
  } = useSkinSearch(accounts, skinMap);

  // ── Derived ────────────────────────────────────────────────────────────────
  const sortedAccounts = useMemo(
    () => [...accounts].sort((a, b) => b.summonerLevel - a.summonerLevel),
    [accounts],
  );
  const skinModalAccount =
    skinModalForId !== null
      ? (accounts.find((a) => a.id === skinModalForId) ?? null)
      : null;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleRefresh = useCallback(
    async (id: string) => {
      setRefreshingId(id);
      try {
        const cooldown = await refreshRank(id);
        if (cooldown && !cooldown.canRefresh) {
          const mins = Math.ceil(cooldown.secondsRemaining / 60);
          showToast(
            `⏳ Cooldown – noch ${mins} Minute${mins !== 1 ? "n" : ""}`,
          );
        } else {
          showToast("✦ Rank aktualisiert");
        }
      } catch (e) {
        showToast(`Fehler: ${parseApiError(e).detail}`);
      } finally {
        setRefreshingId(null);
      }
    },
    [refreshRank, showToast],
  );

  const handleDeleteAccount = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteAccount(deleteConfirmId);
      showToast("Account entfernt");
    } catch (e) {
      showToast(`Fehler: ${parseApiError(e).detail}`);
    } finally {
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, deleteAccount, showToast]);

  const handleSubmitNewAccount = async () => {
    if (!newAccountForm.summonerName.trim()) return;
    try {
      await addAccount(newAccountForm);
      setShowAddAccount(false);
      setNewAccountForm(EMPTY_FORM);
      showToast("✦ Account hinzugefügt");
    } catch (e) {
      showToast(`Fehler: ${parseApiError(e).detail}`);
    }
  };

  const handlePickSkin = async (skinId: string) => {
    if (skinModalForId === null) return;
    try {
      await addSkin(skinModalForId, skinId);
      setSkinModalForId(null);
      showToast("✦ Skin hinzugefügt");
    } catch (e) {
      showToast(`Fehler: ${parseApiError(e).detail}`);
    }
  };

  const handleRemoveSkin = useCallback(
    async (accountId: string, skinId: string, skipConfirm?: boolean) => {
      if (!skipConfirm) {
        setDeleteSkinConfirm({ accountId, skinId });
        return;
      }
      try {
        await removeSkin(accountId, skinId);
        showToast("Skin entfernt");
      } catch (e) {
        showToast(`Fehler: ${parseApiError(e).detail}`);
      }
    },
    [removeSkin, showToast],
  );

  const handleConfirmDeleteSkin = useCallback(async () => {
    if (deleteSkinConfirm === null) return;
    try {
      await removeSkin(deleteSkinConfirm.accountId, deleteSkinConfirm.skinId);
      showToast("Skin entfernt");
    } catch (e) {
      showToast(`Fehler: ${parseApiError(e).detail}`);
    } finally {
      setDeleteSkinConfirm(null);
    }
  }, [deleteSkinConfirm, removeSkin, showToast]);

  // ── Loading / Auth guards ──────────────────────────────────────────────────

  if (authLoading) {
    return <div className="app-loading">✦</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (accountsLoading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-inner">
          <div className="app-loading-logo">✦</div>
          <div className="app-loading-label">League Vault</div>
          <div className="app-loading-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-inner">
          <div className="app-loading-logo app-loading-logo--error">✦</div>
          <div className="app-loading-label">League Vault</div>
          <div className="app-loading-error-msg">{accountsError}</div>
          <button className="btn-prim" onClick={() => window.location.reload()}>
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <ServerStatusBanner
        status={serverStatus}
        lastOnline={lastOnline}
        onRetry={retryServer}
      />
      <div className="app">
        <Sidebar
          tab={tab}
          onTabChange={setTab}
          onAddAccount={() => setShowAddAccount(true)}
          onLogout={logout}
          accountCount={accounts.length}
          skinCount={totalSkins}
        />

        <div className="content">
          <div className="page-transition" key={tab}>
            {tab === "accounts" && (
              <AccountsPage
                accounts={sortedAccounts}
                skinMap={skinMap}
                totalSkins={totalSkins}
                refreshingId={refreshingId}
                onRefresh={handleRefresh}
                onDelete={handleDeleteAccount}
                onAddSkin={(id) => setSkinModalForId(id)}
                onRemoveSkin={handleRemoveSkin}
              />
            )}
            {tab === "skins" && (
              <SkinsPage
                accounts={accounts}
                skinMap={skinMap}
                totalSkins={totalSkins}
                query={query}
                onQueryChange={setQuery}
                searchResults={searchResults}
                onAddSkin={(id) => setSkinModalForId(id)}
                onRemoveSkin={handleRemoveSkin}
              />
            )}
            {tab === "stats" && <StatsPage accounts={accounts} />}
          </div>
        </div>

        <MobileNav
          tab={tab}
          onTabChange={setTab}
          onAddAccount={() => setShowAddAccount(true)}
          onLogout={logout}
        />
      </div>

      {showAddAccount && (
        <AddAccountModal
          form={newAccountForm}
          onChange={setNewAccountForm}
          onSubmit={handleSubmitNewAccount}
          onClose={() => setShowAddAccount(false)}
        />
      )}

      {skinModalAccount && (
        <AddSkinModal
          account={skinModalAccount}
          onPickSkin={handlePickSkin}
          onClose={() => setSkinModalForId(null)}
        />
      )}

      {deleteConfirmId !== null &&
        (() => {
          const acc = accounts.find((a) => a.id === deleteConfirmId);
          return acc ? (
            <DeleteAccountModal
              account={acc}
              onConfirm={handleConfirmDelete}
              onClose={() => setDeleteConfirmId(null)}
            />
          ) : null;
        })()}

      {deleteSkinConfirm !== null &&
        (() => {
          const skin = skinMap.get(deleteSkinConfirm.skinId);
          return skin ? (
            <DeleteSkinModal
              skin={skin}
              onConfirm={handleConfirmDeleteSkin}
              onClose={() => setDeleteSkinConfirm(null)}
            />
          ) : null;
        })()}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default App;
