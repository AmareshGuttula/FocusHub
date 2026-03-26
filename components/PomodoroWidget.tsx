"use client";

import { useState, useEffect } from "react";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { Pause, Play, RotateCcw, Timer, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PomodoroWidget() {
  const { state, start, pause, reset } = usePomodoro();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reset dismissed when timer starts
  useEffect(() => {
    if (state.isRunning) setDismissed(false);
  }, [state.isRunning]);

  if (!mounted) return null;

  // Don't show on the Pomodoro page itself — it has the full UI
  if (pathname === "/pomodoro") return null;

  // Only show if timer is running or paused with time less than full
  const fullTime = state.sessionType === "focus" ? state.focusMins * 60 : state.breakMins * 60;
  const isActive = state.isRunning || state.timeRemaining < fullTime;

  if (!isActive || dismissed) return null;

  const mins = Math.floor(state.timeRemaining / 60);
  const secs = state.timeRemaining % 60;
  const isFocus = state.sessionType === "focus";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
          isFocus
            ? "bg-white/95 dark:bg-slate-900/95 border-indigo-200 dark:border-indigo-500/30 shadow-indigo-500/10"
            : "bg-white/95 dark:bg-slate-900/95 border-emerald-200 dark:border-emerald-500/30 shadow-emerald-500/10"
        }`}
      >
        {/* Pulse dot */}
        <div className="relative">
          <Timer className={`w-4 h-4 ${isFocus ? "text-indigo-500" : "text-emerald-500"}`} />
          {state.isRunning && (
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse ${
              isFocus ? "bg-indigo-500" : "bg-emerald-500"
            }`} />
          )}
        </div>

        {/* Time */}
        <span className="text-lg font-bold tabular-nums text-[#111827] dark:text-white min-w-[60px]">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>

        {/* Label */}
        <span className={`text-xs font-medium ${isFocus ? "text-indigo-500" : "text-emerald-500"}`}>
          {isFocus ? "Focus" : "Break"}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={state.isRunning ? pause : start}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
              isFocus
                ? "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20"
                : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/20"
            }`}
          >
            {state.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={reset}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
