// Card container
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  onClick?: () => void;
}

export default function Card({ children, className, hover, padding = "md", onClick }: CardProps) {
  const paddings = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-surface-border shadow-card",
        paddings[padding],
        hover && "hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
