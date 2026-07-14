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
  A1: "bg-stamp-teal/15 text-stamp-teal",
  A2: "bg-stamp-teal/25 text-stamp-teal",
  B1: "bg-ink-navy/10 text-ink-navy",
  B2: "bg-ink-navy/20 text-ink-navy",
  C1: "bg-gold-foil/20 text-[#8A6425]",
  C2: "bg-airmail/20 text-airmail-dark",
};

const variantStyles = {
  default: "bg-postcard-dark text-ink-muted",
  success: "bg-stamp-teal/15 text-stamp-teal",
  warning: "bg-gold-foil/20 text-[#8A6425]",
  error: "bg-airmail/20 text-airmail-dark",
  info: "bg-ink-navy/10 text-ink-navy",
};

export default function Badge({ children, variant = "default", level, className }: BadgeProps) {
  const style = level ? levelStyles[level] : variantStyles[variant];

  return <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", style, className)}>{children}</span>;
}
