import { useEffect, useState } from "react";
import { api, type SyncStatus } from "./api";

function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function SyncIndicator() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function refresh() {
    try {
      setStatus(await api.syncStatus());
    } catch {
      // side-car not reachable; rendered upstream
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  async function clickSync() {
    setSyncing(true);
    try {
      setStatus(await api.syncNow());
    } catch (e) {
      // status will surface error on next refresh
    } finally {
      setSyncing(false);
    }
  }

  if (!status) return null;

  const state = status.lastError
    ? "error"
    : syncing || status.inProgress
      ? "syncing"
      : status.pendingChanges
        ? "pending"
        : "clean";

  const label =
    state === "error"
      ? "Sync failed"
      : state === "syncing"
        ? "Syncing…"
        : state === "pending"
          ? `Pending · synced ${timeAgo(status.lastSyncAt)}`
          : `Synced ${timeAgo(status.lastSyncAt)}`;

  return (
    <div className="ip-sync" title={status.lastError ?? ""}>
      <span className={`ip-sync__dot ip-sync__dot--${state}`} />
      <span className="ip-sync__label">{label}</span>
      <button
        className="ip-sync__btn"
        onClick={clickSync}
        disabled={syncing || status.inProgress}
      >
        Sync now
      </button>
    </div>
  );
}
