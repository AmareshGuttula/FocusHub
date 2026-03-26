"use client";

import { useState, useEffect } from "react";
import { User, Bell, Palette, LogOut, Crown, CreditCard } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { useRouter } from "next/navigation";

const notificationToggles = [
  { id: "task_reminders", label: "Task reminders", description: "Get notified when a task is due", defaultEnabled: true },
  { id: "exam_alerts", label: "Exam alerts", description: "Receive alerts before upcoming exams", defaultEnabled: true },
  { id: "weekly_summary", label: "Weekly summary", description: "Get a weekly study report", defaultEnabled: false },
  { id: "pomodoro_sounds", label: "Pomodoro sounds", description: "Play sound when timer ends", defaultEnabled: true },
];

export default function SettingsPage() {
  const { profile, updateProfile, openProfile, logout, openPricingModal } = useUser();
  const { clearTimer } = usePomodoro();
  const router = useRouter();
  
  // Local state for profile form
  const [name, setName] = useState(profile.name);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state if profile contextual data changes via modal
  useEffect(() => {
    setName(profile.name);
    setSoundEnabled(profile.soundEnabled);
  }, [profile]);

  const handleSaveProfile = () => {
    setIsSaving(true);
    updateProfile({ name, soundEnabled });
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile updated successfully!");
    }, 600);
  };

  const toggleToggle = (id: string) => {
    const newNotifications = { 
      ...profile.notifications, 
      [id]: !profile.notifications[id] 
    };
    updateProfile({ notifications: newNotifications });
  };

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = () => {
    clearTimer();
    logout();
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white transition-colors duration-300">Settings</h1>
        <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400 transition-colors duration-300">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors duration-300 shadow-soft">
        <div className="flex items-center gap-2 mb-5">
          <User className="h-4 w-4 text-[#6b7280] dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div 
            onClick={openProfile}
            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-800 text-3xl shadow-inner hover:scale-105 transition-transform"
          >
            {profile.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-white transition-colors duration-300">{profile.name}</p>
            <p className="text-xs text-[#6b7280] dark:text-slate-400 transition-colors duration-300">{profile.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#111827] dark:text-slate-200 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:ring-1 focus:ring-[#4f46e5]/20 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-1">Email (read-only)</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f3f4f6] dark:bg-slate-800 px-3 py-2 text-sm text-[#9ca3af] dark:text-slate-500 outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400">Sound Feedback</label>
              <div
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative h-6 w-10 rounded-full transition-colors cursor-pointer ${
                  soundEnabled ? "bg-[#4f46e5]" : "bg-[#d1d5db] dark:bg-slate-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    soundEnabled ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
            <p className="text-[10px] text-[#9ca3af] dark:text-slate-500">Play soft sounds for tasks and achievements</p>
          </div>
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#4338ca] transition-colors disabled:opacity-70 shadow-sm shadow-[#4f46e5]/20"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors duration-300 shadow-soft">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="h-4 w-4 text-[#6b7280] dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">Plan</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.isPro ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
                <Crown className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f4f6] dark:bg-slate-800 text-[#6b7280] dark:text-slate-400">
                <CreditCard className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-white">
                {profile.isPro ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-xs text-[#6b7280] dark:text-slate-400">
                {profile.isPro ? "All features unlocked" : "5 tasks per day · Limited features"}
              </p>
            </div>
          </div>
          {!profile.isPro && (
            <button
              onClick={openPricingModal}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-violet-500/20 transition-all"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors duration-300 shadow-soft">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-4 w-4 text-[#6b7280] dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">
            Notifications
          </h3>
        </div>
        <div className="space-y-4">
          {notificationToggles.map((toggle) => (
            <div
              key={toggle.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[#111827] dark:text-slate-200 transition-colors duration-300">
                  {toggle.label}
                </p>
                <p className="text-xs text-[#6b7280] dark:text-slate-400 transition-colors duration-300">{toggle.description}</p>
              </div>
              <div
                onClick={() => toggleToggle(toggle.id)}
                className={`relative h-6 w-10 rounded-full transition-colors cursor-pointer ${
                  profile.notifications[toggle.id] ? "bg-[#4f46e5]" : "bg-[#d1d5db] dark:bg-slate-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    profile.notifications[toggle.id] ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors duration-300 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-[#6b7280] dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#111827] dark:text-slate-200 transition-colors duration-300">Theme</p>
            <p className="text-xs text-[#6b7280] dark:text-slate-400 transition-colors duration-300">Choose your preferred theme</p>
          </div>
          <div className="flex gap-2">
            <div 
              onClick={() => updateProfile({ theme: "light" })}
              className={`flex h-9 items-center gap-2 rounded-lg ${profile.theme === "light" ? "border-2 border-[#4f46e5]" : "border border-[#e5e7eb] dark:border-slate-700 opacity-60 hover:opacity-100"} bg-white dark:bg-slate-800 px-3 cursor-pointer transition-colors duration-300`}
            >
              <div className="h-4 w-4 rounded-full border border-[#e5e7eb] dark:border-slate-600 bg-white" />
              <span className="text-xs font-medium text-[#111827] dark:text-slate-200">Light</span>
            </div>
            <div 
              onClick={() => updateProfile({ theme: "dark" })}
              className={`flex h-9 items-center gap-2 rounded-lg ${profile.theme === "dark" ? "border-2 border-[#4f46e5]" : "border border-[#e5e7eb] dark:border-slate-700 opacity-60 hover:opacity-100"} bg-[#f7f7f8] dark:bg-slate-900 px-3 cursor-pointer transition-colors duration-300`}
            >
              <div className="h-4 w-4 rounded-full bg-[#1f2937] dark:bg-[#1f2937] border border-slate-700 dark:border-slate-600" />
              <span className="text-xs font-medium text-[#6b7280] dark:text-slate-400">Dark</span>
            </div>
            <div 
              onClick={() => updateProfile({ theme: "ultra-dark" })}
              className={`flex h-9 items-center gap-2 rounded-lg ${profile.theme === "ultra-dark" ? "border-2 border-[#4f46e5]" : "border border-[#e5e7eb] dark:border-slate-700 opacity-60 hover:opacity-100"} bg-[#f7f7f8] dark:bg-[#0a0a0a] px-3 cursor-pointer transition-colors duration-300`}
            >
              <div className="h-4 w-4 rounded-full bg-black border border-slate-800" />
              <span className="text-xs font-medium text-[#6b7280] dark:text-slate-400">Ultra Dark</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors duration-300 shadow-soft">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#fecaca] dark:border-red-500/30 bg-[rgba(239,68,68,0.04)] dark:bg-red-500/10 px-4 py-2.5 text-sm font-medium text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] dark:hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex animate-bounce-in items-center gap-2 rounded-xl bg-[#111827] px-4 py-3 text-sm font-medium text-white shadow-xl">
          <User className="h-4 w-4 text-[#10b981]" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
