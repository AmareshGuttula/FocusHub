"use client";

import { Achievement } from "@/lib/streakData";
import { Flame, Trophy, Star, Target } from "lucide-react";

interface AchievementsProps {
  achievements: Achievement[];
}

const iconMap = {
  flame: Flame,
  trophy: Trophy,
  star: Star,
  target: Target,
};

const iconColors = {
  flame: { text: "#f97316", bg: "rgba(249,115,22,0.08)" },
  trophy: { text: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  star: { text: "#4f46e5", bg: "rgba(79,70,229,0.08)" },
  target: { text: "#10b981", bg: "rgba(16,185,129,0.08)" },
};

export default function Achievements({ achievements }: AchievementsProps) {
  const unlocked = achievements.filter((a) => a.achievedAt);
  const locked = achievements.filter((a) => !a.achievedAt);

  return (
    <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-colors duration-300">
      <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200 mb-4 transition-colors duration-300">
        🏆 Achievements
      </h3>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {/* Unlocked */}
        {unlocked.map((ach) => {
          const Icon = iconMap[ach.icon];
          const colors = iconColors[ach.icon];
          return (
            <div
              key={ach.id}
              className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 transition-all duration-200 hover:shadow-card hover:border-[#d1d5db] dark:hover:border-slate-700"
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.bg }}
              >
                <Icon className="h-5 w-5" style={{ color: colors.text }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827] dark:text-white transition-colors duration-300">{ach.title}</p>
                <p className="text-xs text-[#6b7280] dark:text-slate-400 truncate">{ach.description}</p>
              </div>
            </div>
          );
        })}

        {/* Locked */}
        {locked.map((ach) => {
          const Icon = iconMap[ach.icon];
          return (
            <div
              key={ach.id}
              className="flex items-center gap-3 rounded-xl border border-dashed border-[#e5e7eb] dark:border-slate-700 bg-[#fafafa] dark:bg-slate-900/50 p-3.5 opacity-50 transition-colors duration-300"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3f4f6] dark:bg-slate-800 text-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-colors duration-300">
                <Icon className="h-5 w-5 text-[#d1d5db] dark:text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#9ca3af] dark:text-slate-500">{ach.title}</p>
                <p className="text-xs text-[#d1d5db] dark:text-slate-600 truncate">{ach.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
