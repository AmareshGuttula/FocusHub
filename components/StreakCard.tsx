"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (currentStreak > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentStreak]);

  return (
    <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lg:p-5 shadow-soft transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Fire icon with animation */}
        <div className="relative">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(249,115,22,0.08)] transition-transform duration-300 ${
              animate ? "scale-110" : "scale-100"
            }`}
          >
            <Flame
              className={`h-7 w-7 text-[#f97316] transition-all duration-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.5)] ${
                animate ? "drop-shadow-[0_0_16px_rgba(249,115,22,0.8)]" : ""
              }`}
              style={
                currentStreak > 0
                  ? { animation: "flicker 2s ease-in-out infinite" }
                  : {}
              }
            />
          </div>
          {/* Pulse ring when animating */}
          {animate && (
            <div className="absolute inset-0 rounded-2xl border-2 border-[#f97316]/30 animate-ping" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-slate-400 text-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            🔥 Study Streak
          </p>
          <p className="text-3xl font-bold text-[#111827] dark:text-white tabular-nums transition-colors duration-300">
            {currentStreak}{" "}
            <span className="text-base font-medium text-[#6b7280] dark:text-slate-400">
              {currentStreak === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="text-xs text-[#9ca3af] dark:text-slate-500 mt-0.5">
            Best: <span className="font-semibold text-[#6b7280] dark:text-slate-400">{longestStreak} days</span>
          </p>
        </div>
      </div>

      {/* Flicker keyframes */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { transform: scale(1); opacity: 1; }
          25% { transform: scale(1.05); opacity: 0.9; }
          50% { transform: scale(0.97); opacity: 1; }
          75% { transform: scale(1.03); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
