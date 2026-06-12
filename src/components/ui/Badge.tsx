// Badge / tag
import { cn } from "@/lib/utils/cn";
import type { CefrLevel } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  level?: CefrLevel;
  className?: string;
}

const levelStyles: Record<CefrLevel, string> = {
  A1: "bg-green-100 text-green-700",
  A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-purple-100 text-purple-700",
  C1: "bg-orange-100 text-orange-700",
  C2: "bg-red-100 text-red-700",
};

const variantStyles = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-700",
};

export default function Badge({ children, variant = "default", level, className }: BadgeProps) {
  const style = level ? levelStyles[level] : variantStyles[variant];

  return <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", style, className)}>{children}</span>;
}
