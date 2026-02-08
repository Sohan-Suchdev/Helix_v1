// services/localdata.ts
// Safe localStorage helpers for the Helix demo layer (client-only)

export type DemoProposalMeta = {
  id: number;
  title: string;
  auditUrl: string;
  researcherNumber: string; // demo identity
  creator: string;          // creator wallet
  createdAt: number;        // ms timestamp
};

const KEYS = {
  proposals: "helix:demo:proposals",
  myResearcherNumber: "helix:demo:myResearcherNumber",
} as const;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJSON<T>(key: string, fallback: T): T {
  const s = storage();
  if (!s) return fallback;
  try {
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

/* ------------------ Proposals meta (demo) ------------------ */

export function getAllProposalMeta(): DemoProposalMeta[] {
  return readJSON<DemoProposalMeta[]>(KEYS.proposals, []);
}

export function getProposalMeta(id: number): DemoProposalMeta | undefined {
  return getAllProposalMeta().find(p => p.id === id);
}

export function addProposalMeta(meta: DemoProposalMeta) {
  const all = getAllProposalMeta();
  const i = all.findIndex(p => p.id === meta.id);
  if (i >= 0) all[i] = meta;
  else all.push(meta);
  writeJSON(KEYS.proposals, all);
}

export function removeProposalMeta(id: number) {
  const all = getAllProposalMeta().filter(p => p.id !== id);
  writeJSON(KEYS.proposals, all);
}

export function clearAllProposalMeta() {
  writeJSON(KEYS.proposals, []);
}

/* --------------- My researcher number (demo) --------------- */

export function setMyResearcherNumber(n: string) {
  const s = storage();
  if (!s) return;
  s.setItem(KEYS.myResearcherNumber, n);
}

export function getMyResearcherNumber(): string | null {
  const s = storage();
  if (!s) return null;
  return s.getItem(KEYS.myResearcherNumber);
}

/* --------------- Insider helper (UI-only) ------------------ */

export function isInsiderUI(opts: {
  myAddress?: string | null;
  onchainResearcher?: string | null;
  proposalId?: number | null;
}): boolean {
  const { myAddress, onchainResearcher, proposalId } = opts;
  const byAddress =
    !!myAddress &&
    !!onchainResearcher &&
    myAddress.toLowerCase() === onchainResearcher.toLowerCase();

  const myNum = getMyResearcherNumber();
  const meta = proposalId != null ? getProposalMeta(proposalId) : undefined;
  const byNumber = !!myNum && !!meta?.researcherNumber && myNum === meta.researcherNumber;

  return byAddress || byNumber;
}