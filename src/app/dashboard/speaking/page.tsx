// AI Speaking page — ghi âm, chấm điểm 4 tiêu chí, nghe câu mẫu
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import RecordButton from "@/components/speaking/RecordButton";
import ScoreCard from "@/components/speaking/ScoreCard";
import FeedbackPanel from "@/components/speaking/FeedbackPanel";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { useSpeaking } from "@/lib/hooks/useSpeaking";
import type { LanguageCode } from "@/types";

const PROMPTS = ["Introduce yourself in 3-4 sentences.", "Describe your favorite food and why you like it.", "Talk about your plans for this weekend.", "Describe a memorable trip you took."];

export default function SpeakingPage() {
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const { isRecording, startRecording, stopRecording, isAnalyzing, result, reset } = useSpeaking(language, prompt);

  return (
    <DashboardLayout title="AI Speaking" description="Luyện phát âm, nhận đánh giá pronunciation, fluency, grammar">
      <div className="max-w-2xl mx-auto space-y-6">
        {!result && (
          <Card className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Ngôn ngữ luyện nói</p>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Chủ đề gợi ý</p>
              <div className="grid grid-cols-1 gap-2">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className={`text-left text-sm rounded-lg border px-3 py-2 ${prompt === p ? "border-brand bg-brand/5 text-brand" : "border-surface-border text-slate-600"}`}
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
              <FeedbackPanel result={result} />
            </Card>
            <button onClick={reset} className="w-full text-sm text-center text-brand font-medium py-2 hover:underline">
              Luyện tiếp câu khác
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
