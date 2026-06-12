// Progress bar
import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md";
  color?: "blue" | "green" | "orange" | "purple";
  className?: string;
}

const colors = {
  blue: "bg-brand",
  green: "bg-success",
  orange: "bg-warning",
  purple: "bg-purple-500",
};

export default function ProgressBar({ value, max = 100, label, showPercent, size = "md", color = "blue", className }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-500">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-slate-700">{percent}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2.5")}>
        <div className={cn("h-full rounded-full transition-all duration-500", colors[color])} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
