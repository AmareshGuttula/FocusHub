"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Trophy, Star, Flame, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import confetti from "canvas-confetti";

export default function DailyMissions() {
  const { missions, claimDailyReward } = useUser();
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const missionList = [
    {
      id: "tasks",
      name: "Complete 3 Tasks",
      progress: missions.tasks_completed_today,
      total: 3,
      icon: <CheckCircle2 className="w-4 h-4" />,
      unit: "completed",
    },
    {
      id: "study",
      name: "Study 60 Minutes",
      progress: missions.focus_minutes_today,
      total: 60,
      icon: <Zap className="w-4 h-4" />,
      unit: "min",
    },
    {
      id: "streak",
      name: "Maintain Streak",
      progress: missions.streak_maintained ? 1 : 0,
      total: 1,
      icon: <Flame className="w-4 h-4" />,
      unit: "",
    },
  ];

  const allCompleted = missionList.every((m) => m.progress >= m.total);

  useEffect(() => {
    if (allCompleted && !missions.reward_claimed) {
      // Auto-claim reward if all completed
      claimDailyReward();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4f46e5", "#818cf8", "#c7d2fe"],
      });
    }
  }, [allCompleted, missions.reward_claimed, claimDailyReward]);

  return (
    <div className="bg-white dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold text-[#37352f] dark:text-[#ffffffcf] tracking-tight">
          Daily Missions
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[11px] font-semibold text-[#787774] dark:text-[#9b9b9b]">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {missionList.filter(m => m.progress >= m.total).length}/{missionList.length}
        </div>
      </div>

      <div className="space-y-6">
        {missionList.map((mission) => {
          const isDone = mission.progress >= mission.total;
          const percentage = Math.min(100, (mission.progress / mission.total) * 100);

          return (
            <div key={mission.id} className="group relative">
              <div className="flex items-start gap-3 mb-2">
                <div className={`mt-0.5 transition-colors duration-300 ${isDone ? "text-emerald-500" : "text-[#d1d5db] dark:text-slate-600"}`}>
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 className="w-5 h-5 fill-emerald-50" />
                    </motion.div>
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[14px] font-medium transition-all ${isDone ? "text-[#787774] dark:text-[#6b6b6b] line-through" : "text-[#37352f] dark:text-[#ffffffcf]"}`}>
                      {mission.name}
                    </span>
                    <span className="text-[12px] tabular-nums font-semibold text-[#787774] dark:text-[#9b9b9b]">
                      {mission.id === 'streak' ? (isDone ? "Completed" : "0 / 1") : `${mission.progress} / ${mission.total} ${mission.unit}`}
                    </span>
                  </div>

                  {mission.total > 1 && (
                    <div className="h-1.5 w-full bg-[#f1f1ef] dark:bg-[#2c2c2c] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isDone ? "bg-emerald-500" : "bg-[#4f46e5]"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reward Section */}
      <div className="mt-8 pt-5 border-t border-[#f1f1ef] dark:border-[#2f2f2f]">
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
          missions.reward_claimed 
            ? "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20" 
            : allCompleted
            ? "bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 animate-pulse"
            : "bg-[#fafafa] dark:bg-[#1a1a1a] border-[#e9e9e7] dark:border-[#2f2f2f]"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              missions.reward_claimed 
                ? "bg-emerald-500 text-white" 
                : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            }`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#37352f] dark:text-[#ffffffcf]">
                {missions.reward_claimed ? "Daily Bonus Earned" : "Reward:"}
              </p>
              <p className={`text-[12px] font-medium ${missions.reward_claimed ? "text-emerald-600 dark:text-emerald-400" : "text-[#787774] dark:text-[#9b9b9b]"}`}>
                {missions.reward_claimed ? "Claimed +50 Points" : "+50 points bonus"}
              </p>
            </div>
          </div>
          
          <AnimatePresence>
            {allCompleted && !missions.reward_claimed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={claimDailyReward}
                className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[12px] font-bold rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
              >
                Claim Now
              </motion.button>
            )}
          </AnimatePresence>
          
          {missions.reward_claimed && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[12px] font-bold uppercase tracking-wider">Done</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
