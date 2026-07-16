// Analytics — tổng hợp số liệu học tập ở một nơi (streak, XP, từ vựng, quiz,
// biểu đồ 7 ngày). Toàn bộ dữ liệu tái dùng từ các API đã có, không thêm
// endpoint mới.
"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame, Zap, BookOpen, Brain, Target } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import ProfileProgressChart from "@/components/shared/ProfileProgressChart";
import { usersApi } from "@/lib/api/users";
import { vocabularyApi } from "@/lib/api/vocabulary";
import { quizApi } from "@/lib/api/quiz";

export default function AnalyticsPage() {
  const { data: streak } = useQuery({ queryKey: ["users-streak"], queryFn: usersApi.getStreak });
  const { data: vocabStats } = useQuery({ queryKey: ["vocabulary-stats"], queryFn: vocabularyApi.getStats });
  const { data: quizStats } = useQuery({ queryKey: ["quiz-stats"], queryFn: quizApi.getStats });

  return (
    <DashboardLayout title="Thống kê" description="Toàn cảnh quá trình học tập của bạn">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-gold-foil flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl font-bold font-mono text-ink-navy">{streak?.streakDays ?? 0}</p>
              <p className="text-xs text-ink-muted">Ngày streak</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-airmail flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl font-bold font-mono text-ink-navy">{streak?.totalXp ?? 0}</p>
              <p className="text-xs text-ink-muted">Tổng XP</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-stamp-teal flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl font-bold font-mono text-ink-navy">{vocabStats?.learned ?? 0}</p>
              <p className="text-xs text-ink-muted">Từ đã học</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-ink-navy flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl font-bold font-mono text-ink-navy">{quizStats?.totalSessions ?? 0}</p>
              <p className="text-xs text-ink-muted">Quiz đã làm</p>
            </div>
          </Card>
        </div>

        {/* Biểu đồ 7 ngày — tái dùng component đã dựng cho Profile */}
        <ProfileProgressChart />

        {/* Chi tiết Từ vựng + Quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <h3 className="font-semibold text-ink-navy mb-4 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-stamp-teal" /> Từ vựng
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Tổng số từ</span>
                <span className="font-mono font-semibold text-ink-navy">{vocabStats?.totalCards ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Đã học</span>
                <span className="font-mono font-semibold text-stamp-teal">{vocabStats?.learned ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Đang học</span>
                <span className="font-mono font-semibold text-gold-foil">{vocabStats?.inProgress ?? 0}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-ink-navy mb-4 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-airmail" /> Quiz
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Đã làm</span>
                <span className="font-mono font-semibold text-ink-navy">{quizStats?.totalSessions ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Điểm trung bình</span>
                <span className="font-mono font-semibold text-stamp-teal">{quizStats?.avgScore ?? 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Độ chính xác</span>
                <span className="font-mono font-semibold text-gold-foil">{quizStats?.accuracy ?? 0}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
