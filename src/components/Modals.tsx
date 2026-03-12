import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Account, NewAccountForm, Skin } from "../types";
import { REGIONS, FALLBACK_ICON } from "../constants";
import { skinApi } from "../api/skinApi";

// ─── Shared Modal Shell ────────────────────────────────────────────────────────

interface ModalShellProps {
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({
  title,
  onClose,
  footer,
  wide,
  children,
}) => (
  <div className="backdrop" onClick={onClose}>
    <div
      className="modal"
      style={wide ? { maxWidth: 580 } : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-hd">
        <div className="modal-title">{title}</div>
        <button className="modal-x" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="modal-bd">{children}</div>
      {footer && <div className="modal-ft">{footer}</div>}
    </div>
  </div>
);

// ─── AddAccountModal ──────────────────────────────────────────────────────────

interface AddAccountModalProps {
  form: NewAccountForm;
  onChange: (form: NewAccountForm) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  form,
  onChange,
  onSubmit,
  onClose,
}) => {
  const set = <K extends keyof NewAccountForm>(
    key: K,
    value: NewAccountForm[K],
  ) => onChange({ ...form, [key]: value });

  return (
    <ModalShell
      title="Account hinzufügen"
      onClose={onClose}
      footer={
        <>
          <button className="btn-sec" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-prim" onClick={onSubmit}>
            Speichern
          </button>
        </>
      }
    >
      <div className="field-row">
        <div className="field">
          <label className="field-lbl">Summoner Name</label>
          <input
            className="field-inp"
            placeholder="NightOwl"
            value={form.summonerName}
            onChange={(e) => set("summonerName", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-lbl">Tag</label>
          <input
            className="field-inp"
            placeholder="EUW"
            value={form.tagLine}
            onChange={(e) => set("tagLine", e.target.value)}
            maxLength={5}
          />
        </div>
      </div>

      <div className="field-row">
        {/*
        <div className="field">
          <label className="field-lbl">Passwort</label>
          <input
            className="field-inp"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </div>
         */}
        <div className="field">
          <label className="field-lbl">Region</label>
          <select
            className="field-sel"
            value={form.region}
            onChange={(e) =>
              set("region", e.target.value as NewAccountForm["region"])
            }
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hint">
        ⚠ Passwörter werden verschlüsselt gespeichert (BCrypt).
        <br />
        Rank & LP werden automatisch über die Riot API abgerufen.
      </div>
    </ModalShell>
  );
};

// ─── AddSkinModal ─────────────────────────────────────────────────────────────

interface AddSkinModalProps {
  account: Account;
  onPickSkin: (skinId: string) => void;
  onClose: () => void;
}

export const AddSkinModal: React.FC<AddSkinModalProps> = ({
  account,
  onPickSkin,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Skin[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchIdRef = useRef(0);
  const pageRef = useRef(0);
  const queryRef = useRef("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(async (q: string, p: number) => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    try {
      const { skins: next, totalPages } = await skinApi.search(q, p);
      if (id !== fetchIdRef.current) return;
      setItems((prev) => (p === 0 ? next : [...prev, ...next]));
      pageRef.current = p;
      setHasMore(p + 1 < totalPages);
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, []);

  // Debounced query → reset to page 0
  useEffect(() => {
    const delay = queryRef.current === query ? 0 : 300;
    const t = setTimeout(() => {
      queryRef.current = query;
      fetchPage(query, 0);
    }, delay);
    return () => clearTimeout(t);
  }, [query, fetchPage]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPage(queryRef.current, pageRef.current + 1);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, fetchPage]);

  return (
    <ModalShell title="Skin hinzufügen" onClose={onClose} wide>
      <div className="skin-modal-account-info">
        Account:{" "}
        <span>
          {account.summonerName}#{account.tagLine}
        </span>
      </div>

      <div className="field skin-modal-search-field">
        <input
          className="field-inp"
          placeholder="Champion oder Skin suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="picker-scroll">
        <div className="picker-grid">
          {items.map((skin) => {
            const owned = account.skinIds.includes(skin.id);
            return (
              <div
                key={skin.id}
                className={`pick-item${owned ? " owned" : ""}`}
                onClick={() => !owned && onPickSkin(skin.id)}
                title={
                  owned
                    ? "Bereits vorhanden"
                    : `${skin.championName} · ${skin.skinName}`
                }
              >
                <img
                  src={skin.splashUrl}
                  alt={skin.skinName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_ICON;
                  }}
                />
                <div className="pick-meta">
                  <div className="pick-champ">{skin.championName}</div>
                  <div className="pick-skin">{skin.skinName}</div>
                </div>
              </div>
            );
          })}
        </div>
        {loading && <div className="picker-loading">Lade…</div>}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </ModalShell>
  );
};
