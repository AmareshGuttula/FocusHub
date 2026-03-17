"use client";

import { useEffect } from "react";
import { CheckCircle2, Coins } from "lucide-react";

interface RewardPopupProps {
  message: string;
  points: number;
  isVisible: boolean;
  onClose: () => void;
}

export function RewardPopup({ message, points, isVisible, onClose }: RewardPopupProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
      <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 shadow-lg transform transition-all hover:scale-105">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">{message}</p>
          <p className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
            <Coins className="h-3 w-3" /> +{points} Focus Points
          </p>
        </div>
      </div>
    </div>
  );
}
