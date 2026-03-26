"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
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
  X,
  CalendarDays, // Added for Study Planner
  FileCheck, // Added for Exams
  CreditCard,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Pomodoro", href: "/pomodoro", icon: Timer },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Saved Links", href: "/links", icon: Bookmark },
  { label: "Flashcards", href: "/flashcards", icon: Layers },
  { label: "Study Planner", href: "/planner", icon: CalendarDays }, // Changed icon
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Exams", href: "/exams", icon: FileCheck }, // Changed icon
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { profile, openProfile, openPricingModal } = useUser();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-[70] h-full w-[280px] flex flex-col bg-white dark:bg-slate-900 border-r border-[#e5e7eb] dark:border-slate-800 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-[56px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4f46e5]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#111827] dark:text-white tracking-tight">
              FocusHub
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 min-h-[44px] ${
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
        <div className="border-t border-[#e5e7eb] dark:border-slate-800 px-3 py-3 space-y-1">
          <div
            onClick={() => { openProfile(); onClose(); }}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800 min-h-[44px]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-700 text-lg shadow-sm">
              {profile.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] dark:text-slate-200 truncate">
                {profile.name}
              </p>
              <p className="text-xs text-[#6b7280] dark:text-slate-400 truncate">Free Plan</p>
            </div>
          </div>

          <button 
            onClick={() => { openPricingModal(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b7280] dark:text-slate-400 transition-all duration-200 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200 min-h-[44px]"
          >
            <CreditCard className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Pricing</span>
          </button>

          <button 
            onClick={() => { supabase.auth.signOut(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b7280] dark:text-slate-400 transition-all duration-200 hover:bg-[#fef2f2] dark:hover:bg-red-500/10 hover:text-[#ef4444] dark:hover:text-red-400 min-h-[44px]"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
