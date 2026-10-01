import {
  parseStored,
  SIMULADO_STORAGE_KEY,
  type AttemptState,
  type Outcome,
  type StoredSimulado,
} from "@/lib/simulado";

export type SimuladoSnapshot = {
  outcomes: Record<string, Outcome>;
  attempt: AttemptState | null;
  ready: boolean;
};

const SERVER_SNAPSHOT: SimuladoSnapshot = {
  outcomes: {},
  attempt: null,
  ready: false,
};

let clientSnapshot: SimuladoSnapshot | null = null;
const listeners = new Set<() => void>();

function publish(next: SimuladoSnapshot) {
  clientSnapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeSimulado(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function loadSimulado(): StoredSimulado | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SIMULADO_STORAGE_KEY);
    if (!raw) return null;
    return parseStored(JSON.parse(raw));
  } catch {
    return null;
  }
}

function saveSimulado(stored: StoredSimulado): boolean {
  try {
    localStorage.setItem(SIMULADO_STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

export function getSimuladoSnapshot(): SimuladoSnapshot {
  if (!clientSnapshot) {
    const stored = loadSimulado();
    clientSnapshot = {
      outcomes: stored?.outcomes ?? {},
      attempt: stored?.attempt ?? null,
      ready: true,
    };
  }
  return clientSnapshot;
}

export function getServerSimuladoSnapshot(): SimuladoSnapshot {
  return SERVER_SNAPSHOT;
}

export function commitSimulado(outcomes: Record<string, Outcome>, attempt: AttemptState | null): boolean {
  const saved = saveSimulado({ version: 1, outcomes, attempt });
  publish({ outcomes, attempt, ready: true });
  return saved;
}

export function wipeSimulado(): boolean {
  try {
    localStorage.removeItem(SIMULADO_STORAGE_KEY);
    publish({ outcomes: {}, attempt: null, ready: true });
    return true;
  } catch {
    return false;
  }
}
