import { useSyncExternalStore } from "react";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  period: "weekly" | "monthly";
  progress: number; // 0-100
  createdAt: string;
}

const KEY = "taskora-goals-v1";

function read(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Goal[];
  } catch { return []; }
}

function seed(): Goal[] {
  const initial: Goal[] = [
    { id: crypto.randomUUID(), title: "Complete 5 study sessions", period: "weekly", progress: 60, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), title: "Ship 3 features", period: "weekly", progress: 33, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), title: "Master all 12 English tenses", period: "monthly", progress: 45, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), title: "Read 4 books", period: "monthly", progress: 25, createdAt: new Date().toISOString() },
  ];
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

let cache: Goal[] = read();
const listeners = new Set<() => void>();
function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export const goalsStore = {
  getAll: () => cache,
  add: (g: Omit<Goal, "id" | "createdAt">) => {
    cache = [{ ...g, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...cache];
    emit();
  },
  update: (id: string, patch: Partial<Goal>) => {
    cache = cache.map((g) => (g.id === id ? { ...g, ...patch } : g));
    emit();
  },
  remove: (id: string) => {
    cache = cache.filter((g) => g.id !== id);
    emit();
  },
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
};

export function useGoals(period?: "weekly" | "monthly"): Goal[] {
  const all = useSyncExternalStore(
    (cb) => { const u = goalsStore.subscribe(cb); return () => { u; }; },
    () => goalsStore.getAll(),
    () => cache
  );
  return period ? all.filter((g) => g.period === period) : all;
}
