// Biểu đồ XP theo tuần — dựng bằng SVG/CSS thuần, không cần thêm thư viện chart
// mới (dự án hiện chưa cài recharts/chart.js).
//
// GET /users/me/progress trả về log thô từng hoạt động (mỗi lần hoàn thành 1
// flashcard/quiz...), không phải số liệu đã gộp theo ngày — nên component này
// tự gom nhóm 7 ngày gần nhất và cộng dồn xpEarned theo completedAt/updatedAt.
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { usersApi } from "@/lib/api/users";

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function toDateKey(iso: string) {
  return iso.slice(0, 10); // "2026-07-15T..." → "2026-07-15"
}

function buildLast7Days() {
  const days: { key: string; date: Date }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ key: toDateKey(d.toISOString()), date: d });
  }
  return days;
}

export default function ProfileProgressChart() {
  const { data, isLoading } = useQuery({ queryKey: ["users-progress"], queryFn: usersApi.getProgress });

  const weekly = useMemo(() => {
    const days = buildLast7Days();
    const buckets: Record<string, number> = Object.fromEntries(days.map((d) => [d.key, 0]));

    for (const item of data?.items ?? []) {
      const timestamp = item.completedAt ?? item.updatedAt;
      if (!timestamp || !item.xpEarned) continue;
      const key = toDateKey(timestamp);
      if (key in buckets) buckets[key] += item.xpEarned;
    }

    return days.map((d) => ({ date: d.key, xp: buckets[d.key], weekday: d.date.getDay() }));
  }, [data]);

  if (isLoading) return <SkeletonCard />;

  const hasAnyXp = weekly.some((d) => d.xp > 0);
  const maxXp = Math.max(...weekly.map((d) => d.xp), 1);

  return (
    <Card>
      <h3 className="font-semibold text-ink-navy mb-5 flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4 text-airmail" /> Tiến trình 7 ngày qua
      </h3>

      {!hasAnyXp ? (
        <p className="text-sm text-ink-muted py-6 text-center">Chưa có hoạt động học tập nào trong 7 ngày qua.</p>
      ) : (
        <div className="flex items-end justify-between gap-2 sm:gap-3 h-36">
          {weekly.map((d) => {
            const heightPct = Math.max((d.xp / maxXp) * 100, 4);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                {d.xp > 0 && <span className="text-[10px] font-mono font-semibold text-airmail">{d.xp}</span>}
                <div className="w-full rounded-t-md bg-airmail/15 relative overflow-hidden" style={{ height: "100%" }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-airmail rounded-t-md transition-all duration-500" style={{ height: `${heightPct}%` }} />
                </div>
                <span className="text-[10px] text-ink-muted font-medium">{WEEKDAY_LABELS[d.weekday]}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
