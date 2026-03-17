"use client";

import { useUser } from "@/contexts/UserContext";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

export function PointsCard() {
  const { profile } = useUser();
  const [animate, setAnimate] = useState(false);

  // Trigger bounce animation when points increase
  useEffect(() => {
    if (profile.totalPoints > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [profile.totalPoints]);

  return (
    <div className="flex flex-col rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] dark:text-slate-400">
          Total Focus Points
        </h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
          <Coins className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </div>
      </div>
      
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold text-[#111827] dark:text-white transition-all duration-300 ${animate ? "scale-110 text-amber-500 dark:text-amber-400" : "scale-100"}`}>
          {profile.totalPoints.toLocaleString()}
        </span>
        <span className="mb-1 text-sm font-medium text-[#6b7280] dark:text-slate-400">pts</span>
      </div>
    </div>
  );
}
