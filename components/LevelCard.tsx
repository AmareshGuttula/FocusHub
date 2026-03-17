"use client";

import { useUser } from "@/contexts/UserContext";
import { Trophy } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

export function LevelCard() {
  const { profile, levelInfo } = useUser();

  return (
    <div className="flex flex-col rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/20 dark:bg-[#4f46e5]/20 dark:border-[#4f46e5]/30">
          <span className="text-base font-bold text-[#4f46e5] dark:text-indigo-400">{levelInfo.level}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#111827] dark:text-white transition-colors duration-300">Level {levelInfo.level}: {levelInfo.title}</h3>
          <p className="text-xs font-medium text-[#6b7280] dark:text-slate-400">
            {profile.totalPoints.toLocaleString()} / {levelInfo.maxPoints.toLocaleString()} pts
          </p>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-[#6b7280] dark:text-slate-400">Next Level</span>
          <span className="text-xs font-bold text-[#4f46e5] dark:text-indigo-400">{Math.round(levelInfo.progressPercentage)}%</span>
        </div>
        <ProgressBar 
          value={levelInfo.progressPercentage} 
          color="primary" 
          size="md" 
        />
        {levelInfo.level === 4 && (
          <p className="mt-2 text-xs text-center text-emerald-600 font-semibold bg-emerald-50 py-1 rounded-md">
            Max Level Reached! 🌟
          </p>
        )}
      </div>
    </div>
  );
}
