"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Brain, Filter, RotateCcw, Zap, Clock, Target } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuizCard from "@/components/quiz/QuizCard";
import QuizResult from "@/components/quiz/QuizResult";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { quizApi } from "@/lib/api/quiz";
import { LANGUAGES, CEFR_LEVELS } from "@/lib/constants/app";
import type { LanguageCode, CefrLevel, QuizQuestion, QuizResult as QuizResultType, QuizAnswerDetail } from "@/types";
import toast from "react-hot-toast";

type PageState = "idle" | "running" | "done";

interface AnswerState {
  questionId: string;
  answer: string;
  correctAnswer?: string;
  explanation?: string;
  isCorrect?: boolean;
  submitted: boolean;
}

export default function QuizPage() {
  const [pageState, setPageState] = useState<PageState>("idle");

  // Filter
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("EN");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "">("");
  const [questionCount, setQuestionCount] = useState(10);

  // Session
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [currentAnswerState, setCurrentAnswerState] = useState<AnswerState | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);

  // Stats
  const { data: stats } = useQuery({
    queryKey: ["quiz-stats"],
    queryFn: quizApi.getStats,
  });

  // Create session
  const createMutation = useMutation({
    mutationFn: () =>
      quizApi.createSession({
        language: selectedLang,
        level: selectedLevel || undefined,
        questionCount,
      }),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers(new Map());
      setCurrentAnswerState(null);
      setPageState("running");
    },
    onError: () => toast.error("Không thể tải câu hỏi"),
  });

  // Submit all answers
  const submitMutation = useMutation({
    mutationFn: (allAnswers: Array<{ questionId: string; answer: string }>) => quizApi.submitSession(sessionId, allAnswers),
    onSuccess: (data) => {
      setResult(data);
      setPageState("done");
    },
    onError: () => toast.error("Không thể nộp bài"),
  });

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  // User chọn đáp án
  const handleAnswer = (answer: string) => {
    if (currentAnswerState?.submitted) return;

    // Lưu answer vào map
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answer);
    setAnswers(newAnswers);

    // Hiển thị feedback ngay lập tức (optimistic — chưa biết đúng sai)
    setCurrentAnswerState({
      questionId: currentQuestion.id,
      answer,
      submitted: true,
    });
  };

  // Câu tiếp theo
  const handleNext = () => {
    const isLastQuestion = currentIndex + 1 >= questions.length;

    if (isLastQuestion) {
      // Nộp bài
      const allAnswers = Array.from(answers.entries()).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      submitMutation.mutate(allAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswerState(null);
    }
  };

  const handleRestart = () => {
    setPageState("idle");
    setResult(null);
    setQuestions([]);
    setAnswers(new Map());
    setCurrentAnswerState(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout title="Quiz" description="Luyện tập với các dạng câu hỏi đa dạng">
      {/* Stats */}
      {stats && pageState === "idle" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Đã làm", value: stats.totalSessions, icon: Brain, color: "text-ink-navy" },
            { label: "Điểm TB", value: `${stats.avgScore}%`, icon: Target, color: "text-stamp-teal" },
            { label: "Độ chính xác", value: `${stats.accuracy}%`, icon: Clock, color: "text-gold-foil" },
            { label: "XP từ Quiz", value: `${stats.totalXpFromQuiz} ⚡`, icon: Zap, color: "text-airmail" },
          ].map((item) => (
            <Card key={item.label} padding="sm">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* IDLE — thiết lập Quiz theo từng bước rõ ràng */}
      {pageState === "idle" && (
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-ink-muted" />
            <h2 className="font-semibold text-ink-navy">Thiết lập Quiz</h2>
          </div>

          <div className="space-y-6">
            {/* Bước 1 — Ngôn ngữ */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ink-navy mb-2.5">
                <span className="w-5 h-5 rounded-full bg-airmail/15 text-airmail text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">1</span>
                Chọn ngôn ngữ
              </p>
              <div className="flex flex-wrap gap-2 pl-7">
                {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLang(code)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md border-[1.5px] text-sm font-medium transition-all ${
                      selectedLang === code ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
                    }`}
                  >
                    <span>{LANGUAGES[code].flag}</span>
                    <span>{code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bước 2 — Số câu hỏi */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ink-navy mb-2.5">
                <span className="w-5 h-5 rounded-full bg-airmail/15 text-airmail text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">2</span>
                Số câu hỏi
              </p>
              <div className="flex flex-wrap gap-2 pl-7">
                {[5, 10, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-4 py-2 rounded-md border-[1.5px] text-sm font-medium transition-all ${
                      questionCount === n ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
                    }`}
                  >
                    {n} câu
                  </button>
                ))}
              </div>
            </div>

            {/* Bước 3 — Cấp độ */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ink-navy mb-2.5">
                <span className="w-5 h-5 rounded-full bg-airmail/15 text-airmail text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">3</span>
                Cấp độ <span className="text-ink-muted font-normal">(tuỳ chọn)</span>
              </p>
              <div className="flex flex-wrap gap-2 pl-7">
                <button
                  onClick={() => setSelectedLevel("")}
                  className={`px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-all ${
                    selectedLevel === "" ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
                  }`}
                >
                  Tất cả
                </button>
                {(Object.keys(CEFR_LEVELS) as CefrLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-all ${
                      selectedLevel === level ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t-[1.5px] border-surface-border">
            <Button size="lg" onClick={() => createMutation.mutate()} loading={createMutation.isPending} className="gap-2">
              <Brain className="w-4 h-4" />
              Bắt đầu {questionCount} câu hỏi
            </Button>
          </div>
        </Card>
      )}

      {/* RUNNING — hiện câu hỏi */}
      {pageState === "running" && currentQuestion && (
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <ProgressBar value={progress} className="flex-1" size="sm" />
            <div className="flex items-center gap-3 flex-shrink-0 text-sm text-slate-500">
              <span>
                {currentIndex + 1} / {questions.length}
              </span>
              <button onClick={handleRestart} className="text-slate-400 hover:text-slate-600">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <QuizCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            submitted={currentAnswerState?.submitted}
            correctAnswer={currentAnswerState?.correctAnswer}
            explanation={currentAnswerState?.explanation}
            isCorrect={currentAnswerState?.isCorrect}
            onNext={currentAnswerState?.submitted ? handleNext : undefined}
          />

          {/* Nếu là câu cuối và đã trả lời */}
          {currentAnswerState?.submitted && currentIndex + 1 >= questions.length && (
            <div className="flex justify-end">
              <Button onClick={handleNext} loading={submitMutation.isPending} className="gap-2">
                <Zap className="w-4 h-4" />
                Nộp bài
              </Button>
            </div>
          )}
        </div>
      )}

      {/* DONE — hiện kết quả */}
      {pageState === "done" && result && <QuizResult result={result} onRestart={handleRestart} />}
    </DashboardLayout>
  );
}
