"use client";

import { useState, useEffect } from "react";
import DashboardCards from "@/components/DashboardCards";
import StreakCard from "@/components/StreakCard";
import ContributionGrid from "@/components/ContributionGrid";
import Achievements from "@/components/Achievements";
import AchievementPopup from "@/components/AchievementPopup";
import {
  mockActivity,
  mockStreak,
  mockAchievements,
} from "@/lib/streakData";
import {
  CheckCircle2,
  Timer,
  StickyNote,
  Bookmark,
} from "lucide-react";

const recentActivity = [
  {
    icon: CheckCircle2,
    text: "Task completed",
    detail: "Finished Linear Algebra problem set",
    time: "10 min ago",
    color: "#10b981",
  },
  {
    icon: Timer,
    text: "Pomodoro session finished",
    detail: "25 min focus · Organic Chemistry",
    time: "35 min ago",
    color: "#f59e0b",
  },
  {
    icon: StickyNote,
    text: "New note created",
    detail: "Physics — Thermodynamics Ch.4",
    time: "1h ago",
    color: "#8b5cf6",
  },
  {
    icon: Bookmark,
    text: "Link saved",
    detail: "Khan Academy — Eigenvalues & Eigenvectors",
    time: "2h ago",
    color: "#4f46e5",
  },
];

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
    <div className="mx-auto max-w-6xl space-y-6 lg:space-y-8">
      {/* Stat cards */}
      <DashboardCards />

      {/* ── Your Study Activity ── */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#111827] dark:text-slate-200 transition-colors duration-300">
          Your Study Activity
        </h2>

        {/* Streak card */}
        <StreakCard
          currentStreak={mockStreak.currentStreak}
          longestStreak={mockStreak.longestStreak}
        />

        {/* Contribution grid */}
        <ContributionGrid activities={mockActivity} />

        {/* Achievements */}
        <Achievements achievements={mockAchievements} />
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
