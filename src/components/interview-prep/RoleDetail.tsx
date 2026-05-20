import { useEffect, useState } from "react";
import { api, STATUSES, type Role, type Status } from "./api";

const NOTE_STAGES: { key: keyof Role["notes"]; label: string }[] = [
  { key: "recruiter", label: "Recruiter notes" },
  { key: "hiringManager", label: "Hiring manager call" },
  { key: "panel", label: "Panel interview" },
  { key: "offer", label: "Offer" },
];

function useDebouncedSave(slug: string, role: Role | null, setRole: (r: Role) => void) {
  const [saving, setSaving] = useState(false);
  function patch(partial: Partial<Role>) {
    if (!role) return;
    const next = { ...role, ...partial };
    if (partial.notes) next.notes = { ...role.notes, ...partial.notes };
    setRole(next);
    setSaving(true);
    clearTimeout((patch as any)._t);
    (patch as any)._t = setTimeout(async () => {
      try {
        const fresh = await api.patch(slug, partial);
        setRole(fresh);
      } finally {
        setSaving(false);
      }
    }, 500);
  }
  return { saving, patch };
}

export default function RoleDetail({ slug }: { slug: string }) {
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [queuingContext, setQueuingContext] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setRole(await api.get(slug));
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, [slug]);

  const { saving, patch } = useDebouncedSave(slug, role, setRole);

  async function queueContext() {
    if (!role) return;
    setQueuingContext(true);
    try {
      setRole(await api.queueContext(slug));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setQueuingContext(false);
    }
  }

  if (error) return <div className="ip-empty"><p>{error}</p></div>;
  if (!role) return <div className="ip-empty">Loading…</div>;

  return (
    <div className="ip-detail">
      <a className="ip-back" href="/interview-prep">&larr; All roles</a>

      <header className="ip-detail__header">
        <div className="ip-detail__title-row">
          <input
            className="ip-detail__title"
            value={role.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Role title"
          />
          <select
            className="ip-detail__status"
            value={role.status}
            onChange={(e) => patch({ status: e.target.value as Status })}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <input
          className="ip-detail__company"
          value={role.company}
          onChange={(e) => patch({ company: e.target.value })}
          placeholder="Company"
        />
        <div className="ip-detail__links">
          <input
            type="url"
            value={role.jdUrl}
            onChange={(e) => patch({ jdUrl: e.target.value })}
            placeholder="Job description URL"
          />
          <input
            type="url"
            value={role.companyUrl}
            onChange={(e) => patch({ companyUrl: e.target.value })}
            placeholder="Company URL"
          />
          <button className="ip-btn" onClick={queueContext} disabled={queuingContext || role.pendingContext}>
            {role.pendingContext ? "Queued for Claude Code" : queuingContext ? "Queueing…" : "Queue context fetch"}
          </button>
        </div>
        {saving && <div className="ip-saving">Saving…</div>}

        {(role.jdSummary || role.companyContext) && (
          <details className="ip-context">
            <summary>Role + company digest</summary>
            {role.jdSummary && (
              <div>
                <h4>Role digest</h4>
                <p>{role.jdSummary}</p>
              </div>
            )}
            {role.companyContext && (
              <div>
                <h4>Company digest</h4>
                <p>{role.companyContext}</p>
              </div>
            )}
          </details>
        )}
      </header>

      <div className="ip-panes">
        <section className="ip-pane">
          <h2 className="ip-pane__title">Stage notes</h2>
          {NOTE_STAGES.map(({ key, label }) => (
            <div className="ip-note" key={key}>
              <label>{label}</label>
              <textarea
                rows={6}
                value={role.notes[key]}
                onChange={(e) => patch({ notes: { [key]: e.target.value } as any })}
                placeholder={`What happened in the ${label.toLowerCase()}?`}
              />
            </div>
          ))}
        </section>

        <section className="ip-pane">
          <h2 className="ip-pane__title">AI-drafted answers</h2>
          {Object.entries(role.questions).map(([qid, q]) => (
            <QuestionCard
              key={qid}
              role={role}
              questionId={qid}
              question={q}
              onUpdate={setRole}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

function QuestionCard({
  role,
  questionId,
  question,
  onUpdate,
}: {
  role: Role;
  questionId: string;
  question: Role["questions"][string];
  onUpdate: (r: Role) => void;
}) {
  const [extra, setExtra] = useState(question.extraDetails);
  const [queuing, setQueuing] = useState(false);
  const [err, setErr] = useState("");

  async function queue() {
    setQueuing(true);
    setErr("");
    try {
      const fresh = await api.queueRegen(role.slug, questionId, extra);
      onUpdate(fresh);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setQueuing(false);
    }
  }

  const prompt = question.prompt.replace(/\[company\]/g, role.company || "[company]");

  return (
    <div className="ip-q">
      <div className="ip-q__prompt">
        {prompt}
        {question.pendingRegen && <span className="ip-flag ip-flag--queued">Queued</span>}
      </div>
      <div className="ip-q__response">
        {question.response ? (
          question.response.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="ip-muted">No draft yet. Add details below and click Generate.</p>
        )}
      </div>
      <details className="ip-q__details">
        <summary>Add details / generate</summary>
        <textarea
          rows={5}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="What should the answer pull from? Specific projects, motivations, things you want to say or avoid."
        />
        <div className="ip-q__actions">
          <button
            className="ip-btn ip-btn--primary"
            onClick={queue}
            disabled={queuing || question.pendingRegen}
          >
            {question.pendingRegen
              ? "Queued for Claude Code"
              : queuing
                ? "Queueing…"
                : question.response
                  ? "Regenerate"
                  : "Generate"}
          </button>
        </div>
        {err && <div className="ip-error">{err}</div>}
        <p className="ip-q__hint">
          Queues this for Claude Code. Run <code>/prep</code> in a session to process the queue
          (drafts + hiring-manager pass).
        </p>
      </details>
    </div>
  );
}
