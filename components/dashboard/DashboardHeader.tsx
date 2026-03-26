"use client";

import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHeader() {
  const { profile, streakRewardMsg } = useUser();
  const [greeting, setGreeting] = useState("Good Morning");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    setDateStr(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="mb-6 mt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white tracking-tight">
          {greeting}, {profile.name.split(" ")[0]} 👋
        </h1>
        {dateStr && (
          <p className="mt-1 text-sm font-medium text-[#6b7280] dark:text-slate-400 transition-colors duration-300">
            {dateStr} — Let's make today count.
          </p>
        )}
      </div>

      <AnimatePresence>
        {streakRewardMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl"
          >
            <span className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <span>{streakRewardMsg.split(" ")[0]}</span>
              <span>{streakRewardMsg.split(" ").slice(1).join(" ")}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
