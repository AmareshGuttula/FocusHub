"use client";

import { useState, useEffect } from "react";
import { X, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface AchievementPopupProps {
  title: string;
  onClose: () => void;
}

export default function AchievementPopup({ title, onClose }: AchievementPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));

    // Fire Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#4f46e5", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"],
      disableForReducedMotion: true,
      zIndex: 100,
    });

    // Auto dismiss after 4s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-xl transition-all duration-300 dark:shadow-glow ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100/80 shadow-inner">
        <Trophy className="h-5 w-5 text-amber-600" />
      </div>
      <div>
        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
          New Achievement
        </p>
        <p className="text-sm font-bold text-[#111827]">{title}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-amber-400 hover:text-amber-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
