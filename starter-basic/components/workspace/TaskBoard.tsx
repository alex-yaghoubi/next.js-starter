"use client";

import {useEffect, useMemo, useState, type FormEvent} from "react";
import {useTranslations} from "next-intl";

import {
  createTask,
  filterTasks,
  readTasks,
  STORAGE_KEY,
  type Task,
  type TaskFilter,
} from "@/lib/tasks";

export default function TaskBoard() {
  const t = useTranslations("Workspace");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [storageEnabled, setStorageEnabled] = useState(true);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");

  useEffect(() => {
    const defaults = [t("exampleFirst"), t("exampleSecond"), t("exampleThird")];
    try {
      const stored = readTasks(localStorage.getItem(STORAGE_KEY));
      setTasks(stored ?? defaults.map(createTask));
    } catch {
      setStorageEnabled(false);
      setTasks(defaults.map(createTask));
    }
    setReady(true);
    // Seed demo data once; switching languages must not overwrite user data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !storageEnabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      setStorageEnabled(false);
    }
  }, [ready, tasks, storageEnabled]);

  const completed = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const active = tasks.length - completed;
  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = title.trim();
    if (!clean || tasks.length >= 100) return;
    setTasks((current) => [createTask(clean), ...current]);
    setTitle("");
    setFilter("all");
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (
      task.id === id ? {...task, completed: !task.completed} : task
    )));
  }

  function removeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

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
          <div className="flex flex-wrap items-center justify-between gap-3">
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
          <div
            role="progressbar"
            aria-label={t("progressLabel")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
          >
            <div className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-400" style={{width: progress + "%"}} />
          </div>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={addTask}>
            <label htmlFor="new-task" className="sr-only">{t("newTaskLabel")}</label>
            <input
              id="new-task"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder={t("placeholder")}
              className="field min-w-0 flex-1"
              autoComplete="off"
            />
            <button type="submit" className="button-primary shrink-0" disabled={!title.trim() || tasks.length >= 100}>
              <span aria-hidden="true">＋</span> {t("add")}
            </button>
          </form>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterLabel")}>
            {(["all", "active", "completed"] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setFilter(choice)}
                aria-pressed={filter === choice}
                className={filter === choice
                  ? "rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                  : "rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"}
              >
                {t(choice === "all" ? "filterAll" : choice === "active" ? "filterActive" : "filterCompleted")}
              </button>
            ))}
          </div>

          {visibleTasks.length ? (
            <ul className="mt-5 divide-y divide-slate-100 dark:divide-white/10">
              {visibleTasks.map((task) => (
                <li key={task.id} className="group flex min-w-0 items-center gap-3 py-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={task.completed ? t("markActive", {title: task.title}) : t("markDone", {title: task.title})}
                    className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                  />
                  <span dir="auto" className={task.completed
                    ? "min-w-0 flex-1 break-words text-sm text-slate-400 line-through dark:text-slate-500"
                    : "min-w-0 flex-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100"}>
                    {task.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    aria-label={t("remove", {title: task.title})}
                    className="rounded-lg border border-transparent px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:border-rose-400/30 dark:hover:bg-rose-400/10 dark:hover:text-rose-200"
                  >
                    {t("delete")}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-white/15">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl dark:bg-indigo-400/10" aria-hidden="true">✓</div>
              <p className="font-semibold">{t("emptyTitle")}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("emptyHint")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
