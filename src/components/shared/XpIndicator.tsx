// XP and streak display
import { Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface XpIndicatorProps {
  xp: number;
  streak: number;
  className?: string;
}

export default function XpIndicator({ xp, streak, className }: XpIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-1.5 text-orange-500">
        <Flame className="w-4 h-4" />
        <span className="text-sm font-semibold">{streak} ngày</span>
      </div>
      <div className="flex items-center gap-1.5 text-brand">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-semibold">{xp} XP</span>
      </div>
    </div>
  );
}
