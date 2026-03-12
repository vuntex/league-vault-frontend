import React from "react";
import type { Tab } from "../types";

interface MobileNavProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onAddAccount: () => void;
}

interface NavItem {
  id: Tab;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "accounts", icon: "◈", label: "Accounts" },
  { id: "skins", icon: "✦", label: "Skins" },
  { id: "stats", icon: "◉", label: "Stats" },
];

const MobileNav: React.FC<MobileNavProps> = ({
  tab,
  onTabChange,
  onAddAccount,
}) => {
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${tab === item.id ? "active" : ""}`}
          onClick={() => onTabChange(item.id)}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
      <button className="mobile-nav-item mobile-nav-add" onClick={onAddAccount}>
        <span className="mobile-nav-icon">+</span>
        <span className="mobile-nav-label">Neu</span>
      </button>
    </nav>
  );
};

export default React.memo(MobileNav);
