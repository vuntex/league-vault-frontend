import React, { useEffect, useState } from "react";

export type ServerStatus = "online" | "offline" | "checking";

interface ServerStatusBannerProps {
  status: ServerStatus;
  lastOnline: Date | null;
  onRetry: () => void;
}

const ServerStatusBanner: React.FC<ServerStatusBannerProps> = ({
  status,
  lastOnline,
  onRetry,
}) => {
  // Delay showing the banner slightly to avoid flicker on fast connections
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "offline") {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
    // Synchronous reset is intentional: when server comes back online,
    // hide the banner immediately without waiting for a re-render cycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);
    return undefined;
  }, [status]);

  if (!visible) return null;

  const lastOnlineText = lastOnline
    ? `Zuletzt erreichbar: ${lastOnline.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`
    : "Server bisher nicht erreichbar";

  return (
    <div className="server-banner">
      <div className="sb-left">
        <span className="sb-dot" />
        <div>
          <div className="sb-title">Server nicht erreichbar</div>
          <div className="sb-sub">
            {lastOnlineText} · Wird automatisch erneut versucht…
          </div>
        </div>
      </div>
      <button className="sb-retry" onClick={onRetry}>
        ↻ Jetzt prüfen
      </button>
    </div>
  );
};

export default React.memo(ServerStatusBanner);
