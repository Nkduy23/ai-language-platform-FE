"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BookOpen, Filter, RotateCcw, Zap } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FlashcardSession from "@/components/flashcard/FlashcardSession";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { vocabularyApi } from "@/lib/api/vocabulary";
import { LANGUAGES, CEFR_LEVELS, TOPICS } from "@/lib/constants/app";
import type { LanguageCode, CefrLevel, VocabularyCard } from "@/types";
import toast from "react-hot-toast";

type SessionState = "idle" | "running" | "done";

export default function LearnPage() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [sessionCards, setSessionCards] = useState<VocabularyCard[]>([]);

  // Filter state
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("EN");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "">("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [cardCount, setCardCount] = useState(10);

  // Stats
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["vocabulary-stats"],
    queryFn: vocabularyApi.getStats,
  });

  // Start session mutation
  const startMutation = useMutation({
    mutationFn: () =>
      vocabularyApi.startFlashcardSession({
        language: selectedLang,
        level: selectedLevel || undefined,
        topic: selectedTopic || undefined,
        cardCount,
      }),
    onSuccess: (data) => {
      if (data.sessionCards.length === 0) {
        toast.error("Không có từ vựng nào phù hợp với bộ lọc này");
        return;
      }
      setSessionCards(data.sessionCards);
      setSessionState("running");
      toast.success(`Bắt đầu học ${data.sessionCards.length} từ!`, { icon: "📚" });
    },
    onError: () => toast.error("Không thể tải từ vựng"),
  });

  const handleComplete = () => {
    setSessionState("done");
    refetchStats();
  };

  const handleRestart = () => {
    setSessionState("idle");
    setSessionCards([]);
  };

  return (
    <DashboardLayout title="Từ vựng" description="Học từ vựng với hệ thống Flashcard thông minh">
      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Tổng từ", value: stats.totalCards, color: "text-slate-900" },
            { label: "Đã học", value: stats.learned, color: "text-green-600" },
            { label: "Đang học", value: stats.inProgress, color: "text-blue-600" },
            { label: "Tổng XP", value: `${stats.totalXp} ⚡`, color: "text-brand" },
          ].map((item) => (
            <Card key={item.label} padding="sm">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Session đang chạy */}
      {sessionState === "running" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <BookOpen className="w-5 h-5 text-brand flex-shrink-0" />
              Đang học — {LANGUAGES[selectedLang].flag} {LANGUAGES[selectedLang].name}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleRestart} className="self-start sm:self-auto">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Thoát
            </Button>
          </div>
          <FlashcardSession cards={sessionCards} onComplete={handleComplete} onRestart={handleRestart} />
        </div>
      )}

      {/* Idle — chọn filter + bắt đầu */}
      {sessionState === "idle" && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Filter className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Tùy chọn học</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Ngôn ngữ */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Ngôn ngữ</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => setSelectedLang(code)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedLang === code ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>{LANGUAGES[code].flag}</span>
                      <span>{code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Số từ */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Số từ mỗi lần</p>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCardCount(n)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        cardCount === n ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cấp độ */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Cấp độ</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedLevel("")}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      selectedLevel === "" ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Tất cả
                  </button>
                  {(Object.keys(CEFR_LEVELS) as CefrLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedLevel === level ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chủ đề */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Chủ đề</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTopic("")}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      selectedTopic === "" ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Tất cả
                  </button>
                  {TOPICS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setSelectedTopic(t.value)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedTopic === t.value ? "border-brand bg-blue-50 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <Button size="lg" onClick={() => startMutation.mutate()} loading={startMutation.isPending} className="gap-2">
                <Zap className="w-4 h-4" />
                Bắt đầu học {cardCount} từ
              </Button>
            </div>
          </Card>

          {/* Quick stats by language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
              <Card
                key={code}
                hover
                onClick={() => {
                  setSelectedLang(code);
                  startMutation.mutate();
                }}
                padding="sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{LANGUAGES[code].flag}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{LANGUAGES[code].name}</p>
                    <p className="text-xs text-slate-400">Nhấn để học ngay</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
