import { LucideIcon, Play, Clock, Star, Award, Flame, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface DailyQuestProps {
  title: string;
  description: string;
  rewardText: string;
  rewardType: "points" | "streak";
  progress: number;
  total: number;
  timeRemaining: string;
  href?: string;
  onClick?: () => void;
}

export default function DailyQuest({
  title,
  description,
  rewardText,
  rewardType,
  progress,
  total,
  timeRemaining,
  href,
  onClick
}: DailyQuestProps) {
  const isCompleted = progress >= total;
  const percentage = Math.min(100, Math.round((progress / total) * 100));

  const RewardIcon = rewardType === "points" ? Star : Flame;

  // Minimal tag colors (Notion style)
  const tagColor = 
    isCompleted ? "bg-[#e5f5e0] text-[#0f5132]" :
    rewardType === "points" ? "bg-[#fdf3c7] text-[#854d0e]" :
    "bg-[#fee2e2] text-[#991b1b]";

  const content = (
    <div className={`group flex flex-col p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
      isCompleted 
        ? "bg-[#fafafa] dark:bg-slate-900/50 border-[#e9e9e7] dark:border-slate-800 opacity-80 hover:opacity-100" 
        : "bg-white dark:bg-[#191919] border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#d4d4d2] dark:hover:border-[#3f3f3f] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    }`}>
      
      {/* Top Header: Title & Tag */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className={`text-[14px] font-semibold leading-snug tracking-tight ${isCompleted ? 'text-[#787774] dark:text-[#9b9b9b] line-through decoration-[#c3c2bf]' : 'text-[#37352f] dark:text-[#ffffffcf]'}`}>
          {title}
        </h4>
        <div className={`shrink-0 px-2 py-0.5 rounded-[4px] text-[11px] font-medium tracking-wide ${tagColor}`}>
          {rewardText}
        </div>
      </div>

      {/* Description */}
      <p className={`text-[12px] leading-relaxed mb-4 ${isCompleted ? 'text-[#9b9a97] dark:text-[#6b6b6b]' : 'text-[#787774] dark:text-[#9b9b9b]'}`}>
        {description}
      </p>

      {/* Bottom Footer: Progress & Action */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f1f1ef] dark:border-[#2f2f2f]/50">
        {/* Progress Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#787774] dark:text-[#9b9b9b]">
            {isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <RewardIcon className="w-3.5 h-3.5 opacity-60" />
            )}
            <span>{progress} / {total}</span>
          </div>

          {!isCompleted && timeRemaining && (
            <div className="flex items-center gap-1 text-[11px] text-[#9b9a97] dark:text-[#6b6b6b]">
              <Clock className="w-3 h-3" />
              {timeRemaining}
            </div>
          )}
        </div>

        {/* Action Button */}
        {isCompleted ? (
           <span className="text-[12px] font-medium text-[#787774] dark:text-[#6b6b6b] px-1">
             Claimed
           </span>
        ) : (
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[12px] font-medium tracking-wide text-[#37352f] dark:text-[#d4d4d4] hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Play className="w-3 h-3 fill-current opacity-70" />
            Start
          </button>
        )}
      </div>

    </div>
  );

  if (href) {
    return <Link href={href} className="block group/link">{content}</Link>;
  }

  return <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>{content}</div>;
}
