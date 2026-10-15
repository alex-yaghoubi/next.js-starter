export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export type TaskFilter = "all" | "active" | "completed";

export const STORAGE_KEY = "starter-workspace-tasks:v1";

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Task>;
  return typeof item.id === "string" && item.id.length > 0 &&
    typeof item.title === "string" && item.title.length > 0 && item.title.length <= 120 &&
    typeof item.completed === "boolean" &&
    typeof item.createdAt === "number" && Number.isFinite(item.createdAt);
}

export function readTasks(raw: string | null): Task[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isTask)) return null;
    return parsed.slice(0, 100);
  } catch {
    return null;
  }
}

export function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title: title.trim().slice(0, 120),
    completed: false,
    createdAt: Date.now(),
  };
}

export function filterTasks(items: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return items.filter((item) => !item.completed);
  if (filter === "completed") return items.filter((item) => item.completed);
  return items;
}
