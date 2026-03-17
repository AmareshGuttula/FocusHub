"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Circle,
  Flag,
  Tag,
  GripVertical,
  Pencil,
  X,
  Check,
  AlertTriangle,
  MoreHorizontal,
  ListChecks,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { RewardPopup } from "@/components/RewardPopup";
import { ProgressBar } from "@/components/ProgressBar";

/* ─── Types ─── */

interface Subtask {
  id: number;
  text: string;
  done: boolean;
}

interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  deadline: string;
  description: string;
  subtasks: Subtask[];
  createdAt: string;
}

/* ─── Constants ─── */

const priorities: Task["priority"][] = ["high", "medium", "low"];
const priorityConfig = {
  high: { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  low: { label: "Low", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
};
const categories = ["All", "Study", "Project", "Personal", "Homework", "Exam Prep"];
const categoryColors: Record<string, string> = {
  Study: "#4f46e5",
  Project: "#8b5cf6",
  Personal: "#06b6d4",
  Homework: "#f59e0b",
  "Exam Prep": "#ef4444",
};

const feedbackTexts = [
  "Great job!",
  "You're building discipline",
  "Keep going 🔥",
  "Don't break the streak",
  "Awesome work!",
  "One step closer to your goals!",
  "Nailed it!",
  "Focus mode: ON",
];

const today = new Date();
today.setHours(0, 0, 0, 0);
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };

const initialTasks: Task[] = [
  { id: 1, text: "Finish math homework", done: false, priority: "high", category: "Homework", deadline: addDays(1), description: "Complete exercises 5.1–5.4 from the textbook", subtasks: [{ id: 1, text: "Exercise 5.1", done: true }, { id: 2, text: "Exercise 5.2", done: true }, { id: 3, text: "Exercise 5.3", done: false }, { id: 4, text: "Exercise 5.4", done: false }], createdAt: addDays(-2) },
  { id: 2, text: "Revise biology chapter 8", done: false, priority: "medium", category: "Study", deadline: addDays(3), description: "Focus on cell division and mitosis stages", subtasks: [{ id: 1, text: "Read chapter", done: true }, { id: 2, text: "Make notes", done: false }], createdAt: addDays(-1) },
  { id: 3, text: "Watch physics lecture", done: false, priority: "low", category: "Study", deadline: addDays(5), description: "", subtasks: [], createdAt: addDays(-1) },
  { id: 4, text: "Submit group project report", done: false, priority: "high", category: "Project", deadline: addDays(0), description: "Final review and submit the PDF", subtasks: [{ id: 1, text: "Write conclusion", done: true }, { id: 2, text: "Proofread", done: false }, { id: 3, text: "Format PDF", done: false }], createdAt: addDays(-5) },
  { id: 5, text: "Practice coding problems", done: true, priority: "medium", category: "Personal", deadline: addDays(-1), description: "LeetCode daily challenge", subtasks: [], createdAt: addDays(-3) },
  { id: 6, text: "Prepare chemistry flash cards", done: false, priority: "medium", category: "Exam Prep", deadline: addDays(7), description: "Organic chemistry reactions", subtasks: [], createdAt: addDays(-2) },
];

/* ─── Helpers ─── */

function daysUntil(dateStr: string) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(dateStr: string) {
  const days = daysUntil(dateStr);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Main Component ─── */

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState<Task["priority"] | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "name">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newCategory, setNewCategory] = useState("Study");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { completeTask } = useUser();
  const [rewardMsg, setRewardMsg] = useState("");
  const [showReward, setShowReward] = useState(false);
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  // Drag
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  /* ── CRUD ── */

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks((prev) => [
      { id: Date.now(), text: newText.trim(), done: false, priority: newPriority, category: newCategory, deadline: newDeadline, description: newDesc, subtasks: [], createdAt: fmt(today) },
      ...prev,
    ]);
    setNewText(""); setNewDesc(""); setNewDeadline(""); setShowAdd(false);
  };

  const toggle = (id: number) => {
    const t = tasks.find((x) => x.id === id);
    if (t && !t.done) {
      completeTask();
      setRewardMsg(feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)]);
      setShowReward(true);
      setAnimatingId(id);
      setTimeout(() => setAnimatingId(null), 1000); // clear animation class
    }
    setTasks((prev) => prev.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  };

  const remove = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const saveEdit = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, text: editText.trim() || t.text } : t));
    setEditingId(null);
  };

  const toggleSubtask = (taskId: number, subId: number) =>
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => s.id === subId ? { ...s, done: !s.done } : s) } : t
    ));

  const addSubtask = (taskId: number, text: string) => {
    if (!text.trim()) return;
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: Date.now(), text: text.trim(), done: false }] } : t
    ));
  };

  const removeSubtask = (taskId: number, subId: number) =>
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t
    ));

  const clearCompleted = () => setTasks((prev) => prev.filter((t) => !t.done));

  /* ── Drag ── */

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const items = [...tasks];
    const [moved] = items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, moved);
    setTasks(items);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  /* ── Filter & Sort ── */

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  let filtered = tasks
    .filter((t) => filterCategory === "All" || t.category === filterCategory)
    .filter((t) => filterPriority === "all" || t.priority === filterPriority)
    .filter((t) => filterStatus === "all" || (filterStatus === "active" ? !t.done : t.done))
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sortBy === "name") return a.text.localeCompare(b.text);
    return new Date(a.deadline || "2099-12-31").getTime() - new Date(b.deadline || "2099-12-31").getTime();
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#111827] dark:text-slate-200 transition-colors duration-300">Today's Progress</span>
            <span className="text-xs font-medium text-[#6b7280] dark:text-slate-400">{completed}/{total} completed</span>
          </div>
          <ProgressBar value={progress} color="primary" size="md" />
        </div>
        {completed > 0 && (
          <button onClick={clearCompleted} className="text-xs text-[#9ca3af] dark:text-slate-500 hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors whitespace-nowrap">
            Clear completed
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af] dark:text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-8 pr-3 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors duration-300"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
            showFilters ? "border-[#4f46e5]/30 bg-[#4f46e5]/[0.08] dark:bg-[#4f46e5]/20 text-[#4f46e5] dark:text-indigo-400" : "border-[#e5e7eb] dark:border-slate-700 text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#4f46e5] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft space-y-3 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111827] dark:text-slate-200">Filters</span>
            <button onClick={() => { setFilterCategory("All"); setFilterPriority("all"); setFilterStatus("all"); }} className="text-[10px] text-[#9ca3af] dark:text-slate-500 hover:text-[#4f46e5] dark:hover:text-indigo-400">Reset</button>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Status */}
            <div>
              <p className="text-[10px] font-medium text-[#9ca3af] dark:text-slate-500 mb-1 uppercase tracking-wider">Status</p>
              <div className="flex gap-1">
                {(["all", "active", "completed"] as const).map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${filterStatus === s ? "bg-[#111827] dark:bg-slate-800 text-white" : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* Priority */}
            <div>
              <p className="text-[10px] font-medium text-[#9ca3af] dark:text-slate-500 mb-1 uppercase tracking-wider">Priority</p>
              <div className="flex gap-1">
                <button onClick={() => setFilterPriority("all")} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${filterPriority === "all" ? "bg-[#111827] dark:bg-slate-800 text-white" : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"}`}>All</button>
                {priorities.map((p) => (
                  <button key={p} onClick={() => setFilterPriority(p)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${filterPriority === p ? "text-white" : "hover:bg-[#f7f7f8] dark:hover:bg-slate-800"}`} style={filterPriority === p ? { backgroundColor: priorityConfig[p].color } : { color: priorityConfig[p].color }}>
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>
            {/* Category */}
            <div>
              <p className="text-[10px] font-medium text-[#9ca3af] dark:text-slate-500 mb-1 uppercase tracking-wider">Category</p>
              <div className="flex flex-wrap gap-1">
                {categories.map((c) => (
                  <button key={c} onClick={() => setFilterCategory(c)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${filterCategory === c ? "bg-[#111827] dark:bg-slate-800 text-white" : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {/* Sort */}
            <div>
              <p className="text-[10px] font-medium text-[#9ca3af] dark:text-slate-500 mb-1 uppercase tracking-wider">Sort By</p>
              <div className="flex gap-1">
                {([["date", "Due Date"], ["priority", "Priority"], ["name", "Name"]] as const).map(([key, label]) => (
                  <button key={key} onClick={() => setSortBy(key)} className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${sortBy === key ? "bg-[#111827] dark:bg-slate-800 text-white" : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"}`}>
                    <ArrowUpDown className="h-3 w-3" />{label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add task form */}
      {showAdd && (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft space-y-3 transition-colors duration-300">
          <input value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Task name..." className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#111827] dark:text-white placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20" autoFocus />
          <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)..." rows={2} className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3.5 py-2 text-sm text-[#111827] dark:text-white placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none resize-none focus:border-[#4f46e5] focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20" />
          <div className="flex gap-2 flex-wrap">
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Task["priority"])} className="rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#6b7280] dark:text-slate-300 outline-none focus:border-[#4f46e5]">
              {priorities.map((p) => (<option key={p} value={p}>{priorityConfig[p].label} Priority</option>))}
            </select>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#6b7280] dark:text-slate-300 outline-none focus:border-[#4f46e5]">
              {categories.filter((c) => c !== "All").map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#6b7280] dark:text-slate-300 outline-none focus:border-[#4f46e5]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 rounded-lg border border-[#e5e7eb] dark:border-slate-700 py-2 text-sm font-medium text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button onClick={addTask} className="flex-1 rounded-lg bg-[#4f46e5] py-2 text-sm font-medium text-white hover:bg-[#4338ca] transition-colors">Add Task</button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft overflow-hidden transition-colors duration-300">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <ListChecks className="mx-auto h-8 w-8 text-[#d1d5db] dark:text-slate-600" />
            <p className="mt-3 text-sm text-[#9ca3af] dark:text-slate-500">{search || filterCategory !== "All" || filterPriority !== "all" || filterStatus !== "all" ? "No tasks match your filters" : "No tasks yet"}</p>
          </div>
        ) : (
          <ul>
            {filtered.map((task, idx) => {
              const isExpanded = expandedId === task.id;
              const isEditing = editingId === task.id;
              const dl = task.deadline ? daysUntil(task.deadline) : Infinity;
              const isOverdue = dl < 0 && !task.done;
              const isDueToday = dl === 0 && !task.done;
              const subtasksDone = task.subtasks.filter((s) => s.done).length;
              const catColor = categoryColors[task.category] || "#6b7280";
              const isAnimating = animatingId === task.id;

              return (
                <li key={task.id} className={`border-b border-[#f3f4f6] dark:border-slate-800 last:border-b-0 transition-transform duration-300 ${isAnimating ? "scale-[1.02] z-10 shadow-sm relative bg-emerald-50 dark:bg-emerald-900/20" : ""}`}>
                  {/* Main row */}
                  <div
                    draggable
                    onDragStart={() => { dragItem.current = idx; }}
                    onDragEnter={() => { dragOverItem.current = idx; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className={`group flex items-center gap-2.5 px-4 py-3 transition-colors cursor-grab active:cursor-grabbing ${isAnimating ? "" : "hover:bg-[#fafafa] dark:hover:bg-slate-800"}`}
                  >
                    <GripVertical className="h-3.5 w-3.5 flex-shrink-0 text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Checkbox */}
                    <button onClick={() => toggle(task.id)} className="flex-shrink-0">
                      {task.done ? (
                        <CheckCircle2 className="h-[18px] w-[18px] text-[#4f46e5]" />
                      ) : (
                        <Circle className={`h-[18px] w-[18px] ${isOverdue ? "text-[#ef4444]" : "text-[#d1d5db] dark:text-slate-600"} hover:text-[#4f46e5] transition-colors`} />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0" onClick={() => setExpandedId(isExpanded ? null : task.id)}>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)} className="flex-1 rounded border border-[#4f46e5] bg-transparent text-[#111827] dark:text-slate-200 px-2 py-0.5 text-sm outline-none" autoFocus />
                          <button onClick={() => saveEdit(task.id)} className="text-[#10b981]"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setEditingId(null)} className="text-[#9ca3af] dark:text-slate-500"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <p className={`text-sm font-medium cursor-pointer ${task.done ? "text-[#9ca3af] dark:text-slate-500 line-through" : "text-[#111827] dark:text-slate-200"}`}>
                          {task.text}
                        </p>
                      )}
                      {/* Meta row */}
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {/* Priority */}
                        <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: priorityConfig[task.priority].color }}>
                          <Flag className="h-2.5 w-2.5" />{priorityConfig[task.priority].label}
                        </span>
                        {/* Category */}
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ color: catColor, backgroundColor: `${catColor}14` }}>
                          {task.category}
                        </span>
                        {/* Deadline */}
                        {task.deadline && (
                          <span className={`flex items-center gap-0.5 text-[10px] ${isOverdue ? "text-[#ef4444] font-semibold" : isDueToday ? "text-[#f59e0b] font-semibold" : "text-[#9ca3af]"}`}>
                            {isOverdue && <AlertTriangle className="h-2.5 w-2.5" />}
                            <Calendar className="h-2.5 w-2.5" />
                            {formatDeadline(task.deadline)}
                          </span>
                        )}
                        {/* Subtasks count */}
                        {task.subtasks.length > 0 && (
                          <span className="text-[10px] text-[#9ca3af]">
                            {subtasksDone}/{task.subtasks.length} subtasks
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand arrow */}
                    <button onClick={() => setExpandedId(isExpanded ? null : task.id)} className="text-[#d1d5db] dark:text-slate-500 flex-shrink-0 transition-colors hover:text-[#6b7280] dark:hover:text-slate-300">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {/* Actions */}
                    <button onClick={() => { setEditingId(task.id); setEditText(task.text); }} className="text-[#d1d5db] dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:text-[#4f46e5] flex-shrink-0">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(task.id)} className="text-[#d1d5db] dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:text-[#ef4444] flex-shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <ExpandedPanel
                      task={task}
                      onToggleSubtask={(subId) => toggleSubtask(task.id, subId)}
                      onAddSubtask={(text) => addSubtask(task.id, text)}
                      onRemoveSubtask={(subId) => removeSubtask(task.id, subId)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── Expanded Panel ─── */

function ExpandedPanel({ task, onToggleSubtask, onAddSubtask, onRemoveSubtask }: {
  task: Task;
  onToggleSubtask: (subId: number) => void;
  onAddSubtask: (text: string) => void;
  onRemoveSubtask: (subId: number) => void;
}) {
  const [newSub, setNewSub] = useState("");
  const subtasksDone = task.subtasks.filter((s) => s.done).length;
  const subtaskProgress = task.subtasks.length > 0 ? Math.round((subtasksDone / task.subtasks.length) * 100) : 0;

  return (
    <div className="border-t border-[#f3f4f6] dark:border-slate-800 bg-[#fafafa] dark:bg-slate-800/50 px-4 py-3 pl-14 space-y-3 transition-colors duration-300">
      {/* Description */}
      {task.description && (
        <p className="text-xs text-[#6b7280] dark:text-slate-400 leading-relaxed">{task.description}</p>
      )}

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-slate-500">Subtasks</span>
            <span className="text-[10px] text-[#9ca3af] dark:text-slate-500">{subtaskProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#e5e7eb] dark:bg-slate-700 mb-2 overflow-hidden">
            <div className="h-full rounded-full bg-[#4f46e5] transition-all duration-300" style={{ width: `${subtaskProgress}%` }} />
          </div>
          <ul className="space-y-1">
            {task.subtasks.map((sub) => (
              <li key={sub.id} className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <button onClick={() => onToggleSubtask(sub.id)} className="flex-shrink-0">
                  {sub.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#4f46e5]" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-[#d1d5db] dark:text-slate-600 hover:text-[#4f46e5] transition-colors" />
                  )}
                </button>
                <span className={`flex-1 text-xs ${sub.done ? "text-[#9ca3af] dark:text-slate-500 line-through" : "text-[#111827] dark:text-slate-300"}`}>{sub.text}</span>
                <button onClick={() => onRemoveSubtask(sub.id)} className="text-[#d1d5db] dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-[#ef4444] transition-all">
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add subtask */}
      <div className="flex gap-2">
        <input
          value={newSub}
          onChange={(e) => setNewSub(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { onAddSubtask(newSub); setNewSub(""); } }}
          placeholder="Add subtask..."
          className="flex-1 rounded-md border border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
        />
        <button
          onClick={() => { onAddSubtask(newSub); setNewSub(""); }}
          className="rounded-md bg-[#4f46e5] px-2.5 py-1.5 text-[10px] font-medium text-white hover:bg-[#4338ca] transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
