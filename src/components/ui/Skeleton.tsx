// Loading skeleton
import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export default function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={cn("animate-pulse bg-slate-200 rounded-md h-4", i === lines - 1 && "w-3/4", className)} />
        ))}
      </div>
    );
  }

  return <div className={cn("animate-pulse bg-slate-200 rounded-md h-4", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-surface-border p-6 space-y-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton lines={3} />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
