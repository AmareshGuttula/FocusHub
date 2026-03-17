"use client";

import { useState } from "react";
import { Plus, Trash2, GraduationCap, Calendar, X, Clock } from "lucide-react";

interface Exam {
  id: number;
  title: string;
  date: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

function daysRemaining(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const initialExams: Exam[] = [
  { id: 1, title: "Math Exam", date: "2026-03-22" },
  { id: 2, title: "Biology Exam", date: "2026-03-29" },
  { id: 3, title: "Physics Exam", date: "2026-04-05" },
  { id: 4, title: "Computer Science Final", date: "2026-04-12" },
];

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const addExam = () => {
    if (!newTitle.trim() || !newDate) return;
    setExams((prev) =>
      [...prev, { id: Date.now(), title: newTitle.trim(), date: newDate }].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setNewTitle("");
    setNewDate("");
    setShowForm(false);
  };

  const deleteExam = (id: number) =>
    setExams((prev) => prev.filter((e) => e.id !== id));

  const sorted = [...exams].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b7280] dark:text-slate-400 transition-colors">{exams.length} upcoming exams</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
        >
          <Plus className="h-4 w-4" />
          Add Exam
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft space-y-3 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">Add Exam</h3>
            <button onClick={() => setShowForm(false)} className="text-[#9ca3af] dark:text-slate-500 hover:text-[#6b7280] dark:hover:text-slate-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Exam name..."
            className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#6b7280] dark:text-slate-400 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
          />
          <button
            onClick={addExam}
            className="w-full rounded-lg bg-[#4f46e5] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4338ca] shadow-sm shadow-[#4f46e5]/20"
          >
            Add Exam
          </button>
        </div>
      )}

      {/* Exam cards */}
      <div className="space-y-3">
        {sorted.map((exam) => {
          const remaining = daysRemaining(exam.date);
          const isPast = remaining < 0;
          const isUrgent = remaining >= 0 && remaining <= 3;
          const isSoon = remaining > 3 && remaining <= 7;

          return (
            <div
              key={exam.id}
              className="group rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:border-[#d1d5db] dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isPast
                      ? "bg-[#6b7280]/[0.08] dark:bg-slate-700/30"
                      : isUrgent
                        ? "bg-[#ef4444]/[0.08] dark:bg-red-500/20"
                        : isSoon
                          ? "bg-[#f59e0b]/[0.08] dark:bg-amber-500/20"
                          : "bg-[#4f46e5]/[0.08] dark:bg-indigo-500/20"
                  }`}
                >
                  <GraduationCap
                    className={`h-5 w-5 transition-colors ${
                      isPast
                        ? "text-[#6b7280] dark:text-slate-500"
                        : isUrgent
                          ? "text-[#ef4444] dark:text-red-400"
                          : isSoon
                            ? "text-[#f59e0b] dark:text-amber-400"
                            : "text-[#4f46e5] dark:text-indigo-400"
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold transition-colors ${isPast ? "text-[#9ca3af] dark:text-slate-500" : "text-[#111827] dark:text-slate-200"}`}>
                    {exam.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[#6b7280] dark:text-slate-400 transition-colors">
                      <Calendar className="h-3 w-3" />
                      {formatDate(exam.date)}
                    </span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="text-right flex-shrink-0">
                  {isPast ? (
                    <span className="text-xs font-medium text-[#9ca3af] dark:text-slate-500 transition-colors">Completed</span>
                  ) : (
                    <>
                      <p
                        className={`text-2xl font-bold tabular-nums transition-colors ${
                          isUrgent ? "text-[#ef4444] dark:text-red-400" : isSoon ? "text-[#f59e0b] dark:text-amber-400" : "text-[#111827] dark:text-slate-200"
                        }`}
                      >
                        {remaining}
                      </p>
                      <p className="text-xs text-[#6b7280] dark:text-slate-400 transition-colors">
                        {remaining === 1 ? "day left" : "days left"}
                      </p>
                    </>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="flex-shrink-0 text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#ef4444]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {exams.length === 0 && (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-center shadow-soft transition-colors duration-300">
          <GraduationCap className="mx-auto h-8 w-8 text-[#d1d5db] dark:text-slate-700 transition-colors" />
          <p className="mt-3 text-sm text-[#9ca3af] dark:text-slate-500 transition-colors">No exams scheduled. Add one above.</p>
        </div>
      )}
    </div>
  );
}
