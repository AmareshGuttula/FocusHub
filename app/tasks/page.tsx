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
import { KanbanBoard, KanbanColumn } from "@/components/ui/trello-kanban-board";

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
  status: "todo" | "done";
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

const statusConfig = {
  todo: { label: "To Do", color: "#6b7280" },
  done: { label: "Done", color: "#10b981" },
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
  { id: 1, text: "Finish math homework", done: false, status: "todo", priority: "high", category: "Homework", deadline: addDays(1), description: "Complete exercises 5.1–5.4 from the textbook", subtasks: [{ id: 1, text: "Exercise 5.1", done: true }, { id: 2, text: "Exercise 5.2", done: true }, { id: 3, text: "Exercise 5.3", done: false }, { id: 4, text: "Exercise 5.4", done: false }], createdAt: addDays(-2) },
  { id: 2, text: "Revise biology chapter 8", done: false, status: "todo", priority: "medium", category: "Study", deadline: addDays(3), description: "Focus on cell division and mitosis stages", subtasks: [{ id: 1, text: "Read chapter", done: true }, { id: 2, text: "Make notes", done: false }], createdAt: addDays(-1) },
  { id: 3, text: "Watch physics lecture", done: false, status: "todo", priority: "low", category: "Study", deadline: addDays(5), description: "", subtasks: [], createdAt: addDays(-1) },
  { id: 4, text: "Submit group project report", done: false, status: "todo", priority: "high", category: "Project", deadline: addDays(0), description: "Final review and submit the PDF", subtasks: [{ id: 1, text: "Write conclusion", done: true }, { id: 2, text: "Proofread", done: false }, { id: 3, text: "Format PDF", done: false }], createdAt: addDays(-5) },
  { id: 5, text: "Practice coding problems", done: true, status: "done", priority: "medium", category: "Personal", deadline: addDays(-1), description: "LeetCode daily challenge", subtasks: [], createdAt: addDays(-3) },
  { id: 6, text: "Prepare chemistry flash cards", done: false, status: "todo", priority: "medium", category: "Exam Prep", deadline: addDays(7), description: "Organic chemistry reactions", subtasks: [], createdAt: addDays(-2) },
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

  const [newStatus, setNewStatus] = useState<Task["status"]>("todo");

  const { profile, completeTask, checkAction, incrementDailyTasksAdded, openPricingModal } = useUser();
  const [rewardMsg, setRewardMsg] = useState("");
  const [showReward, setShowReward] = useState(false);
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  /* ── CRUD ── */

  const handleQuickAdd = (status: "todo" | "done", title: string) => {
    checkAction(() => {
      if (!title.trim()) return;
      if (!incrementDailyTasksAdded()) return;

      const newTask: Task = {
        id: Date.now(),
        text: title.trim(),
        done: status === "done",
        status: status,
        priority: "medium",
        category: "Study",
        deadline: "",
        description: "",
        subtasks: [],
        createdAt: fmt(today)
      };

      setTasks((prev) => [newTask, ...prev]);
      
      if (status === "done") {
        completeTask();
        setRewardMsg(feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)]);
        setShowReward(true);
      }
    });
  };

  const addTask = () => {
    checkAction(() => {
      if (!newText.trim()) return;
      if (!incrementDailyTasksAdded()) return;

      setTasks((prev) => [
        { id: Date.now(), text: newText.trim(), done: newStatus === "done", status: newStatus, priority: newPriority, category: newCategory, deadline: newDeadline, description: newDesc, subtasks: [], createdAt: fmt(today) },
        ...prev,
      ]);
      setNewText(""); setNewDesc(""); setNewDeadline(""); setShowAdd(false);
      setNewStatus("todo"); // Reset after add
    });
  };

  const handleTaskMove = (taskId: number, targetStatus: "todo" | "done") => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        const isDone = targetStatus === "done";
        if (isDone && !t.done) {
          completeTask();
          setRewardMsg(feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)]);
          setShowReward(true);
        }
        return { ...t, status: targetStatus, done: isDone };
      }
      return t;
    }));
  };

  const toggle = (id: number) => {
    checkAction(() => {
      const t = tasks.find((x) => x.id === id);
      if (t && !t.done) {
        completeTask();
        setRewardMsg(feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)]);
        setShowReward(true);
        setAnimatingId(id);
        setTimeout(() => setAnimatingId(null), 1000); // clear animation class
      }
      setTasks((prev) => prev.map((x) => {
          if (x.id === id) {
              const newDone = !x.done;
              return { ...x, done: newDone, status: newDone ? "done" : "todo" };
          }
          return x;
      }));
    });
  };

  const remove = (id: number) => {
    checkAction(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
  };

  const saveEdit = (id: number) => {
    checkAction(() => {
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, text: editText.trim() || t.text } : t));
      setEditingId(null);
    });
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
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8 space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between px-1">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Tasks</h1>
            <div className="px-2 py-0.5 rounded-full bg-[#4f46e5]/10 text-[#4f46e5] text-[10px] font-bold uppercase tracking-wider">
               {completed}/{total} Done
            </div>
          </div>
          <div className="w-full max-w-md">
            <ProgressBar value={progress} color="primary" size="sm" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            {completed > 0 && (
                <button onClick={clearCompleted} className="text-xs font-medium text-[#9ca3af] hover:text-[#ef4444] transition-colors">
                    Clear Completed
                </button>
            )}
            <button
                onClick={() => { setNewStatus("todo"); setShowAdd(true); }}
                className="flex items-center gap-2 rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-[#4338ca] transition-all active:scale-95"
            >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
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

      {/* Simple Add Task Form */}
      {showAdd && (
        <div className="rounded-2xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4 items-start">
             <div className="flex-1 space-y-4">
                <input 
                    value={newText} 
                    onChange={(e) => setNewText(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && addTask()} 
                    placeholder="What needs to be done?" 
                    className="w-full bg-transparent text-lg font-semibold text-[#111827] dark:text-white placeholder-[#9ca3af] outline-none" 
                    autoFocus 
                />
                
                <div className="flex items-center gap-3">
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Task["priority"])} className="text-xs font-bold text-[#6b7280] bg-[#f3f4f6] dark:bg-slate-800 px-3 py-1.5 rounded-lg outline-none hover:bg-[#e5e7eb] transition-colors">
                        {priorities.map((p) => (<option key={p} value={p}>{priorityConfig[p].label} Priority</option>))}
                    </select>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="text-xs font-bold text-[#6b7280] bg-[#f3f4f6] dark:bg-slate-800 px-3 py-1.5 rounded-lg outline-none hover:bg-[#e5e7eb] transition-colors">
                        {categories.filter((c) => c !== "All").map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="text-xs font-bold text-[#6b7280] bg-[#f3f4f6] dark:bg-slate-800 px-3 py-1.5 rounded-lg outline-none hover:bg-[#e5e7eb] transition-colors" />
                </div>
             </div>
             
             <div className="flex flex-col gap-2">
                <button onClick={addTask} className="rounded-xl bg-[#4f46e5] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#4338ca] transition-all">Create</button>
                <button onClick={() => setShowAdd(false)} className="text-xs font-bold text-[#9ca3af] hover:text-[#111827] py-1 transition-colors">Cancel</button>
             </div>
          </div>
        </div>
      )}

      {/* Kanban Board Area */}
      <div className="flex-1 mt-6 min-h-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft py-12 text-center transition-colors duration-300">
            <ListChecks className="mx-auto h-8 w-8 text-[#d1d5db] dark:text-slate-600" />
            <p className="mt-3 text-sm text-[#9ca3af] dark:text-slate-500">
               {search || filterCategory !== "All" || filterPriority !== "all" || filterStatus !== "all" 
                 ? "No tasks match your filters" 
                 : "No tasks yet"}
            </p>
          </div>
        ) : (
          <KanbanBoard
            onTaskMove={handleTaskMove}
            onTaskClick={(id) => setExpandedId(expandedId === id ? null : id)}
            onTaskToggle={toggle}
            onTaskAdd={(status, title) => {
                if (title) {
                    handleQuickAdd(status as any, title);
                } else {
                    setNewStatus(status as any);
                    setShowAdd(true);
                }
            }}
            columns={[
              { id: "todo", title: "To Do", tasks: filtered.filter((t) => t.status === "todo") },
              { id: "done", title: "Done", tasks: filtered.filter((t) => t.status === "done") },
            ]}
          />
        )}
      </div>

      {/* Task Detail Modal */}
      {expandedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-[#e5e7eb] dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-bold text-[#111827] dark:text-white">Task Details</h3>
                      <button onClick={() => setExpandedId(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                          <X className="h-5 w-5 text-[#9ca3af]" />
                      </button>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto">
                      {tasks.find(t => t.id === expandedId) && (
                          <ExpandedPanel
                            task={tasks.find(t => t.id === expandedId)!}
                            onToggleSubtask={(subId) => toggleSubtask(expandedId!, subId)}
                            onAddSubtask={(text) => addSubtask(expandedId!, text)}
                            onRemoveSubtask={(subId) => removeSubtask(expandedId!, subId)}
                          />
                      )}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
                      <button 
                        onClick={() => { remove(expandedId!); setExpandedId(null); }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                          <Trash2 className="h-4 w-4" />
                          Delete
                      </button>
                      <button 
                         onClick={() => setExpandedId(null)}
                         className="px-6 py-2 bg-[#4f46e5] text-sm font-bold text-white rounded-lg hover:bg-[#4338ca]"
                      >
                          Save
                      </button>
                  </div>
              </div>
          </div>
      )}
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
