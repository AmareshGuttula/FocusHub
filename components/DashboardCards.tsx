import { CheckSquare, Timer, Flame, GraduationCap } from "lucide-react";

const cards = [
  {
    title: "Tasks Due Today",
    value: "5",
    subtitle: "2 high priority",
    icon: CheckSquare,
    color: "#4f46e5",
    bg: "rgba(79,70,229,0.08)",
  },
  {
    title: "Focus Time Today",
    value: "3h 20m",
    subtitle: "4 sessions completed",
    icon: Timer,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    title: "Study Streak",
    value: "7 days",
    subtitle: "Personal best! 🔥",
    icon: Flame,
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
  },
  {
    title: "Upcoming Exams",
    value: "3",
    subtitle: "Next: Mar 24",
    icon: GraduationCap,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lg:p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:border-[#d1d5db] dark:hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-slate-400">
                {card.title}
              </p>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: card.bg }}
              >
                <Icon className="h-4 w-4" style={{ color: card.color }} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827] dark:text-white transition-colors duration-300">
              {card.value}
            </p>
            <p className="mt-0.5 text-xs text-[#6b7280] dark:text-slate-400">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
