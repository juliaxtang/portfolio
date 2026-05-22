// Tiny client for the interview-prep side-car (port 4322).
const BASE = "http://localhost:4322/api";

export type Status =
  | "saved"
  | "applied"
  | "initial-screen"
  | "hiring-manager"
  | "panel"
  | "offer"
  | "rejected";

export interface RoleQuestion {
  prompt: string;
  response: string;
  extraDetails: string;
  pendingRegen: boolean;
  updatedAt: string;
}

export interface Role {
  slug: string;
  title: string;
  company: string;
  companyUrl: string;
  jdUrl: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  jdSummary: string;
  companyContext: string;
  pendingContext: boolean;
  notes: {
    recruiter: string;
    hiringManager: string;
    panel: string;
    offer: string;
  };
  questions: Record<string, RoleQuestion>;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  return res.json();
}

export const api = {
  list: () => req<Role[]>("/roles"),
  get: (slug: string) => req<Role>(`/roles/${slug}`),
  create: (input: Partial<Role>) =>
    req<Role>("/roles", { method: "POST", body: JSON.stringify(input) }),
  patch: (slug: string, patch: Partial<Role>) =>
    req<Role>(`/roles/${slug}`, { method: "PATCH", body: JSON.stringify(patch) }),
  remove: (slug: string) =>
    req<{ ok: boolean }>(`/roles/${slug}`, { method: "DELETE" }),
  queueContext: (slug: string) =>
    req<Role>(`/roles/${slug}/queue-context`, { method: "POST" }),
  queueRegen: (slug: string, questionId: string, extraDetails: string) =>
    req<Role>(`/roles/${slug}/queue-regen`, {
      method: "POST",
      body: JSON.stringify({ questionId, extraDetails }),
    }),
  syncStatus: () => req<SyncStatus>("/sync"),
  syncNow: () =>
    req<SyncStatus>("/sync", { method: "POST" }),
};

export interface SyncStatus {
  lastSyncAt: string | null;
  lastError: string | null;
  inProgress?: boolean;
  pendingChanges: boolean;
  debounced?: boolean;
}

// Stage-based follow-up cadence (days).
const CADENCE: Record<Status, number | null> = {
  saved: null,
  applied: 7,
  "initial-screen": 5,
  "hiring-manager": 5,
  panel: 7,
  offer: 3,
  rejected: null,
};

export function followUpDue(role: Role): { due: boolean; days: number; threshold: number | null } {
  const threshold = CADENCE[role.status];
  if (threshold == null) return { due: false, days: 0, threshold: null };
  const last = new Date(role.updatedAt).getTime();
  const days = Math.floor((Date.now() - last) / 86_400_000);
  return { due: days >= threshold, days, threshold };
}

export function pendingCount(role: Role): number {
  let n = 0;
  if (role.pendingContext) n++;
  for (const q of Object.values(role.questions)) if (q.pendingRegen) n++;
  return n;
}

export const STATUSES: { value: Status; label: string }[] = [
  { value: "offer", label: "Offer" },
  { value: "panel", label: "Panel interview" },
  { value: "hiring-manager", label: "Hiring manager call" },
  { value: "initial-screen", label: "Initial screen" },
  { value: "applied", label: "Applied" },
  { value: "saved", label: "Saved" },
  { value: "rejected", label: "Rejected / archived" },
];

// Sort rank: lower = further along in the funnel, archived last.
export const STATUS_ORDER: Record<Status, number> = {
  offer: 1,
  panel: 2,
  "hiring-manager": 3,
  "initial-screen": 4,
  applied: 5,
  saved: 6,
  rejected: 7,
};
