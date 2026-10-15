export type TaskPriority = "low" | "normal" | "high";
export type TaskFilter = "all" | "active" | "completed";
export type TaskSort = "newest" | "oldest" | "priority";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority: TaskPriority;
};

export const STORAGE_KEY = "starter-workspace-tasks:v1";
export const MAX_TASKS = 100;

const priorityRank: Record<TaskPriority, number> = {
  high: 0,
  normal: 1,
  low: 2,
};

/** Accept saved tasks created by the original starter without a priority. */
export function isTask(value: unknown): value is Omit<Task, "priority"> & {priority?: TaskPriority} {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Task>;
  return typeof item.id === "string" && item.id.length > 0 &&
    typeof item.title === "string" && item.title.trim().length > 0 &&
    item.title.length <= 120 &&
    typeof item.completed === "boolean" &&
    typeof item.createdAt === "number" && Number.isFinite(item.createdAt) &&
    (item.priority === undefined || item.priority in priorityRank);
}

function normalizeTasks(value: unknown): Task[] | null {
  if (!Array.isArray(value) || value.length > MAX_TASKS || !value.every(isTask)) return null;
  const ids = new Set(value.map((task: Task) => task.id));
  if (ids.size !== value.length) return null;
  return value.map((task: Task) => ({...task, priority: task.priority ?? "normal"}));
}

export function readTasks(raw: string | null): Task[] | null {
  if (raw === null) return null;
  try {
    return normalizeTasks(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function createTask(title: string, priority: TaskPriority = "normal"): Task {
  return {
    id: crypto.randomUUID(),
    title: title.trim().slice(0, 120),
    completed: false,
    createdAt: Date.now(),
    priority,
  };
}

export function filterTasks(items: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return items.filter((item) => !item.completed);
  if (filter === "completed") return items.filter((item) => item.completed);
  return items;
}

export function selectTasks(
  items: Task[],
  filter: TaskFilter,
  search: string,
  sort: TaskSort
): Task[] {
  const term = search.trim().toLocaleLowerCase();
  const filtered = filterTasks(items, filter).filter((task) =>
    task.title.toLocaleLowerCase().includes(term)
  );

  return filtered.sort((a, b) => {
    if (sort === "priority") {
      const rank = priorityRank[a.priority] - priorityRank[b.priority];
      if (rank !== 0) return rank;
    }
    const byDate = sort === "oldest" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
    return byDate || a.id.localeCompare(b.id);
  });
}

export function exportTasks(items: Task[]): string {
  return JSON.stringify({format: "starter-tasks", version: 1, tasks: items}, null, 2);
}

export function importTasks(raw: string): Task[] | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const backup = data as {format?: unknown; version?: unknown; tasks?: unknown};
    if (backup.format !== "starter-tasks" || backup.version !== 1) return null;
    return normalizeTasks(backup.tasks);
  } catch {
    return null;
  }
}
