"use client";

import { useState } from "react";
import { DailyActivity, getActivityLevel, levelColors } from "@/lib/streakData";

interface ContributionGridProps {
  activities: DailyActivity[];
}

export default function ContributionGrid({ activities }: ContributionGridProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Build a map for quick lookup
  const activityMap = new Map<string, number>();
  activities.forEach((a) => activityMap.set(a.date, a.tasksCompleted));

  // Generate 91 days (13 weeks) of cells
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayCount = 91;

  const cells: { date: Date; dateStr: string; tasks: number }[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    cells.push({ date: d, dateStr, tasks: activityMap.get(dateStr) || 0 });
  }

  // Pad beginning so first column starts on Sunday
  const firstDay = cells[0].date.getDay();
  const padded = Array.from({ length: firstDay }, () => null);

  // Build weeks (columns)
  const allCells = [...padded, ...cells];
  const weeks: (typeof cells[0] | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }
  // Pad last week if needed
  const lastWeek = weeks[weeks.length - 1];
  while (lastWeek.length < 7) lastWeek.push(null);

  const dayLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lg:p-5 shadow-soft transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200 transition-colors duration-300">Contribution Activity</h3>
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#6b7280]">
          <span>Less</span>
          {levelColors.map((color, i) => (
            <div
              key={i}
              className="h-[10px] w-[10px] rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="relative overflow-x-auto touch-scroll">
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1 pt-0">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-[12px] w-6 text-[9px] leading-[12px] text-[#6b7280] dark:text-slate-400">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell, ci) => {
                if (!cell) {
                  return <div key={ci} className="h-[12px] w-[12px]" />;
                }
                const level = getActivityLevel(cell.tasks);
                return (
                  <div
                    key={ci}
                    className="h-[12px] w-[12px] rounded-sm cursor-pointer transition-transform hover:scale-125"
                    style={{ backgroundColor: levelColors[level] }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: `${formatDate(cell.dateStr)} — ${cell.tasks} task${cell.tasks !== 1 ? "s" : ""} completed`,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-[#111827] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg pointer-events-none whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#111827]" />
          </div>
        )}
      </div>
    </div>
  );
}
