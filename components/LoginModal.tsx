"use client";

import { useUser } from "@/contexts/UserContext";
import { X, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useUser();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl relative border border-[#e5e7eb] dark:border-slate-800"
          >
            <button 
              onClick={closeLoginModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-14 h-14 bg-[#4f46e5]/10 dark:bg-[#4f46e5]/20 text-[#4f46e5] dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5">
                <LockKeyhole className="w-7 h-7" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight mb-2">
                Login to continue
              </h2>
              <p className="text-[#6b7280] dark:text-slate-400 mb-8 px-4 text-sm">
                Save your progress and start your streak 🔥
              </p>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => {
                    closeLoginModal();
                    router.push("/login");
                  }}
                  className="w-full bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-semibold py-3.5 rounded-xl hover:scale-[1.02] transition-transform shadow-sm"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    closeLoginModal();
                    router.push("/signup");
                  }}
                  className="w-full bg-transparent border border-[#e5e7eb] dark:border-slate-700 text-[#111827] dark:text-white font-semibold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
