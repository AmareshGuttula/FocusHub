import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: "primary" | "success" | "warning";
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function ProgressBar({ 
  value, 
  color = "primary", 
  className,
  size = "md",
  showLabel = false
}: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  const colorStyles = {
    primary: "bg-[#4f46e5]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  };

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full overflow-hidden rounded-full bg-[#f3f4f6] dark:bg-slate-700 transition-colors duration-300", heightStyles[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorStyles[color])}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex justify-end">
          <span className="text-xs font-semibold text-[#6b7280] dark:text-slate-400">
            {Math.round(safeValue)}%
          </span>
        </div>
      )}
    </div>
  );
}
