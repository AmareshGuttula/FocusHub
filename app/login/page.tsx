"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { fakeCheckEmail } from "@/lib/fakeAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, profile } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  if (profile.isLoggedIn) {
    router.push("/dashboard");
    return null;
  }

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setLoading(true);

    const { exists, hasPassword } = fakeCheckEmail(email);
    if (!exists) {
      setError("No account found with this email. Please sign up first.");
      setLoading(false);
      return;
    }

    if (hasPassword) {
      setNeedsPassword(true);
      setEmailChecked(true);
      setLoading(false);
    } else {
      // No password — login directly
      const result = await login(email);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed.");
      }
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailChecked) {
      handleCheckEmail();
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fefefe] dark:bg-[#0f1115] p-4 font-sans text-[#111827] dark:text-[#f3f4f6]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] flex flex-col items-center"
      >
        <Link href="/" className="mb-8 flex items-center justify-center flex-col gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827]">
            <Sparkles className="h-5 w-5" />
          </div>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-8 text-center">
          Enter your email to sign in
        </p>

        {error && (
          <div className="w-full mb-6 p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-950/20 dark:border-red-900/50 flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailChecked(false);
                setNeedsPassword(false);
                setError(null);
              }}
              placeholder="name@example.com"
              disabled={loading}
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-[#374151] bg-transparent outline-none focus:ring-2 focus:ring-[#111827]/10 dark:focus:ring-white/10 focus:border-[#111827] dark:focus:border-[#f3f4f6] transition-all text-sm placeholder:text-[#9ca3af] disabled:opacity-50"
            />
          </div>

          {needsPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-col gap-1.5"
            >
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••"
                  disabled={loading}
                  autoFocus
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-[#e5e7eb] dark:border-[#374151] bg-transparent outline-none focus:ring-2 focus:ring-[#111827]/10 dark:focus:ring-white/10 focus:border-[#111827] dark:focus:border-[#f3f4f6] transition-all text-sm placeholder:text-[#9ca3af] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-medium py-2.5 rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 h-10"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : needsPassword ? (
              "Login"
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-sm text-[#6b7280] dark:text-[#9ca3af]">
          Don't have an account?{" "}
          <Link href="/" className="text-[#111827] dark:text-white font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
