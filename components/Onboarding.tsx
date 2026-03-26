"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = ["welcome", "name", "email", "password", "complete"] as const;

export default function Onboarding() {
  const { profile, signup } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [wantsPassword, setWantsPassword] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Don't show onboarding if already onboarded or logged in (unless in completing state)
  if (!completing && (profile.isOnboarded || profile.isLoggedIn)) return null;

  const currentStep = steps[step];

  const nextStep = () => {
    setError("");
    if (currentStep === "name" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (currentStep === "email") {
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleComplete = async () => {
    setError("");
    setLoading(true);

    const pw = wantsPassword ? password : null;
    if (wantsPassword && !password.trim()) {
      setError("Please enter a password");
      setLoading(false);
      return;
    }

    // Show success animation briefly as we redirect
    setCompleting(true);
    setStep(4);
    
    // Execute signup and redirect instantly
    await signup(name.trim(), email.trim(), pw);
    router.push("/dashboard");
    setLoading(false);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white dark:bg-slate-950">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Welcome ─── */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111827] dark:bg-white mb-6">
                <Sparkles className="h-8 w-8 text-white dark:text-[#111827]" />
              </div>
              <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-3">
                Welcome to FocusHub
              </h1>
              <p className="text-[#6b7280] dark:text-slate-400 leading-relaxed mb-8">
                Build daily habits.<br />
                Track your streak.<br />
                Earn rewards.
              </p>
              <button
                onClick={nextStep}
                className="w-full bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="mt-6 text-sm text-[#9ca3af] dark:text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-[#111827] dark:text-white font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            </motion.div>
          )}

          {/* ─── STEP 2: Name ─── */}
          {currentStep === "name" && (
            <motion.div
              key="name"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <button onClick={prevStep} className="text-[#6b7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white flex items-center gap-1 text-sm mb-8 w-fit">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
                What's your name?
              </h2>
              <p className="text-sm text-[#6b7280] dark:text-slate-400 mb-6">
                This is how we'll greet you.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Enter your name"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] dark:border-slate-700 bg-transparent text-[#111827] dark:text-white text-sm outline-none focus:border-[#111827] dark:focus:border-white transition-colors placeholder:text-[#9ca3af]"
                onKeyDown={(e) => e.key === "Enter" && nextStep()}
              />
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <button
                onClick={nextStep}
                className="w-full mt-6 bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 3: Email ─── */}
          {currentStep === "email" && (
            <motion.div
              key="email"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <button onClick={prevStep} className="text-[#6b7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white flex items-center gap-1 text-sm mb-8 w-fit">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
                What's your email?
              </h2>
              <p className="text-sm text-[#6b7280] dark:text-slate-400 mb-6">
                You'll use this to log in later.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Enter your email"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] dark:border-slate-700 bg-transparent text-[#111827] dark:text-white text-sm outline-none focus:border-[#111827] dark:focus:border-white transition-colors placeholder:text-[#9ca3af]"
                onKeyDown={(e) => e.key === "Enter" && nextStep()}
              />
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <button
                onClick={nextStep}
                className="w-full mt-6 bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 4: Password ─── */}
          {currentStep === "password" && (
            <motion.div
              key="password"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <button onClick={prevStep} className="text-[#6b7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white flex items-center gap-1 text-sm mb-8 w-fit">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
                Create a password
              </h2>
              <p className="text-sm text-[#6b7280] dark:text-slate-400 mb-6">
                Optional — skip if you want to log in with email only.
              </p>

              {wantsPassword === null ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setWantsPassword(true)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#e5e7eb] dark:border-slate-700 text-sm font-medium text-[#111827] dark:text-white hover:bg-[#f9fafb] dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    🔒 Create a password
                  </button>
                  <button
                    onClick={() => {
                      setWantsPassword(false);
                      handleComplete();
                    }}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#e5e7eb] dark:border-slate-700 text-sm font-medium text-[#6b7280] dark:text-slate-400 hover:bg-[#f9fafb] dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    ⏭ Skip — log in with email only
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter a password"
                      autoFocus
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-[#e5e7eb] dark:border-slate-700 bg-transparent text-[#111827] dark:text-white text-sm outline-none focus:border-[#111827] dark:focus:border-white transition-colors placeholder:text-[#9ca3af]"
                      onKeyDown={(e) => e.key === "Enter" && handleComplete()}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="w-full mt-6 bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                  <button
                    onClick={() => { setWantsPassword(null); setPassword(""); }}
                    className="mt-3 text-sm text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                  >
                    ← Go back to options
                  </button>
                </>
              )}
              {error && wantsPassword === null && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </motion.div>
          )}

          {/* ─── STEP 5: Complete ─── */}
          {currentStep === "complete" && (
            <motion.div
              key="complete"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 mb-6"
              >
                <Check className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
                You're all set, {name.split(" ")[0]}!
              </h2>
              <p className="text-sm text-[#6b7280] dark:text-slate-400 mb-2">
                Your free account is ready.
              </p>
              <p className="text-xs text-[#9ca3af] dark:text-slate-500">
                Taking you to the dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-[#111827] dark:bg-white"
                  : i < step
                  ? "w-1.5 bg-[#6b7280]"
                  : "w-1.5 bg-[#d1d5db] dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
