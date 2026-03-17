import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import ProfileModal from "@/components/ProfileModal";
import MobileShell from "@/components/MobileShell";

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-white dark:bg-slate-950 text-[#111827] dark:text-slate-200 antialiased transition-colors duration-300">
        <UserProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar — hidden on mobile */}
            <Sidebar />

            {/* Main */}
            <div className="flex flex-1 flex-col ml-0 lg:ml-[260px]">
              <Navbar />
              <main className="flex-1 overflow-y-auto bg-[#f7f7f8] dark:bg-slate-950 p-4 lg:p-6 pb-20 lg:pb-6 transition-colors duration-300">
                {children}
              </main>
            </div>
          </div>

          {/* Mobile navigation components */}
          <MobileShell />
          
          <ProfileModal />
        </UserProvider>
      </body>
    </html>
  );
}
