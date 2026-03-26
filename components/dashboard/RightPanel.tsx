"use client";

import { useUser } from "@/contexts/UserContext";
import StatsCard from "./StatsCard";
import StreakCard from "@/components/StreakCard";
import { Star, Trophy, Clock } from "lucide-react";
import { mockStreak } from "@/lib/streakData";

export default function RightPanel() {
  const { profile } = useUser();

  return (
    <div className="flex flex-col gap-6 w-full lg:w-[320px] shrink-0 xl:w-[360px]">
      
      {/* Profile Card */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-2xl shadow-inner">
          {profile.avatar}
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-[#111827] dark:text-white leading-tight">
            {profile.name}
          </h2>
          <p className={`text-sm font-medium ${profile.isPro ? "text-[#4f46e5] dark:text-indigo-400" : "text-[#6b7280] dark:text-slate-400"}`}>
            {profile.isPro ? "Pro Student" : "Free Plan"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard 
          icon={Star} 
          value={profile.totalPoints.toLocaleString()} 
          label="Points" 
          colorClass="bg-[#fef3c7] text-[#d97706] dark:bg-amber-500/10 dark:text-amber-400" 
        />
        <StatsCard 
          icon={Trophy} 
          value="5" 
          label="Achieved" 
          colorClass="bg-[#d1fae5] text-[#059669] dark:bg-emerald-500/10 dark:text-emerald-400" 
        />
      </div>

      {/* Streak component */}
      <StreakCard 
        currentStreak={mockStreak.currentStreak} 
        longestStreak={mockStreak.longestStreak} 
      />

      {/* Today's Focus Time Activity */}
      <div className="flex flex-col rounded-2xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">
            Today's Focus Time
          </h3>
          <Clock className="h-4 w-4 text-[#9ca3af]" />
        </div>
        
        <div className="flex items-center gap-6">
          {/* Circular Progress (CSS based) */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-800">
             {/* Progress overlay (approx 75%) */}
             <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-slate-700" />
                <circle 
                  cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" 
                  className="text-[#4f46e5] dark:text-indigo-500 transition-all duration-1000 ease-out" 
                  strokeDasharray="226" 
                  strokeDashoffset="56.5" 
                  strokeLinecap="round" 
                />
             </svg>
             <span className="text-lg font-bold text-[#111827] dark:text-white">75%</span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-3xl font-bold text-[#111827] dark:text-white">
              3.5<span className="text-base font-medium text-[#6b7280] dark:text-slate-400 ml-1">hrs</span>
            </p>
            <p className="text-xs text-[#10b981] dark:text-emerald-400 font-medium mt-1">
              +1.2 hrs from yesterday
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
