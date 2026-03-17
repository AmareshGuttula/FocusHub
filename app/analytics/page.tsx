"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock, CheckCircle2, Timer } from "lucide-react";

const weeklyStudyData = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 3.0 },
  { day: "Wed", hours: 5.2 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 4.0 },
  { day: "Sat", hours: 6.0 },
  { day: "Sun", hours: 3.5 },
];

const pomodoroData = [
  { day: "Mon", sessions: 6 },
  { day: "Tue", sessions: 4 },
  { day: "Wed", sessions: 8 },
  { day: "Thu", sessions: 3 },
  { day: "Fri", sessions: 5 },
  { day: "Sat", sessions: 9 },
  { day: "Sun", sessions: 4 },
];

const tasksData = [
  { day: "Mon", completed: 5 },
  { day: "Tue", completed: 3 },
  { day: "Wed", completed: 7 },
  { day: "Thu", completed: 4 },
  { day: "Fri", completed: 6 },
  { day: "Sat", completed: 8 },
  { day: "Sun", completed: 2 },
];

const stats = [
  {
    label: "Total Study Hours",
    value: "29h",
    change: "+12%",
    icon: Clock,
    color: "#4f46e5",
    bg: "rgba(79,70,229,0.08)",
  },
  {
    label: "Pomodoro Sessions",
    value: "39",
    change: "+8%",
    icon: Timer,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    label: "Tasks Completed",
    value: "35",
    change: "+15%",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs shadow-lg transition-colors">
      <p className="font-medium text-[#111827] dark:text-slate-200">{label}</p>
      <p className="text-[#6b7280] dark:text-slate-400">{payload[0].value}</p>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-slate-400 transition-colors">
                  {stat.label}
                </p>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#111827] dark:text-white transition-colors">{stat.value}</p>
              <p className="mt-0.5 text-xs text-[#10b981]">{stat.change} vs last week</p>
            </div>
          );
        })}
      </div>

      {/* Weekly Study Hours — Bar Chart */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-colors duration-300">
        <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200 mb-4 transition-colors">
          Weekly Study Hours
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyStudyData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} unit="h" />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,70,229,0.04)" }} />
            <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Pomodoro Sessions — Line Chart */}
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-colors duration-300">
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200 mb-4 transition-colors">
            Pomodoro Sessions
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={pomodoroData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks Completed — Bar Chart */}
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-colors duration-300">
          <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200 mb-4 transition-colors">
            Tasks Completed
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tasksData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16,185,129,0.04)" }} />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
