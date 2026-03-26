"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DailyMissions from "@/components/dashboard/DailyMissions";
import RightPanel from "@/components/dashboard/RightPanel";
import ContributionGrid from "@/components/ContributionGrid";
import AchievementPopup from "@/components/AchievementPopup";
import { mockActivity, mockAchievements } from "@/lib/streakData";
import { Star, CheckCircle2, Award, Flame } from "lucide-react";

export default function DashboardPage() {
  const [toastAchievement, setToastAchievement] = useState<string | null>(null);

  // Show toast for the most recently unlocked achievement on mount
  useEffect(() => {
    const unlocked = mockAchievements.filter((a) => a.achievedAt);
    if (unlocked.length > 0) {
      const latest = unlocked[unlocked.length - 1];
      const timer = setTimeout(() => setToastAchievement(latest.title), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-8">
          
          <DashboardHeader />

          {/* Quick Welcome Banner */}
          <div className="flex items-center justify-between rounded-2xl bg-[#4f46e5]/[0.05] dark:bg-[#4f46e5]/10 p-6 border border-[#4f46e5]/10 dark:border-[#4f46e5]/20">
            <div>
              <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-1 tracking-tight">Set your focus for today 🎯</h2>
              <p className="text-sm text-[#6b7280] dark:text-slate-400">You have active tasks waiting for you. Let's get things done!</p>
            </div>
          </div>

          {/* Daily Missions */}
          <div className="mt-2">
             <DailyMissions />
          </div>

          {/* Contribution Grid */}
          <div className="mt-4 pb-12 lg:pb-0">
             <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-4">Your Study Activity</h2>
             <ContributionGrid activities={mockActivity} />
          </div>

        </div>

        {/* Right Column (Sticky Panel) */}
        <div className="sticky top-6 w-full lg:w-auto">
          <RightPanel />
        </div>

      </div>

      {/* Achievement toast */}
      {toastAchievement && (
        <AchievementPopup
          title={toastAchievement}
          onClose={() => setToastAchievement(null)}
        />
      )}
    </div>
  );
}
