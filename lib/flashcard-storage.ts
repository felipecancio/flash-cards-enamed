import type { CardProgress, Rating } from "@/lib/flashcard-schedule";

export const STORAGE_KEY = "enamed-200-flashcards-v1";

export type StudySession = {
  kind: "review" | "theme";
  area: string;
  topic: string;
  ids: string[];
  rest: string[];
  index: number;
  revealed: boolean;
  done: boolean;
};

export type StoredProgress = {
  version: 1;
  states: Record<string, CardProgress>;
  session: StudySession | null;
};

function isRating(value: unknown): value is Rating {
  return value === "remembered" || value === "unsure" || value === "missed";
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function readState(value: unknown): CardProgress | null {
  if (!value || typeof value !== "object") return null;
  const state = value as Partial<CardProgress>;
  if (!isRating(state.rating) || !isDate(state.due) || typeof state.successes !== "number") return null;
  if (state.seen !== true) return null;
  return {
    rating: state.rating,
    due: state.due,
    successes: state.successes,
    seen: true,
    updatedAt: typeof state.updatedAt === "string" ? state.updatedAt : "",
  };
}

function readIdList(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((id) => typeof id === "string")) return null;
  return value;
}

function readSession(value: unknown): StudySession | null {
  if (!value || typeof value !== "object") return null;
  const session = value as Partial<StudySession>;
  if (session.kind !== "review" && session.kind !== "theme") return null;
  if (typeof session.area !== "string" || typeof session.topic !== "string") return null;
  const ids = readIdList(session.ids);
  const rest = readIdList(session.rest);
  if (!ids || ids.length === 0 || !rest) return null;
  if (typeof session.index !== "number" || session.index < 0 || session.index > ids.length - 1) return null;
  if (typeof session.revealed !== "boolean" || typeof session.done !== "boolean") return null;
  return {
    kind: session.kind,
    area: session.area,
    topic: session.topic,
    ids,
    rest,
    index: session.index,
    revealed: session.revealed,
    done: session.done,
  };
}

export function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    if (parsed.version !== 1 || !parsed.states || typeof parsed.states !== "object") return null;
    const states: Record<string, CardProgress> = {};
    for (const [id, value] of Object.entries(parsed.states)) {
      const state = readState(value);
      if (state) states[id] = state;
    }
    return { version: 1, states, session: readSession(parsed.session) };
  } catch {
    return null;
  }
}

export function saveProgress(progress: StoredProgress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export type ProgressSnapshot = {
  states: Record<string, CardProgress>;
  session: StudySession | null;
  ready: boolean;
};

const SERVER_SNAPSHOT: ProgressSnapshot = {
  states: {},
  session: null,
  ready: false,
};

let clientSnapshot: ProgressSnapshot | null = null;
const listeners = new Set<() => void>();

function publish(next: ProgressSnapshot) {
  clientSnapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProgressSnapshot(): ProgressSnapshot {
  if (!clientSnapshot) {
    const stored = loadProgress();
    clientSnapshot = {
      states: stored?.states ?? {},
      session: stored?.session ?? null,
      ready: true,
    };
  }
  return clientSnapshot;
}

export function getServerProgressSnapshot(): ProgressSnapshot {
  return SERVER_SNAPSHOT;
}

export function commitProgress(states: Record<string, CardProgress>, session: StudySession | null): boolean {
  const saved = saveProgress({ version: 1, states, session });
  publish({ states, session, ready: true });
  return saved;
}

export function wipeProgress(): boolean {
  const cleared = clearProgress();
  if (cleared) publish({ states: {}, session: null, ready: true });
  return cleared;
}
