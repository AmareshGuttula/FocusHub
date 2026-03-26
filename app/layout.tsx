import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import ProfileModal from "@/components/ProfileModal";
import MobileShell from "@/components/MobileShell";
import Onboarding from "@/components/Onboarding";
import LoginModal from "@/components/LoginModal";
import PricingModal from "@/components/PricingModal";
import PomodoroWidget from "@/components/PomodoroWidget";

export const metadata: Metadata = {
  title: "FocusHub — Student Productivity Dashboard",
  description:
    "A modern student productivity dashboard to manage tasks, notes, exams, and study sessions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-white dark:bg-slate-950 text-[#111827] dark:text-slate-200 antialiased transition-colors duration-300 h-full w-full flex overflow-hidden">
        <UserProvider>
          <PomodoroProvider>
          {/* Main Layout Wrapper */}
          <div className="flex h-screen w-full overflow-hidden bg-[#f7f7f8] dark:bg-slate-950">
            {/* Sidebar — hidden on mobile */}
            <div className="hidden lg:block h-full z-40 relative">
               <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col h-full overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto bg-[#f7f7f8] dark:bg-slate-950 p-4 lg:p-6 pb-20 lg:pb-6 transition-colors duration-300">
                {children}
              </main>
            </div>
          </div>

          <MobileShell />
          <ProfileModal />
          <Onboarding />
          <LoginModal />
          <PricingModal />
          <PomodoroWidget />
          </PomodoroProvider>
        </UserProvider>
      </body>
    </html>
  );
}

