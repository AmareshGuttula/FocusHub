"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  FileCheck,
  TrendingUp,
  Settings,
  Sparkles,
  Kanban,
  CreditCard,
  Crown,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { label: "Tasks", href: "/tasks", icon: <CheckSquare className="h-[18px] w-[18px]" /> },
  { label: "Pomodoro", href: "/pomodoro", icon: <Timer className="h-[18px] w-[18px]" /> },
  { label: "Flashcards", href: "/flashcards", icon: <BrainCircuit className="h-[18px] w-[18px]" /> },
  { label: "Notes", href: "/notes", icon: <BookOpen className="h-[18px] w-[18px]" /> },
  { label: "Study Planner", href: "/planner", icon: <CalendarDays className="h-[18px] w-[18px]" /> },
  { label: "Analytics", href: "/analytics", icon: <TrendingUp className="h-[18px] w-[18px]" /> },
  { label: "Exams", href: "/exams", icon: <FileCheck className="h-[18px] w-[18px]" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-[18px] w-[18px]" /> },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { profile, openProfile, openPricingModal, checkAction, logout } = useUser();
  const { clearTimer } = usePomodoro();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearTimer();
    logout();
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo Section */}
          <Link
            href="/dashboard"
            className="flex h-[60px] items-center gap-2.5 px-1 py-2 relative z-20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4f46e5] flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-lg font-semibold text-[#111827] dark:text-white tracking-tight transition-colors duration-300 whitespace-pre"
            >
              FocusHub
            </motion.span>
          </Link>

          {/* Navigation Links */}
          <div className="mt-4 flex flex-col gap-1">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <SidebarLink 
                  key={idx} 
                  link={item} 
                  className={isActive 
                    ? "bg-[#4f46e5]/[0.08] dark:bg-[#4f46e5]/20 text-[#4f46e5] dark:text-indigo-400 group-hover/sidebar:text-[#4f46e5]" 
                    : ""}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-[#e5e7eb] dark:border-slate-800 pt-3 flex flex-col gap-1 overflow-hidden transition-colors duration-300 mt-2">
          {/* User Profile */}
          <div 
            onClick={openProfile}
            className="flex items-center gap-3 py-2 px-3 cursor-pointer rounded-lg transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800"
          >
            <div className="relative flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-700 text-lg shadow-sm">
                {profile.avatar}
              </div>
              {/* Plan status dot — visible even when sidebar is collapsed */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                profile.isPro 
                  ? "bg-violet-500" 
                  : "bg-gray-300 dark:bg-slate-600"
              }`} />
            </div>
            <motion.div 
              animate={{
                display: open ? "block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-[#111827] dark:text-slate-200 truncate transition-colors duration-300">
                {profile.name}
              </p>
              <p className="text-xs text-[#6b7280] dark:text-slate-400 truncate transition-colors duration-300">
                {profile.isPro ? "Pro Plan" : "Free Plan"}
              </p>
            </motion.div>
          </div>

          {/* Pricing / Pro status */}
          <button 
            onClick={() => !profile.isPro && checkAction(() => openPricingModal())}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              profile.isPro
                ? "text-violet-600 dark:text-violet-400 cursor-default"
                : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
            }`}
          >
            {profile.isPro ? (
              <Crown className="h-[18px] w-[18px] flex-shrink-0" />
            ) : (
              <CreditCard className="h-[18px] w-[18px] flex-shrink-0" />
            )}
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="whitespace-pre"
            >
              {profile.isPro ? "Premium ✓" : "Pricing"}
            </motion.span>
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#6b7280] dark:text-slate-400 transition-all duration-200 hover:bg-[#fef2f2] dark:hover:bg-red-500/10 hover:text-[#ef4444] dark:hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="whitespace-pre"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
