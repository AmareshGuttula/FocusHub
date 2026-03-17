"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, CheckCircle2, AlertTriangle, Info, Clock, Moon, Sun, Menu } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Task Completed", message: "Linear Algebra problem set", time: "10 min ago", type: "success", read: false },
  { id: 2, title: "Upcoming Exam", message: "Physics Exam in 3 days", time: "2h ago", type: "warning", read: false },
  { id: 3, title: "Streak Saved", message: "You completed your daily goal!", time: "5h ago", type: "info", read: true },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/pomodoro": "Pomodoro",
  "/notes": "Notes",
  "/links": "Saved Links",
  "/flashcards": "Flashcards",
  "/planner": "Study Planner",
  "/assignments": "Assignments",
  "/exams": "Exams",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "FocusHub";
  const { profile, updateProfile, openProfile } = useUser();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-[#10b981]" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />;
      case "info": return <Info className="h-4 w-4 text-[#4f46e5]" />;
    }
  };

  // Dispatch custom event for MobileShell to open drawer
  const handleHamburgerClick = () => {
    window.dispatchEvent(new CustomEvent("open-mobile-drawer"));
  };

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 lg:px-6 transition-colors duration-300">
      {/* Left — Hamburger (mobile) + Page title */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleHamburgerClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200 transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-[#111827] dark:text-white transition-colors duration-300">{title}</h1>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search bar — hidden on mobile */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-52 rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 pl-9 pr-3 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none transition-colors focus:border-[#4f46e5] focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            const nextTheme = profile.theme === "light" ? "dark" : profile.theme === "dark" ? "ultra-dark" : "light";
            updateProfile({ theme: nextTheme });
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200 transition-colors"
          title={`Theme: ${profile.theme}`}
        >
          {profile.theme === "light" ? <Sun className="h-4 w-4" /> : profile.theme === "dark" ? <Moon className="h-4 w-4" /> : <Moon className="h-4 w-4 fill-current text-indigo-400" />}
        </button>

        {/* Notification icon & dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              showDropdown ? "bg-[#f7f7f8] dark:bg-slate-800 text-[#111827] dark:text-slate-200" : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
            }`}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ef4444]" />
            )}
          </button>

          {/* Dropdown Panel */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-xl border border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg focus:outline-none">
              <div className="flex items-center justify-between border-b border-[#f3f4f6] dark:border-slate-700 px-4 py-3">
                <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-[#4f46e5] dark:text-indigo-400 hover:text-[#4338ca] dark:hover:text-indigo-300 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-[#9ca3af] dark:text-slate-500">
                    No notifications
                  </div>
                ) : (
                  <ul className="divide-y divide-[#f3f4f6] dark:divide-slate-700">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`group relative flex cursor-pointer gap-3 p-4 transition-colors hover:bg-[#fafafa] dark:hover:bg-slate-700/50 ${
                          !notification.read ? "bg-[#4f46e5]/[0.02] dark:bg-[#4f46e5]/10" : ""
                        }`}
                      >
                        {!notification.read && (
                          <div className="absolute left-0 top-0 h-full w-0.5 bg-[#4f46e5]" />
                        )}
                        <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          notification.type === "success" ? "bg-[#10b981]/10 dark:bg-[#10b981]/20" :
                          notification.type === "warning" ? "bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20" : "bg-[#4f46e5]/10 dark:bg-[#4f46e5]/20"
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${!notification.read ? "text-[#111827] dark:text-white" : "text-[#4b5563] dark:text-slate-400"}`}>
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[#6b7280] truncate">
                            {notification.message}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-[#9ca3af]">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#4f46e5] self-center" />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <button 
          onClick={openProfile}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-700 text-lg transition-transform hover:scale-110 shadow-sm"
        >
          {profile.avatar}
        </button>
      </div>
    </header>
  );
}
