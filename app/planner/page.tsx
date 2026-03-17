"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, GripVertical, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface StudyBlock {
  id: number;
  subject: string;
  hours: number;
  color: string;
}

type WeekPlan = Record<string, StudyBlock[]>;

const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialPlan: WeekPlan = {
  Monday: [
    { id: 1, subject: "Math", hours: 2, color: "#4f46e5" },
    { id: 2, subject: "Physics", hours: 1, color: "#ef4444" },
  ],
  Tuesday: [
    { id: 3, subject: "Biology", hours: 1.5, color: "#10b981" },
    { id: 4, subject: "English", hours: 1, color: "#06b6d4" },
  ],
  Wednesday: [
    { id: 5, subject: "Computer Science", hours: 2, color: "#8b5cf6" },
  ],
  Thursday: [
    { id: 6, subject: "Chemistry", hours: 1.5, color: "#f59e0b" },
    { id: 7, subject: "Math", hours: 1, color: "#4f46e5" },
  ],
  Friday: [
    { id: 8, subject: "Physics", hours: 2, color: "#ef4444" },
  ],
  Saturday: [],
  Sunday: [],
};

export default function PlannerPage() {
  const [plan, setPlan] = useState<WeekPlan>(initialPlan);
  const [addingDay, setAddingDay] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState("");
  const [newHours, setNewHours] = useState("1");

  // Calendar state
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number>(today.getDate());

  // Drag state
  const dragItem = useRef<{ day: string; index: number } | null>(null);
  const dragOverItem = useRef<{ day: string; index: number } | null>(null);

  // Calendar helpers
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const getDayName = (date: number) => {
    const d = new Date(calYear, calMonth, date);
    return days[d.getDay() === 0 ? 6 : d.getDay() - 1]; // Convert Sun=0 to our Mon-Sun list
  };

  const getDotsForDate = (date: number) => {
    const dayName = getDayName(date);
    return plan[dayName] || [];
  };

  const isToday = (date: number) =>
    date === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  const addBlock = (day: string) => {
    if (!newSubject.trim()) return;
    const colorIndex = Object.values(plan).flat().length % colors.length;
    setPlan((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        { id: Date.now(), subject: newSubject.trim(), hours: Math.max(0.5, Number(newHours) || 1), color: colors[colorIndex] },
      ],
    }));
    setNewSubject("");
    setNewHours("1");
    setAddingDay(null);
  };

  const removeBlock = (day: string, id: number) => {
    setPlan((prev) => ({
      ...prev,
      [day]: prev[day].filter((b) => b.id !== id),
    }));
  };

  const handleDragStart = (day: string, index: number) => {
    dragItem.current = { day, index };
  };

  const handleDragEnter = (day: string, index: number) => {
    dragOverItem.current = { day, index };
  };

  const handleDragEnd = () => {
    if (!dragItem.current || !dragOverItem.current) return;
    const { day: fromDay, index: fromIndex } = dragItem.current;
    const { day: toDay, index: toIndex } = dragOverItem.current;

    setPlan((prev) => {
      const updated = { ...prev };
      const fromList = [...updated[fromDay]];
      const [moved] = fromList.splice(fromIndex, 1);

      if (fromDay === toDay) {
        fromList.splice(toIndex, 0, moved);
        updated[fromDay] = fromList;
      } else {
        updated[fromDay] = fromList;
        const toList = [...updated[toDay]];
        toList.splice(toIndex, 0, moved);
        updated[toDay] = toList;
      }
      return updated;
    });

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const totalHours = (day: string) =>
    plan[day].reduce((sum, b) => sum + b.hours, 0);

  const weekTotal = days.reduce((sum, day) => sum + totalHours(day), 0);

  // Selected date info
  const selectedDayName = getDayName(selectedDate);
  const selectedBlocks = plan[selectedDayName] || [];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Calendar + selected day info */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Monthly calendar */}
        <div className="lg:col-span-2 rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">
              {monthNames[calMonth]} {calYear}
            </h3>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {dayLabels.map((d) => (
              <div key={d} className="py-1 text-center text-[11px] font-medium uppercase tracking-wider text-[#9ca3af] dark:text-slate-500">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-1" />
            ))}
            {/* Date cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const dots = getDotsForDate(date);
              const todayClass = isToday(date);
              const selected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex flex-col items-center rounded-lg p-1.5 transition-colors ${
                    selected
                      ? "bg-[#4f46e5]/[0.08] dark:bg-indigo-500/20"
                      : "hover:bg-[#f7f7f8] dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      todayClass
                        ? "bg-[#4f46e5] text-white font-semibold"
                        : selected
                          ? "text-[#4f46e5] font-semibold"
                          : "text-[#111827] dark:text-slate-200"
                    }`}
                  >
                    {date}
                  </span>
                  {/* Dots */}
                  {dots.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dots.slice(0, 3).map((b, idx) => (
                        <div
                          key={idx}
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: b.color }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft p-5">
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">
            {selectedDayName}, {monthNames[calMonth]} {selectedDate}
          </h3>
          <p className="text-xs text-[#9ca3af] dark:text-slate-500 mt-0.5">
            {selectedBlocks.length > 0 ? `${selectedBlocks.reduce((s, b) => s + b.hours, 0)}h scheduled` : "No subjects scheduled"}
          </p>
          <div className="mt-4 space-y-2">
            {selectedBlocks.map((block) => (
              <div key={block.id} className="flex items-center gap-2.5 rounded-lg bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2">
                <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: block.color }} />
                <span className="flex-1 text-sm text-[#111827] dark:text-slate-200">{block.subject}</span>
                <span className="text-xs text-[#9ca3af] dark:text-slate-500">{block.hours}h</span>
              </div>
            ))}
            {selectedBlocks.length === 0 && (
              <p className="py-6 text-center text-xs text-[#d1d5db] dark:text-slate-600">Free day ✨</p>
            )}
          </div>
        </div>
      </div>

      {/* Week summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b7280] dark:text-slate-400">
          Weekly total: <span className="font-semibold text-[#111827] dark:text-slate-200">{weekTotal}h</span>
        </p>
      </div>

      {/* Day cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {days.map((day) => {
          const hours = totalHours(day);
          const isAdding = addingDay === day;
          const isWeekend = day === "Saturday" || day === "Sunday";
          return (
            <div
              key={day}
              className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragEnd}
            >
              {/* Day header */}
              <div className="flex items-center justify-between border-b border-[#f3f4f6] dark:border-slate-800/50 px-4 py-3">
                <div>
                  <h3 className={`text-sm font-semibold ${isWeekend ? "text-[#9ca3af] dark:text-slate-500" : "text-[#111827] dark:text-slate-200"}`}>
                    {day}
                  </h3>
                  {hours > 0 && (
                    <p className="flex items-center gap-1 text-[11px] text-[#9ca3af] dark:text-slate-500 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {hours}h planned
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { setAddingDay(isAdding ? null : day); setNewSubject(""); setNewHours("1"); }}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    isAdding
                      ? "bg-[#4f46e5]/[0.08] dark:bg-indigo-500/20 text-[#4f46e5]"
                      : "text-[#d1d5db] dark:text-slate-600 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#6b7280] dark:hover:text-slate-400"
                  }`}
                >
                  {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Blocks */}
              <div className="p-2 space-y-1.5 min-h-[60px]">
                {plan[day].map((block, idx) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(day, idx)}
                    onDragEnter={() => handleDragEnter(day, idx)}
                    className="group flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-[#fafafa] dark:hover:bg-slate-800/50 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical className="h-3.5 w-3.5 flex-shrink-0 text-[#d1d5db] dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: block.color }}
                    />
                    <span className="flex-1 text-sm text-[#111827] dark:text-slate-200 truncate">
                      {block.subject}
                    </span>
                    <span className="text-xs text-[#9ca3af] dark:text-slate-500">{block.hours}h</span>
                    <button
                      onClick={() => removeBlock(day, block.id)}
                      className="text-[#d1d5db] dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-all hover:text-[#ef4444]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {plan[day].length === 0 && !isAdding && (
                  <p className="py-3 text-center text-xs text-[#d1d5db] dark:text-slate-600">No subjects</p>
                )}

                {/* Add form (inline) */}
                {isAdding && (
                  <div className="space-y-2 rounded-lg border border-[#e5e7eb] dark:border-slate-800 bg-[#f7f7f8] dark:bg-slate-800 p-2.5">
                    <input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addBlock(day)}
                      placeholder="Subject name..."
                      className="w-full rounded-md border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/20"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={newHours}
                          onChange={(e) => setNewHours(e.target.value)}
                          className="w-full rounded-md border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-[#111827] dark:text-slate-200 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/20"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af] dark:text-slate-500">hrs</span>
                      </div>
                      <button
                        onClick={() => addBlock(day)}
                        className="rounded-md bg-[#4f46e5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#4338ca] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
