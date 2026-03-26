"use client";

import { ClipboardList, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  status: "not-started" | "in-progress" | "submitted";
  progress: number;
}

const assignments: Assignment[] = [
  { id: 1, title: "Data Structures — Binary Tree Implementation", subject: "Computer Science", deadline: "Mar 20", status: "in-progress", progress: 65 },
  { id: 2, title: "Organic Chemistry — Reaction Mechanisms Report", subject: "Chemistry", deadline: "Mar 22", status: "in-progress", progress: 30 },
  { id: 3, title: "French Revolution Essay", subject: "History", deadline: "Mar 18", status: "submitted", progress: 100 },
  { id: 4, title: "Thermodynamics Problem Set #4", subject: "Physics", deadline: "Mar 25", status: "not-started", progress: 0 },
  { id: 5, title: "Hamlet Character Analysis", subject: "English", deadline: "Mar 23", status: "in-progress", progress: 45 },
  { id: 6, title: "Eigenvalue Proofs Worksheet", subject: "Mathematics", deadline: "Mar 19", status: "submitted", progress: 100 },
];

const statusStyles = {
  "not-started": { label: "Not Started", text: "#6b7280", bg: "rgba(107,114,128,0.08)" },
  "in-progress": { label: "In Progress", text: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  submitted: { label: "Submitted", text: "#10b981", bg: "rgba(16,185,129,0.08)" },
};

const subjectColors: Record<string, string> = {
  "Computer Science": "#8b5cf6",
  Chemistry: "#10b981",
  History: "#f59e0b",
  Physics: "#ef4444",
  English: "#06b6d4",
  Mathematics: "#4f46e5",
};

export default function AssignmentsPage() {
  const { profile, checkAction, openPricingModal } = useUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white transition-colors">Assignments</h1>
        <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400 transition-colors">
          Track your assignment deadlines and progress
        </p>
      </div>

      <div className="space-y-3">
        {assignments.map((a, idx) => {
          const st = statusStyles[a.status];
          const subjectColor = subjectColors[a.subject] || "#6b7280";
          
          const handleAssignmentClick = () => {
             if (idx >= 4) {
                 checkAction(openPricingModal, true);
             }
          };

          return (
            <div
              key={a.id}
              onClick={handleAssignmentClick}
              className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-200 hover:shadow-card hover:border-[#d1d5db] dark:hover:border-slate-700 cursor-pointer relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div
                      className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${subjectColor}14` }}
                    >
                      <ClipboardList
                        className="h-4 w-4"
                        style={{ color: subjectColor }}
                      />
                    </div>
                    {idx >= 4 && !profile.isPro && (
                      <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 rounded-full border border-amber-100 dark:border-amber-900/50 p-0.5">
                          <Lock className="h-3 w-3 text-amber-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200 transition-colors">
                      {a.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6b7280] dark:text-slate-400 transition-colors">
                      {a.subject} · Due {a.deadline}
                    </p>
                  </div>
                </div>
                <span
                  className="rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                  style={{ color: st.text, backgroundColor: st.bg }}
                >
                  {st.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[#6b7280] dark:text-slate-400 mb-1.5 transition-colors">
                  <span>Progress</span>
                  <span>{a.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#f3f4f6] dark:bg-slate-800 transition-colors">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${a.progress}%`,
                      backgroundColor: a.progress === 100 ? "#10b981" : "#4f46e5",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
