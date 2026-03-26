"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fakeGetSession } from "@/lib/fakeAuth";

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = fakeGetSession();
    if (session && session.is_onboarded) {
      router.replace("/dashboard");
    }
    // If no session or not onboarded, stay on this page — Onboarding will show
    setChecked(true);
  }, [router]);

  // Show nothing until we've checked session (prevents flash)
  if (!checked) return null;

  // The Onboarding component (rendered via layout.tsx) handles the signup flow
  return null;
}
