import { useEffect, useMemo, useState } from "react";
import { api, followUpDue, pendingCount, STATUSES, type Role, type Status } from "./api";

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function statusLabel(s: Status) {
  return STATUSES.find((x) => x.value === s)?.label ?? s;
}

export default function Dashboard() {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [error, setError] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);

  async function reload() {
    try {
      setRoles(await api.list());
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const followUps = useMemo(
    () => (roles ?? []).map((r) => ({ role: r, ...followUpDue(r) })).filter((x) => x.due),
    [roles],
  );

  const totalPending = useMemo(
    () => (roles ?? []).reduce((acc, r) => acc + pendingCount(r), 0),
    [roles],
  );

  if (error) {
    return (
      <div className="ip-empty">
        <h2>Side-car not reachable</h2>
        <p>
          The interview-prep server on <code>localhost:4322</code> isn't responding. Start it with
          <code> npm run prep</code> in a second terminal.
        </p>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>{error}</p>
      </div>
    );
  }

  if (!roles) return <div className="ip-empty">Loading…</div>;

  return (
    <div className="ip-dash">
      <header className="ip-dash__header">
        <div>
          <div className="ip-eyebrow">Interview prep</div>
          <h1 className="ip-title">Roles</h1>
        </div>
        <button className="ip-btn ip-btn--primary" onClick={() => setShowAdd(true)}>
          + Add role
        </button>
      </header>

      {totalPending > 0 && (
        <div className="ip-queue">
          <strong>{totalPending} item{totalPending === 1 ? "" : "s"} queued for Claude Code.</strong>{" "}
          Open a Claude Code session in this repo and run <code>/prep</code> (or just say
          "process pending interview prep") and the drafts will be filled in.
        </div>
      )}

      {followUps.length > 0 && (
        <div className="ip-nudge">
          <strong>Follow up due:</strong>
          <ul>
            {followUps.map(({ role, days, threshold }) => (
              <li key={role.slug}>
                <a href={`/interview-prep/role?slug=${role.slug}`}>
                  {role.company} · {role.title}
                </a>{" "}
                <span className="ip-muted">
                  {statusLabel(role.status)} · {days}d since last update (threshold {threshold}d)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {roles.length === 0 ? (
        <div className="ip-empty">
          <p>No roles yet. Add one to get started.</p>
        </div>
      ) : (
        <table className="ip-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Status</th>
              <th>Last update</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => {
              const fu = followUpDue(r);
              return (
                <tr key={r.slug}>
                  <td>
                    <a href={`/interview-prep/role?slug=${r.slug}`}>{r.title || "(untitled)"}</a>
                  </td>
                  <td>{r.company}</td>
                  <td>
                    <span className={`ip-pill ip-pill--${r.status}`}>{statusLabel(r.status)}</span>
                  </td>
                  <td className="ip-muted">{fmtDate(r.updatedAt)}</td>
                  <td>
                    {pendingCount(r) > 0 && (
                      <span className="ip-flag ip-flag--queued">{pendingCount(r)} queued</span>
                    )}
                    {fu.due && <span className="ip-flag">Follow up</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showAdd && <AddRoleModal onClose={() => setShowAdd(false)} onCreated={reload} />}
    </div>
  );
}

function AddRoleModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [jdUrl, setJdUrl] = useState("");
  const [status, setStatus] = useState<Status>("saved");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const role = await api.create({ title, company, companyUrl, jdUrl, status });
      onCreated();
      onClose();
      window.location.href = `/interview-prep/role?slug=${role.slug}`;
    } catch (e: any) {
      setErr(e.message);
      setSaving(false);
    }
  }

  return (
    <div className="ip-modal" onClick={onClose}>
      <form className="ip-modal__card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2 className="ip-modal__title">Add role</h2>
        <label>
          Role title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </label>
        <label>
          Company website (careers or homepage)
          <input
            type="url"
            placeholder="https://..."
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
          />
        </label>
        <label>
          Job description URL
          <input
            type="url"
            placeholder="https://..."
            value={jdUrl}
            onChange={(e) => setJdUrl(e.target.value)}
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        {err && <div className="ip-error">{err}</div>}
        <div className="ip-modal__actions">
          <button type="button" className="ip-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="ip-btn ip-btn--primary" disabled={saving}>
            {saving ? "Saving…" : "Save role"}
          </button>
        </div>
        <p className="ip-modal__hint">
          When you save, the JD + company URLs get queued for Claude Code to fetch and digest.
          Run <code>/prep</code> in a Claude Code session to process the queue.
        </p>
      </form>
    </div>
  );
}
