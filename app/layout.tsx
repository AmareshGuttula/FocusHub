import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import ProfileModal from "@/components/ProfileModal";

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
      <body className="bg-white dark:bg-slate-950 text-[#111827] dark:text-slate-200 antialiased transition-colors duration-300">
        <UserProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex flex-1 flex-col ml-[260px]">
              <Navbar />
              <main className="flex-1 overflow-y-auto bg-[#f7f7f8] dark:bg-slate-950 p-6 transition-colors duration-300">
                {children}
              </main>
            </div>
          </div>
          
          <ProfileModal />
        </UserProvider>
      </body>
    </html>
  );
}
