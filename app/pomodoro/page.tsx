"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings2, Maximize2, Minimize2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { RewardPopup } from "@/components/RewardPopup";

export default function PomodoroPage() {
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const { completePomodoro } = useUser();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "focus") {
        setSessions((s) => s + 1);
        setMode("break");
        setTimeLeft(breakMins * 60);
        completePomodoro();
        setShowReward(true);
      } else {
        setMode("focus");
        setTimeLeft(focusMins * 60);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, focusMins, breakMins]);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? focusMins * 60 : breakMins * 60);
  };

  const switchMode = (m: "focus" | "break") => {
    setIsRunning(false);
    setMode(m);
    setTimeLeft(m === "focus" ? focusMins * 60 : breakMins * 60);
  };

  const applySettings = (f: number, b: number) => {
    setFocusMins(f);
    setBreakMins(b);
    setIsRunning(false);
    if (mode === "focus") setTimeLeft(f * 60);
    else setTimeLeft(b * 60);
    setShowSettings(false);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const total = mode === "focus" ? focusMins * 60 : breakMins * 60;
  const progress = ((total - timeLeft) / total) * 100;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const ringColor = mode === "focus" ? "#4f46e5" : "#10b981";

  return (
    <>
      <div className={isFocusMode ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-4 transition-colors duration-300" : "mx-auto max-w-md space-y-4"}>
        <div className={`relative w-full max-w-md rounded-xl transition-colors duration-300 ${isFocusMode ? "scale-110 shadow-none border-none bg-transparent" : "border border-[#e5e7eb] dark:border-slate-800 shadow-soft bg-white dark:bg-slate-900"}`}>
          {/* Focus Mode Toggle */}
          <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="absolute top-4 right-4 text-[#9ca3af] dark:text-slate-500 hover:text-[#4f46e5] dark:hover:text-indigo-400 transition-colors"
            title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
          >
            {isFocusMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        {/* Mode tabs */}
        <div className="flex border-b border-[#f3f4f6] dark:border-slate-800 transition-colors duration-300">
          <button
            onClick={() => switchMode("focus")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === "focus"
                ? "text-[#4f46e5] dark:text-indigo-400 border-b-2 border-[#4f46e5] dark:border-indigo-400"
                : "text-[#6b7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-slate-200"
            }`}
          >
            Focus · {focusMins} min
          </button>
          <button
            onClick={() => switchMode("break")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === "break"
                ? "text-[#10b981] dark:text-emerald-400 border-b-2 border-[#10b981] dark:border-emerald-400"
                : "text-[#6b7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-slate-200"
            }`}
          >
            Break · {breakMins} min
          </button>
        </div>

        {/* Timer display with circle */}
        <div className="flex flex-col items-center py-10">
          <div className="relative flex h-52 w-52 lg:h-72 lg:w-72 items-center justify-center">
            <svg className="absolute -rotate-90 w-full h-full" viewBox="0 0 288 288">
              {/* Background ring */}
              <circle cx="144" cy="144" r={radius} fill="none" stroke="currentColor" className="text-[#f3f4f6] dark:text-slate-800 transition-colors duration-300" strokeWidth="6" />
              {/* Progress ring */}
              <circle
                cx="144"
                cy="144"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
              />
            </svg>
            <div className="text-center">
              <span className="text-5xl lg:text-6xl font-bold text-[#111827] dark:text-white tabular-nums tracking-tight transition-colors duration-300">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-400 transition-colors duration-300">
                {mode === "focus" ? "Stay focused" : "Take a break"}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 border-t border-[#f3f4f6] dark:border-slate-800 px-4 lg:px-5 py-4 transition-colors duration-300">
          <button
            onClick={reset}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] dark:border-slate-700 text-[#6b7280] dark:text-slate-400 transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#4f46e5] px-6 lg:px-8 text-sm font-medium text-white transition-colors hover:bg-[#4338ca] shadow-sm shadow-[#4f46e5]/20 min-h-[44px]"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Start
              </>
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
              showSettings
                ? "bg-[#4f46e5]/[0.08] dark:bg-[#4f46e5]/20 text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5]/30 dark:border-indigo-500/30"
                : "border-[#e5e7eb] dark:border-slate-700 text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
            }`}
            title="Customize"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Customize panel */}
      {showSettings && (
        <CustomizePanel
          focusMins={focusMins}
          breakMins={breakMins}
          onApply={applySettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Sessions counter */}
      {!isFocusMode && (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 lg:px-5 py-4 shadow-soft text-center w-full transition-colors duration-300">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-slate-400">
            Sessions completed today
          </p>
          <p className="mt-1 text-2xl font-bold text-[#111827] dark:text-white transition-colors duration-300">{sessions}</p>
        </div>
      )}

      <RewardPopup 
        message="🔥 You focused for a full session!" 
        points={15} 
        isVisible={showReward} 
        onClose={() => setShowReward(false)} 
      />
    </div>
    </>
  );
}

function CustomizePanel({
  focusMins,
  breakMins,
  onApply,
  onClose,
}: {
  focusMins: number;
  breakMins: number;
  onApply: (f: number, b: number) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState(focusMins);
  const [b, setB] = useState(breakMins);

  const presets = [
    { label: "Short", focus: 15, brk: 3 },
    { label: "Classic", focus: 25, brk: 5 },
    { label: "Long", focus: 50, brk: 10 },
  ];

  return (
    <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft space-y-5 transition-colors duration-300">
      <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">
        Customize Timer
      </h3>

      {/* Presets */}
      <div>
        <p className="text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-2">Presets</p>
        <div className="flex gap-2">
          {presets.map((p) => {
            const active = f === p.focus && b === p.brk;
            return (
              <button
                key={p.label}
                onClick={() => {
                  setF(p.focus);
                  setB(p.brk);
                }}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "border-[#4f46e5]/30 dark:border-indigo-500/30 bg-[#4f46e5]/[0.08] dark:bg-[#4f46e5]/20 text-[#4f46e5] dark:text-indigo-400"
                    : "border-[#e5e7eb] dark:border-slate-700 text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
                }`}
              >
                {p.label}
                <span className="block text-[10px] mt-0.5 opacity-70">
                  {p.focus}/{p.brk} min
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-1">
            Focus (min)
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={f}
            onChange={(e) => setF(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#111827] dark:text-slate-200 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-1">
            Break (min)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={b}
            onChange={(e) => setB(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#111827] dark:text-slate-200 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-[#e5e7eb] dark:border-slate-700 px-3 py-2 text-sm font-medium text-[#6b7280] dark:text-slate-400 transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(f, b)}
          className="flex-1 rounded-lg bg-[#4f46e5] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4338ca] shadow-sm shadow-[#4f46e5]/20"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
