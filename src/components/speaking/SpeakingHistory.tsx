// Lịch sử các lần luyện nói — giúp theo dõi tiến bộ theo thời gian
"use client";

import { useQuery } from "@tanstack/react-query";
import { Mic, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { speakingApi } from "@/lib/api/speaking";
import { cn } from "@/lib/utils/cn";

function scoreColor(score: number) {
  if (score >= 85) return "text-stamp-teal";
  if (score >= 70) return "text-ink-navy";
  if (score >= 50) return "text-[#8A6425]";
  return "text-airmail-dark";
}

export default function SpeakingHistory() {
  // API trả về mảng thẳng, không bọc trong { data, pagination }
  const { data: sessions, isLoading } = useQuery({ queryKey: ["speaking-history"], queryFn: () => speakingApi.getHistory() });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return <EmptyState icon={Mic} title="Chưa có lần luyện nói nào" description="Bắt đầu luyện tập để theo dõi tiến bộ của bạn theo thời gian." />;
  }

  return (
    <div className="space-y-3">
      {sessions.map((s) => {
        // Điểm số BE trả về dạng string ("72") nên cần parse trước khi tính trung bình
        const pronun = Number(s.scorePronun) || 0;
        const grammar = Number(s.scoreGrammar) || 0;
        const fluency = Number(s.scoreFluency) || 0;
        const vocab = Number(s.scoreVocab) || 0;
        const overall = Math.round((pronun + grammar + fluency + vocab) / 4);

        return (
          <Card key={s.id} padding="sm" className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full border-[1.5px] border-current/20 flex items-center justify-center font-mono font-bold text-lg flex-shrink-0", scoreColor(overall))}>
              {overall}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-navy truncate">{s.originalText || s.transcribed}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-muted">
                <span>
                  {s.language.flag} {s.language.code}
                </span>
                <span>·</span>
                <span>{new Date(s.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 text-paper-line flex-shrink-0" />
          </Card>
        );
      })}
    </div>
  );
}
