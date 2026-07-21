// Onboarding sau đăng ký — chọn ngôn ngữ → làm placement test → xem kết quả
// đóng dấu lên "hộ chiếu". Có thể bỏ qua ở bất kỳ bước nào để vào thẳng Dashboard.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, X } from "lucide-react";
import Button from "@/components/ui/Button";
import LanguageSelector from "@/components/shared/LanguageSelector";
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";
import { roadmapApi } from "@/lib/api/roadmap";
import { usersApi } from "@/lib/api/users";
import { ROUTES } from "@/lib/constants/routes";
import type { LanguageCode, PlacementQuestion, CefrLevel } from "@/types";

type Step = "language" | "test" | "result";

// Câu hỏi "arrange the words" được nhận diện qua q.type (khớp với enum QuizQuestionType ở backend).
// Nếu tên enum bên bạn khác "ARRANGE"/"ORDER" thì đổi lại điều kiện trong hàm này cho đúng.
function isArrangeQuestion(q: PlacementQuestion) {
  const t = (q.type ?? "").toString().toUpperCase();
  return t.includes("ARRANGE") || t.includes("ORDER") || t.includes("REORDER");
}

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("language");
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Với câu "arrange": lưu thứ tự các INDEX (trong q.options) mà người dùng đã chọn, theo đúng thứ tự click
  const [arrangeOrder, setArrangeOrder] = useState<Record<string, number[]>>({});
  const [resultLevel, setResultLevel] = useState<CefrLevel | null>(null);

  // Đánh dấu đã hoàn thành onboarding rồi mới vào Dashboard — áp dụng cho MỌI đường thoát
  // (bỏ qua ở bước 1, bỏ qua ở bước 2, hoặc hoàn thành xong bước 3), vì cả 3 nút đều gọi hàm này.
  // Lỗi gọi API ở đây không nên chặn user vào Dashboard — chỉ log, không toast/throw.
  const goToDashboard = async () => {
    try {
      await usersApi.completeOnboarding();
    } catch {
      // Không chặn điều hướng nếu lỡ lỗi — tệ nhất là lần sau onboarding hiện lại
    }
    router.push(ROUTES.DASHBOARD);
  };

  const startTestMutation = useMutation({
    mutationFn: () => roadmapApi.startPlacementTest(language),
    onSuccess: (data) => {
      setQuestions(data.questions);
      setAnswers({});
      setArrangeOrder({});
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

  // Bấm 1 từ: nếu chưa được chọn -> thêm vào cuối khay câu trả lời; nếu đã chọn -> bỏ ra khỏi khay (trả lại ngân hàng từ)
  const toggleArrangeWord = (q: PlacementQuestion, idx: number) => {
    setArrangeOrder((prev) => {
      const current = prev[q.id] ?? [];
      const isChosen = current.includes(idx);
      const nextOrder = isChosen ? current.filter((i) => i !== idx) : [...current, idx];
      const words = nextOrder.map((i) => q.options![i]);
      setAnswers((a) => ({ ...a, [q.id]: words.join(" ") }));
      return { ...prev, [q.id]: nextOrder };
    });
  };

  const allAnswered = questions.every((q) => {
    const ans = answers[q.id]?.trim();
    if (!ans) return false;
    // Với câu arrange, bắt buộc phải dùng hết toàn bộ các từ được cho thì mới coi là trả lời xong
    if (isArrangeQuestion(q) && q.options) {
      return (arrangeOrder[q.id]?.length ?? 0) === q.options.length;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ink-navy flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "radial-gradient(#F5EFE0 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

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

                    {isArrangeQuestion(q) && q.options ? (
                      <div className="space-y-3">
                        {/* Khay câu trả lời — các từ đã chọn, theo đúng thứ tự đã bấm */}
                        <div className="min-h-[46px] flex flex-wrap items-center gap-2 rounded-md border-[1.5px] border-dashed border-surface-border p-2 bg-postcard">
                          {(arrangeOrder[q.id] ?? []).length === 0 && <span className="text-xs text-ink-muted/60 italic px-1">Nhấn vào các từ bên dưới theo đúng thứ tự...</span>}
                          {(arrangeOrder[q.id] ?? []).map((idx, pos) => (
                            <button
                              key={`${q.id}-chosen-${idx}-${pos}`}
                              onClick={() => toggleArrangeWord(q, idx)}
                              className="flex items-center gap-1 text-sm rounded-md border-[1.5px] border-airmail bg-airmail/10 text-airmail px-3 py-1.5"
                            >
                              {q.options![idx]}
                              <X className="w-3 h-3 opacity-60" />
                            </button>
                          ))}
                        </div>
                        {/* Ngân hàng từ — các từ chưa được dùng */}
                        <div className="flex flex-wrap gap-2">
                          {q.options.map((opt, idx) =>
                            (arrangeOrder[q.id] ?? []).includes(idx) ? null : (
                              <button
                                key={`${q.id}-pool-${idx}`}
                                onClick={() => toggleArrangeWord(q, idx)}
                                className="text-sm rounded-md border-[1.5px] border-surface-border text-ink-muted px-3 py-1.5 hover:border-ink-navy/30"
                              >
                                {opt}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    ) : q.options ? (
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
