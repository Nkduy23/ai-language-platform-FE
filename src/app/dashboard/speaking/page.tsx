// AI Speaking page — ghi âm, chấm điểm 4 tiêu chí, nghe câu mẫu
"use client";

import { useState } from "react";
import { Mic, History } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import RecordButton from "@/components/speaking/RecordButton";
import ScoreCard from "@/components/speaking/ScoreCard";
import FeedbackPanel from "@/components/speaking/FeedbackPanel";
import SpeakingHistory from "@/components/speaking/SpeakingHistory";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { useSpeaking } from "@/lib/hooks/useSpeaking";
import type { LanguageCode } from "@/types";
import { cn } from "@/lib/utils/cn";

const PROMPTS = ["Introduce yourself in 3-4 sentences.", "Describe your favorite food and why you like it.", "Talk about your plans for this weekend.", "Describe a memorable trip you took."];

type Tab = "practice" | "history";

export default function SpeakingPage() {
  const [tab, setTab] = useState<Tab>("practice");
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const { isRecording, startRecording, stopRecording, isAnalyzing, result, reset } = useSpeaking(language, prompt);

  return (
    <DashboardLayout title="AI Speaking" description="Luyện phát âm, nhận đánh giá pronunciation, fluency, grammar">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tab switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("practice")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              tab === "practice" ? "bg-ink-navy text-postcard" : "text-ink-muted hover:bg-postcard-dark",
            )}
          >
            <Mic className="w-3.5 h-3.5" /> Luyện tập
          </button>
          <button
            onClick={() => setTab("history")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              tab === "history" ? "bg-ink-navy text-postcard" : "text-ink-muted hover:bg-postcard-dark",
            )}
          >
            <History className="w-3.5 h-3.5" /> Lịch sử
          </button>
        </div>

        {tab === "history" ? (
          <SpeakingHistory />
        ) : (
          <>
            {!result && (
              <Card className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-ink-navy mb-2">Ngôn ngữ luyện nói</p>
                  <LanguageSelector value={language} onChange={setLanguage} />
                </div>

                <div>
                  <p className="text-sm font-medium text-ink-navy mb-2">Chủ đề gợi ý</p>
                  <div className="grid grid-cols-1 gap-2">
                    {PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPrompt(p)}
                        className={`text-left text-sm rounded-md border-[1.5px] px-3 py-2 transition-colors ${prompt === p ? "border-airmail bg-airmail/5 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <RecordButton isRecording={isRecording} isAnalyzing={isAnalyzing} onStart={startRecording} onStop={stopRecording} />
                </div>
              </Card>
            )}

            {result && (
              <div className="space-y-4">
                <Card>
                  <ScoreCard scores={result.scores} />
                </Card>
                <Card>
                  <FeedbackPanel result={result} language={language} />
                </Card>
                <button onClick={reset} className="w-full text-sm text-center text-airmail font-medium py-2 hover:underline">
                  Luyện tiếp câu khác
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
