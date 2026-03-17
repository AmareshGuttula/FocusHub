"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  StickyNote,
  Bookmark,
  Layers,
  CalendarRange,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Pomodoro", href: "/pomodoro", icon: Timer },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Saved Links", href: "/links", icon: Bookmark },
  { label: "Flashcards", href: "/flashcards", icon: Layers },
  { label: "Study Planner", href: "/planner", icon: CalendarRange },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Exams", href: "/exams", icon: GraduationCap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, openProfile } = useUser();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-[260px] flex-col border-r border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Logo */}
      <div className="flex h-[60px] items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4f46e5]">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-[#111827] dark:text-white tracking-tight transition-colors duration-300">
          FocusHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#4f46e5]/[0.08] dark:bg-[#4f46e5]/20 text-[#4f46e5] dark:text-indigo-400"
                      : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] dark:border-slate-800 px-3 py-3 space-y-1 transition-colors duration-300">
        {/* User info */}
        <div 
          onClick={openProfile}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-700 text-lg shadow-sm">
            {profile.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#111827] dark:text-slate-200 truncate transition-colors duration-300">
              {profile.name}
            </p>
            <p className="text-xs text-[#6b7280] dark:text-slate-400 truncate transition-colors duration-300">Free Plan</p>
          </div>
        </div>

        {/* Logout */}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#6b7280] dark:text-slate-400 transition-all duration-200 hover:bg-[#fef2f2] dark:hover:bg-red-500/10 hover:text-[#ef4444] dark:hover:text-red-400">
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
