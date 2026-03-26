import { LucideIcon, Play } from "lucide-react";
import Link from "next/link";

interface TaskRowProps {
  icon: LucideIcon;
  title: string;
  progress: number;
  time: string;
  iconColor: string;
  href?: string;
}

export default function TaskRow({ icon: Icon, title, progress, time, iconColor, href }: TaskRowProps) {
  const buttonContent = (
    <button className="flex h-8 w-8 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-[#111827] dark:text-slate-200 transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-700 shadow-sm cursor-pointer">
      <Play className="h-3.5 w-3.5 fill-current sm:hidden" />
      <span className="hidden sm:inline-block">Continue</span>
    </button>
  );

  return (
    <div className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-[#e5e7eb] hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-900 hover:shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800/50">
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        
        {/* Detail */}
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-sm font-semibold text-[#111827] dark:text-white truncate">
            {title}
          </h4>
          <div className="mt-1 flex items-center gap-3">
            <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: iconColor }}
              />
            </div>
            <span className="text-xs font-medium text-[#6b7280] dark:text-slate-400">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-block text-xs text-[#9ca3af] font-medium px-2.5 py-1 bg-gray-50 dark:bg-slate-800/50 rounded-md">
          {time}
        </span>
        {href ? <Link href={href}>{buttonContent}</Link> : buttonContent}
      </div>
    </div>
  );
}
