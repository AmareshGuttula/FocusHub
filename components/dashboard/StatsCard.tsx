import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  colorClass: string;
}

export default function StatsCard({ icon: Icon, value, label, colorClass }: StatsCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-soft transition-transform hover:-translate-y-1">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-[#111827] dark:text-white tabular-nums leading-none">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
