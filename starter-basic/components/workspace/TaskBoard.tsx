"use client";

import {useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent} from "react";
import {useTranslations} from "next-intl";

import {
  createTask,
  exportTasks,
  importTasks,
  readTasks,
  selectTasks,
  STORAGE_KEY,
  MAX_TASKS,
  type Task,
  type TaskFilter,
  type TaskPriority,
  type TaskSort,
} from "@/lib/tasks";

const priorities: TaskPriority[] = ["normal", "high", "low"];
const filterChoices: TaskFilter[] = ["all", "active", "completed"];
const sortChoices: TaskSort[] = ["newest", "oldest", "priority"];

export default function TaskBoard() {
  const t = useTranslations("Workspace");
  const fileInput = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [storageEnabled, setStorageEnabled] = useState(true);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [sort, setSort] = useState<TaskSort>("newest");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const defaults = [t("exampleFirst"), t("exampleSecond"), t("exampleThird")];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = readTasks(raw);
      // Don't overwrite an unreadable backup. Keep the sample available in memory.
      if (raw !== null && stored === null) {
        setStorageEnabled(false);
        setMessage(t("invalidSavedData"));
      }
      setTasks(stored ?? defaults.map((item, index) =>
        createTask(item, index === 0 ? "high" : "normal")
      ));
    } catch {
      setStorageEnabled(false);
      setTasks(defaults.map((item) => createTask(item)));
    }
    setReady(true);
    // Only seed once. Switching locales must never reset a user's work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !storageEnabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      setStorageEnabled(false);
      setMessage(t("storageUnavailable"));
    }
  }, [ready, tasks, storageEnabled, t]);

  const completed = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const active = tasks.length - completed;
  const visibleTasks = useMemo(
    () => selectTasks(tasks, filter, search, sort),
    [tasks, filter, search, sort]
  );
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = title.trim();
    if (!clean || tasks.length >= MAX_TASKS) return;
    setTasks((current) => [createTask(clean, priority), ...current]);
    setTitle("");
    setPriority("normal");
    setFilter("all");
    setSearch("");
    setMessage(t("added"));
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) =>
      task.id === id ? {...task, completed: !task.completed} : task
    ));
  }

  function removeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setMessage(t("deleted"));
  }

  function saveEdit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const clean = editTitle.trim();
    if (!clean) return;
    setTasks((current) => current.map((task) =>
      task.id === id ? {...task, title: clean.slice(0, 120)} : task
    ));
    setEditingId(null);
    setMessage(t("updated"));
  }

  function setTaskPriority(id: string, next: TaskPriority) {
    setTasks((current) => current.map((task) =>
      task.id === id ? {...task, priority: next} : task
    ));
  }

  function clearCompleted() {
    if (!completed || !window.confirm(t("clearConfirm", {count: completed}))) return;
    setTasks((current) => current.filter((task) => !task.completed));
    setMessage(t("cleared"));
  }

  function downloadBackup() {
    const data = new Blob([exportTasks(tasks)], {type: "application/json"});
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "starter-workspace-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(t("exported"));
  }

  async function restoreBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 256 * 1024) {
      setMessage(t("invalidImport"));
      return;
    }
    try {
      const imported = importTasks(await file.text());
      if (!imported) {
        setMessage(t("invalidImport"));
        return;
      }
      if (!window.confirm(t("importConfirm", {count: imported.length}))) return;
      setTasks(imported);
      setStorageEnabled(true);
      setFilter("all");
      setSearch("");
      setEditingId(null);
      setMessage(t("imported", {count: imported.length}));
    } catch {
      setMessage(t("invalidImport"));
    }
  }

  const priorityLabel = (value: TaskPriority) =>
    t(value === "high" ? "priorityHigh" : value === "low" ? "priorityLow" : "priorityNormal");

  if (!ready) {
    return (
      <div className="surface min-h-72 animate-pulse p-8" role="status">
        <span className="sr-only">{t("loading")}</span>
        <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-white/10" />
        <div className="mt-8 h-16 rounded-xl bg-slate-100 dark:bg-white/5" />
        <div className="mt-4 h-16 rounded-xl bg-slate-100 dark:bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {label: t("total"), value: tasks.length, caption: t("totalHint")},
          {label: t("active"), value: active, caption: t("activeHint")},
          {label: t("completed"), value: completed, caption: t("completedHint")},
        ].map((stat) => (
          <div key={stat.label} className="surface p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{stat.value}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{stat.caption}</p>
          </div>
        ))}
      </div>

      <div className="surface overflow-hidden">
        <div className="border-b border-slate-200/80 p-5 sm:p-7 dark:border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t("boardTitle")}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {storageEnabled ? t("localNotice") : t("storageUnavailable")}
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">
              {t("progress", {progress})}
            </span>
          </div>
          <div role="progressbar" aria-label={t("progressLabel")} aria-valuemin={0}
            aria-valuemax={100} aria-valuenow={progress}
            className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-400"
              style={{width: progress + "%"}} />
          </div>

          <form className="mt-6 flex flex-wrap gap-3" onSubmit={addTask}>
            <label htmlFor="new-task" className="sr-only">{t("newTaskLabel")}</label>
            <input id="new-task" value={title} onChange={(event) => setTitle(event.target.value)}
              maxLength={120} placeholder={t("placeholder")} autoComplete="off"
              className="field min-w-48 flex-1" />
            <label htmlFor="new-priority" className="sr-only">{t("priorityLabel")}</label>
            <select id="new-priority" value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
              className="field min-w-32 cursor-pointer">
              {priorities.map((value) => <option key={value} value={value}>{priorityLabel(value)}</option>)}
            </select>
            <button type="submit" className="button-primary shrink-0" disabled={!title.trim() || tasks.length >= MAX_TASKS}>
              <span aria-hidden="true">＋</span> {t("add")}
            </button>
          </form>
          {tasks.length >= MAX_TASKS && <p className="mt-2 text-sm text-amber-600 dark:text-amber-300">{t("limitReached")}</p>}
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor="search-tasks" className="sr-only">{t("searchLabel")}</label>
              <input id="search-tasks" type="search" value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchPlaceholder")} className="field w-full" />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="task-sort" className="text-sm text-slate-500 dark:text-slate-400">{t("sortLabel")}</label>
              <select id="task-sort" value={sort}
                onChange={(event) => setSort(event.target.value as TaskSort)}
                className="field min-w-36 cursor-pointer">
                {sortChoices.map((value) => <option key={value} value={value}>{t(
                  value === "newest" ? "sortNewest" : value === "oldest" ? "sortOldest" : "sortPriority"
                )}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterLabel")}>
              {filterChoices.map((choice) => (
                <button key={choice} type="button" onClick={() => setFilter(choice)}
                  aria-pressed={filter === choice}
                  className={filter === choice
                    ? "rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                    : "rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"}>
                  {t(choice === "all" ? "filterAll" : choice === "active" ? "filterActive" : "filterCompleted")}
                </button>
              ))}
            </div>
            <button type="button" onClick={clearCompleted} disabled={completed === 0}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-rose-400/10">
              {t("clearCompleted")}
            </button>
          </div>

          {visibleTasks.length ? (
            <ul className="mt-5 divide-y divide-slate-100 dark:divide-white/10">
              {visibleTasks.map((task) => (
                <li key={task.id} className="flex min-w-0 flex-wrap items-center gap-3 py-4">
                  <input type="checkbox" checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={task.completed ? t("markActive", {title: task.title}) : t("markDone", {title: task.title})}
                    className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600" />
                  {editingId === task.id ? (
                    <form onSubmit={(event) => saveEdit(event, task.id)} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <label htmlFor={"edit-" + task.id} className="sr-only">{t("editTask", {title: task.title})}</label>
                      <input id={"edit-" + task.id} value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        onKeyDown={(event) => {if (event.key === "Escape") setEditingId(null);}}
                        maxLength={120} autoFocus className="field min-w-40 flex-1 py-2" />
                      <button type="submit" disabled={!editTitle.trim()}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">{t("save")}</button>
                      <button type="button" onClick={() => setEditingId(null)}
                        className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-300">{t("cancel")}</button>
                    </form>
                  ) : (
                    <>
                      <span dir="auto" className={task.completed
                        ? "min-w-0 flex-1 break-words text-sm text-slate-400 line-through dark:text-slate-500"
                        : "min-w-0 flex-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100"}>
                        {task.title}
                      </span>
                      <label className="sr-only" htmlFor={"priority-" + task.id}>{t("priorityFor", {title: task.title})}</label>
                      <select id={"priority-" + task.id} value={task.priority}
                        onChange={(event) => setTaskPriority(task.id, event.target.value as TaskPriority)}
                        className="max-w-36 cursor-pointer rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-xs font-semibold text-slate-500 dark:border-white/15 dark:text-slate-300">
                        {priorities.map((value) => <option key={value} value={value}>{priorityLabel(value)}</option>)}
                      </select>
                      <button type="button"
                        onClick={() => {setEditingId(task.id); setEditTitle(task.title);}}
                        aria-label={t("editTask", {title: task.title})}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-400/10">{t("edit")}</button>
                      <button type="button" onClick={() => removeTask(task.id)}
                        aria-label={t("remove", {title: task.title})}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-400/10">{t("delete")}</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-white/15">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl dark:bg-indigo-400/10" aria-hidden="true">✓</div>
              <p className="font-semibold">{t("emptyTitle")}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {search.trim() ? t("noSearchResults") : t("emptyHint")}
              </p>
              {search.trim() && <button type="button" onClick={() => setSearch("")}
                className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-300">{t("clearSearch")}</button>}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("showing", {count: visibleTasks.length, total: tasks.length})}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={downloadBackup}
                className="button-secondary px-4 py-2 text-xs">{t("exportData")}</button>
              <input ref={fileInput} type="file" accept=".json,application/json"
                onChange={restoreBackup} className="sr-only" tabIndex={-1} aria-label={t("importData")} />
              <button type="button" onClick={() => fileInput.current?.click()}
                className="button-secondary px-4 py-2 text-xs">{t("importData")}</button>
            </div>
          </div>
          <p role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-slate-500 dark:text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
