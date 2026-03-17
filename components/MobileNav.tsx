"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  StickyNote,
  MoreHorizontal,
} from "lucide-react";

const tabs = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Pomodoro", href: "/pomodoro", icon: Timer },
  { label: "Notes", href: "/notes", icon: StickyNote },
];

interface MobileNavProps {
  onMoreClick: () => void;
}

export default function MobileNav({ onMoreClick }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 lg:hidden transition-colors duration-300"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-h-[48px] min-w-[48px] justify-center transition-colors ${
                isActive
                  ? "text-[#4f46e5] dark:text-indigo-400"
                  : "text-[#6b7280] dark:text-slate-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
        {/* More button */}
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center gap-0.5 py-2 px-3 min-h-[48px] min-w-[48px] justify-center text-[#6b7280] dark:text-slate-400 transition-colors"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
