import React from "react";
import type { Tab } from "../types";

interface NavItem {
  id: Tab;
  icon: string;
  label: string;
}

interface SidebarProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onAddAccount: () => void;
  onLogout: () => void;
  accountCount: number;
  skinCount: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "accounts", icon: "◈", label: "Accounts" },
  { id: "matches", icon: "◉", label: "Matches" },
  { id: "skins", icon: "✦", label: "Skins" },
  { id: "stats", icon: "◉", label: "Stats" },
];

const Sidebar: React.FC<SidebarProps> = ({
  tab,
  onTabChange,
  onAddAccount,
  onLogout,
  accountCount,
  skinCount,
}) => {
  const badges: Record<Tab, number | null> = {
    accounts: accountCount,
    matches: null,
    skins: skinCount,
    stats: null,
  };

  return (
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo-hex">⚜</div>
        <div>
          <div className="logo-text">VAULT</div>
          <div className="logo-sub">LoL Manager</div>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${tab === item.id ? "active" : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-ico">{item.icon}</span>
            {item.label}
            {badges[item.id] !== null && (
              <span className="nav-badge">{badges[item.id]}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button className="btn-add" onClick={onAddAccount}>
          + Account
        </button>
      </div>

      <div className="sidebar-logout">
        <button className="logout-btn" onClick={onLogout}>
          Abmelden
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
