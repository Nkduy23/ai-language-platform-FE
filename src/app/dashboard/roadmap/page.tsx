// Roadmap page — lộ trình cá nhân hoá: level hiện tại, placement test, gợi ý, badge, leaderboard
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trophy, Sparkles, Award } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RoadmapTree from "@/components/roadmap/RoadmapTree";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { roadmapApi } from "@/lib/api/roadmap";
import { usersApi } from "@/lib/api/users";
import type { LanguageCode, PlacementQuestion } from "@/types";
import toast from "react-hot-toast";

export default function RoadmapPage() {
  const queryClient = useQueryClient();
  const [testLanguage, setTestLanguage] = useState<LanguageCode>("EN");
  const [questions, setQuestions] = useState<PlacementQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: profile } = useQuery({ queryKey: ["users-me"], queryFn: usersApi.getMe });
  const { data: recommendations } = useQuery({
    queryKey: ["roadmap-recommendations"],
    queryFn: roadmapApi.getRecommendations,
  });
  const { data: badges } = useQuery({ queryKey: ["roadmap-badges"], queryFn: roadmapApi.getBadges });
  const { data: leaderboard } = useQuery({ queryKey: ["roadmap-leaderboard"], queryFn: roadmapApi.getLeaderboard });

  const startTestMutation = useMutation({
    mutationFn: () => roadmapApi.startPlacementTest(testLanguage),
    onSuccess: (data) => {
      setQuestions(data.questions);
      setAnswers({});
    },
  });

  const submitTestMutation = useMutation({
    mutationFn: () =>
      roadmapApi.submitPlacementTest(
        testLanguage,
        Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      ),
    onSuccess: (result) => {
      toast.success(`Trình độ của bạn: ${result.level}!`);
      setQuestions(null);
      queryClient.invalidateQueries({ queryKey: ["users-me"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-recommendations"] });
    },
  });

  const currentLevel = profile?.profile?.currentLevel ?? "A1";
  const allAnswered = questions ? questions.every((q) => answers[q.id]?.trim()) : false;

  return (
    <DashboardLayout title="Lộ trình" description="Lộ trình học tập cá nhân hoá">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Trình độ hiện tại</h3>
          <RoadmapTree currentLevel={currentLevel} />
        </Card>

        {!questions ? (
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3">Kiểm tra trình độ (Placement Test)</h3>
            <p className="text-sm text-slate-500 mb-3">Làm bài test nhanh để xác định chính xác trình độ của bạn.</p>
            <LanguageSelector value={testLanguage} onChange={setTestLanguage} className="mb-4" />
            <Button loading={startTestMutation.isPending} onClick={() => startTestMutation.mutate()}>
              Bắt đầu làm bài
            </Button>
          </Card>
        ) : (
          <Card className="space-y-5">
            <h3 className="font-semibold text-slate-900">Trả lời {questions.length} câu hỏi</h3>
            {questions.map((q, i) => (
              <div key={q.id} className="border-b border-surface-border pb-4 last:border-0">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  {i + 1}. [{q.level}] {q.question}
                </p>
                {q.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className={`text-left text-sm rounded-lg border px-3 py-2 ${answers[q.id] === opt ? "border-brand bg-brand/5 text-brand" : "border-surface-border text-slate-600"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
                    placeholder="Nhập câu trả lời..."
                  />
                )}
              </div>
            ))}
            <Button fullWidth disabled={!allAnswered} loading={submitTestMutation.isPending} onClick={() => submitTestMutation.mutate()}>
              Nộp bài
            </Button>
          </Card>
        )}

        {recommendations && (
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand" /> Gợi ý cho bạn
            </h3>
            {recommendations.weakestArea ? (
              <p className="text-sm text-slate-600 mb-2">
                Điểm cần cải thiện: <span className="font-medium">{recommendations.weakestArea}</span>
              </p>
            ) : (
              <p className="text-sm text-slate-500 mb-2">Luyện tập thêm để nhận gợi ý cá nhân hoá nhé!</p>
            )}
            {recommendations.nextGrammarLesson && (
              <p className="text-sm text-slate-600">
                Bài ngữ pháp tiếp theo: <span className="font-medium">{recommendations.nextGrammarLesson.title}</span>
              </p>
            )}
          </Card>
        )}

        {badges && (
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-500" /> Huy hiệu
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {badges.map((b) => (
                <div key={b.id} className={`flex flex-col items-center gap-1 rounded-lg p-3 text-center ${b.achieved ? "bg-purple-50" : "bg-slate-50 opacity-40"}`}>
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-xs text-slate-600">{b.label}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {leaderboard && leaderboard.length > 0 && (
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Bảng xếp hạng XP
            </h3>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-medium">#{entry.rank}</span>
                    {entry.displayName}
                  </span>
                  <span className="font-semibold text-brand">{entry.totalXp} XP</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
