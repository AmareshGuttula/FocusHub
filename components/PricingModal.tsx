"use client";

import { useUser } from "@/contexts/UserContext";
import { X, Check, Zap, Sparkles, Star, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMPARISON = [
  { feature: "Tasks",           free: "5/day",  pro: "Unlimited" },
  { feature: "Notes",           free: "3",      pro: "Unlimited" },
  { feature: "Flashcards",      free: "5",      pro: "Unlimited" },
  { feature: "Exams",           free: "3",      pro: "Unlimited" },
  { feature: "Pomodoro Timer",  free: true,     pro: true },
  { feature: "Analytics",       free: false,    pro: true },
  { feature: "Export Data",     free: false,    pro: true },
  { feature: "Priority Support",free: false,    pro: true },
];

export default function PricingModal() {
  const { isPricingModalOpen, closePricingModal, upgradeToPro } = useUser();
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleUpgrade = () => {
    setUpgrading(true);
    // Simulate payment success
    setTimeout(() => {
      upgradeToPro();
      setUpgrading(false);
      closePricingModal();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isPricingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closePricingModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={closePricingModal}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-400 dark:text-slate-500 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-2 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
                Upgrade to Pro
              </h2>
              <p className="text-sm text-[#6b7280] dark:text-slate-400 mt-1.5">
                Unlock unlimited everything
              </p>
            </div>

            {/* Plan Cards */}
            <div className="px-7 pt-5 pb-3 grid grid-cols-2 gap-3">
              {/* Monthly */}
              <button
                onClick={() => setSelected("monthly")}
                className={`relative rounded-2xl p-5 text-left transition-all duration-200 border-2 ${
                  selected === "monthly"
                    ? "border-violet-500 dark:border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg shadow-violet-500/10"
                    : "border-[#e5e7eb] dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"
                }`}
              >
                <p className="text-xs font-bold text-[#6b7280] dark:text-slate-400 mb-3">
                  Monthly
                </p>
                <p className="text-3xl font-extrabold text-[#111827] dark:text-white leading-none">
                  ₹99
                  <span className="text-sm font-medium text-[#9ca3af] dark:text-slate-500">/mo</span>
                </p>
                <p className="text-xs text-[#9ca3af] dark:text-slate-500 mt-2">₹1,188 per year</p>
              </button>

              {/* Yearly */}
              <button
                onClick={() => setSelected("yearly")}
                className={`relative rounded-2xl p-5 text-left transition-all duration-200 border-2 ${
                  selected === "yearly"
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg shadow-violet-500/10"
                    : "border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-500/5 hover:border-violet-400"
                }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  Best Value
                </div>
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-3">
                  Yearly
                </p>
                <p className="text-3xl font-extrabold text-[#111827] dark:text-white leading-none">
                  ₹999
                  <span className="text-sm font-medium text-violet-500">/yr</span>
                </p>
                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-2">
                  ₹83/mo · You save ₹189
                </p>
              </button>
            </div>

            {/* Comparison */}
            <div className="px-7 pt-3 pb-2">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white mb-3">
                Free vs Pro
              </h3>

              <div className="rounded-2xl border border-[#e5e7eb] dark:border-slate-800 overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[1fr_80px_80px] bg-[#f9fafb] dark:bg-slate-800/60 px-5 py-3 border-b border-[#e5e7eb] dark:border-slate-800">
                  <span className="text-xs font-bold text-[#6b7280] dark:text-slate-400 uppercase tracking-wider">Feature</span>
                  <span className="text-xs font-bold text-[#6b7280] dark:text-slate-400 text-center uppercase tracking-wider">Free</span>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 text-center uppercase tracking-wider">Pro</span>
                </div>

                {/* Rows */}
                {COMPARISON.map((row, idx) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-[1fr_80px_80px] px-5 py-3 items-center ${
                      idx < COMPARISON.length - 1 ? "border-b border-[#f3f4f6] dark:border-slate-800/60" : ""
                    } ${idx % 2 === 1 ? "bg-[#fafafa] dark:bg-slate-800/20" : ""}`}
                  >
                    <span className="text-sm text-[#111827] dark:text-slate-200">{row.feature}</span>

                    {/* Free */}
                    <div className="flex justify-center">
                      {row.free === false ? (
                        <Lock className="w-4 h-4 text-gray-300 dark:text-slate-700" />
                      ) : row.free === true ? (
                        <Check className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      ) : (
                        <span className="text-sm font-medium text-[#6b7280] dark:text-slate-400">{row.free}</span>
                      )}
                    </div>

                    {/* Pro */}
                    <div className="flex justify-center">
                      {row.pro === true ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">{row.pro}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="px-7 pb-7 pt-4 space-y-2.5">
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base py-4 rounded-2xl hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.01] transition-all active:scale-[0.99] disabled:opacity-80"
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing payment...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4.5 h-4.5 inline mr-2 -mt-0.5" />
                    {selected === "yearly"
                      ? "Get Pro — ₹999/year"
                      : "Get Pro — ₹99/month"
                    }
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[#b0b0b0] dark:text-slate-600">
                Cancel anytime · Instant access · No hidden fees
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
