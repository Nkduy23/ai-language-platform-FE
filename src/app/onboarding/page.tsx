// Onboarding sau đăng ký — chọn ngôn ngữ → làm placement test → xem kết quả
// đóng dấu lên "hộ chiếu". Có thể bỏ qua ở bất kỳ bước nào để vào thẳng Dashboard.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import LanguageSelector from "@/components/shared/LanguageSelector";
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";
import { roadmapApi } from "@/lib/api/roadmap";
import { ROUTES } from "@/lib/constants/routes";
import type { LanguageCode, PlacementQuestion, CefrLevel } from "@/types";

type Step = "language" | "test" | "result";

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("language");
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultLevel, setResultLevel] = useState<CefrLevel | null>(null);

  const goToDashboard = () => router.push(ROUTES.DASHBOARD);

  const startTestMutation = useMutation({
    mutationFn: () => roadmapApi.startPlacementTest(language),
    onSuccess: (data) => {
      setQuestions(data.questions);
      setAnswers({});
      setStep("test");
    },
  });

  const submitTestMutation = useMutation({
    mutationFn: () =>
      roadmapApi.submitPlacementTest(
        language,
        Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      ),
    onSuccess: (result) => {
      setResultLevel(result.level);
      setStep("result");
      queryClient.invalidateQueries({ queryKey: ["users-me"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-recommendations"] });
    },
  });

  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  return (
    <div className="min-h-screen bg-ink-navy flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#F5EFE0 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="relative w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["language", "test", "result"] as Step[]).map((s, i) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-8 bg-airmail" : "w-4 bg-white/20"}`} />
          ))}
        </div>

        <div className="bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp p-6 sm:p-8">
          {/* Bước 1 — chọn ngôn ngữ */}
          {step === "language" && (
            <>
              <h1 className="text-xl sm:text-2xl mb-2">Bạn muốn học ngôn ngữ nào?</h1>
              <p className="text-sm text-ink-muted mb-6">Chọn 1 ngôn ngữ để bắt đầu — bạn có thể học thêm ngôn ngữ khác sau này.</p>
              <LanguageSelector value={language} onChange={setLanguage} className="mb-8" />
              <div className="flex items-center justify-between">
                <button onClick={goToDashboard} className="text-sm text-ink-muted hover:text-ink-navy">
                  Bỏ qua, để sau
                </button>
                <Button onClick={() => startTestMutation.mutate()} loading={startTestMutation.isPending} className="gap-1.5">
                  Kiểm tra trình độ <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          {/* Bước 2 — placement test */}
          {step === "test" && (
            <>
              <h1 className="text-xl sm:text-2xl mb-2">Trả lời {questions.length} câu hỏi</h1>
              <p className="text-sm text-ink-muted mb-6">Không cần lo lắng — đây chỉ để xác định đúng điểm xuất phát cho bạn.</p>

              <div className="space-y-5 max-h-[45vh] overflow-y-auto pr-1 mb-6">
                {questions.map((q, i) => (
                  <div key={q.id} className="border-b border-surface-border pb-4 last:border-0">
                    <p className="text-sm font-medium text-ink-navy mb-2">
                      {i + 1}. [{q.level}] {q.question}
                    </p>
                    {q.options ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                            className={`text-left text-sm rounded-md border-[1.5px] px-3 py-2 transition-colors ${
                              answers[q.id] === opt ? "border-airmail bg-airmail/5 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                        className="w-full rounded-md border-[1.5px] border-surface-border px-3 py-2 text-sm bg-postcard"
                        placeholder="Nhập câu trả lời..."
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button onClick={goToDashboard} className="text-sm text-ink-muted hover:text-ink-navy">
                  Bỏ qua, để sau
                </button>
                <Button disabled={!allAnswered} loading={submitTestMutation.isPending} onClick={() => submitTestMutation.mutate()} className="gap-1.5">
                  Nộp bài <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          {/* Bước 3 — kết quả, "đóng dấu" trình độ */}
          {step === "result" && resultLevel && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <PostmarkStamp label="TRÌNH ĐỘ CỦA BẠN •" color="airmail" size={110} rotate={-6}>
                  {resultLevel}
                </PostmarkStamp>
              </div>
              <h1 className="text-xl sm:text-2xl mb-2">Đã đóng dấu hộ chiếu của bạn!</h1>
              <p className="text-sm text-ink-muted mb-8">
                Trình độ hiện tại của bạn là <span className="font-semibold text-ink-navy">{resultLevel}</span>. Lộ trình học đã được cá nhân hoá theo đúng trình độ này.
              </p>
              <Button size="lg" onClick={goToDashboard} className="gap-1.5">
                Vào học ngay <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
