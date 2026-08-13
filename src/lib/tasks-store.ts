import { useSyncExternalStore } from "react";

export type Priority = "Low" | "Medium" | "High";
export type Status = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO yyyy-mm-dd
  dueTime?: string; // HH:mm
  priority: Priority;
  category?: string;
  notes?: string;
  status: Status;
  favorite?: boolean;
  archived?: boolean;
  createdAt: string; // ISO
}

const KEY = "taskora-tasks-v1";

function read(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function seed(): Task[] {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const initial: Task[] = [
    { id: crypto.randomUUID(), title: "Review weekly goals", priority: "High", status: "pending", dueDate: today, category: "Planning", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), title: "Practice Present Perfect tense", priority: "Medium", status: "pending", dueDate: tomorrow, category: "Learning", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), title: "Ship landing page", priority: "High", status: "completed", dueDate: yesterday, category: "Work", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), title: "Read 30 minutes", priority: "Low", status: "pending", dueDate: yesterday, category: "Learning", createdAt: new Date().toISOString() },
  ];
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

let cache: Task[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export const tasksStore = {
  getAll: () => cache,
  add: (t: Omit<Task, "id" | "createdAt" | "status"> & { status?: Status }) => {
    cache = [
      { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: t.status ?? "pending" },
      ...cache,
    ];
    emit();
  },
  update: (id: string, patch: Partial<Task>) => {
    cache = cache.map((t) => (t.id === id ? { ...t, ...patch } : t));
    emit();
  },
  toggle: (id: string) => {
    cache = cache.map((t) =>
      t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
    );
    emit();
  },
  remove: (id: string) => {
    cache = cache.filter((t) => t.id !== id);
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useTasks(): Task[] {
  return useSyncExternalStore(
    (cb) => {
      const unsub = tasksStore.subscribe(cb);
      return () => { unsub; };
    },
    () => tasksStore.getAll(),
    () => cache
  );
}

export function bucketOf(task: Task): "today" | "tomorrow" | "overdue" | "completed" | "pending" | "upcoming" {
  if (task.status === "completed") return "completed";
  if (!task.dueDate) return "pending";
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (task.dueDate < today) return "overdue";
  if (task.dueDate === today) return "today";
  if (task.dueDate === tomorrow) return "tomorrow";
  return "upcoming";
}
