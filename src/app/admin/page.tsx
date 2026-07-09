// Admin — tổng quan thống kê
"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, MessageCircle, Mic, FileText, HelpCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import { adminApi } from "@/lib/api/admin";

export default function AdminOverviewPage() {
  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.getStats });

  if (!stats) return <p className="text-slate-400">Đang tải...</p>;

  const cards = [
    { label: "Tổng người dùng", value: stats.users.total, sub: `+${stats.users.newLast7Days} tuần này`, icon: Users },
    { label: "Từ vựng", value: stats.content.vocabulary, icon: BookOpen },
    { label: "Bài ngữ pháp", value: stats.content.grammar, icon: BookOpen },
    { label: "Câu quiz", value: stats.content.quiz, icon: HelpCircle },
    { label: "Blog đã đăng", value: `${stats.content.blogPosts.published}/${stats.content.blogPosts.total}`, icon: FileText },
    { label: "AI Chat sessions", value: stats.engagement.chatSessions, icon: MessageCircle },
    { label: "AI Speaking sessions", value: stats.engagement.speakingSessions, icon: Mic },
    { label: "Câu hỏi cộng đồng", value: stats.engagement.communityQuestions, icon: HelpCircle },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tổng quan</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <Card key={c.label}>
            <c.icon className="w-5 h-5 text-brand mb-2" />
            <p className="text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
            {c.sub && <p className="text-xs text-green-600 mt-1">{c.sub}</p>}
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold text-slate-900 mb-3">Người dùng theo gói</h3>
        <div className="flex gap-6">
          {Object.entries(stats.users.byPlan).map(([plan, count]) => (
            <div key={plan}>
              <p className="text-xl font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-500">{plan}</p>
            </div>
          ))}
          {Object.keys(stats.users.byPlan).length === 0 && (
            <p className="text-sm text-slate-400">Chưa có subscription nào</p>
          )}
        </div>
      </Card>
    </div>
  );
}
