// Hiển thị transcript, nhận xét chi tiết, và nút phát lại câu mẫu chuẩn
// Ưu tiên modelAudioUrl (Google Cloud TTS) nếu có; chưa cấu hình thì tự fallback sang Web Speech API (browser, miễn phí)
import { useState } from "react";
import { PlayCircle, Loader2, MessageSquareQuote } from "lucide-react";
import Card from "@/components/ui/Card";
import type { SpeakingResult, LanguageCode } from "@/types";

const LOCALE_MAP: Record<LanguageCode, string> = {
  EN: "en-US",
  ZH: "zh-CN",
  JA: "ja-JP",
};

export default function FeedbackPanel({ result, language }: { result: SpeakingResult; language: LanguageCode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playModelAudio = () => {
    if (isPlaying) return;

    // Có Google TTS audio thật → phát file
    if (result.feedback.modelAudioUrl) {
      const audio = new Audio(result.feedback.modelAudioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
      return;
    }

    // Chưa cấu hình Google TTS → fallback Web Speech API (browser, miễn phí, không cần API key)
    if (typeof window !== "undefined" && window.speechSynthesis && result.feedback.modelAnswer) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(result.feedback.modelAnswer);
      utterance.lang = LOCALE_MAP[language];
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4">
      <Card padding="sm" className="bg-slate-50">
        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
          <MessageSquareQuote className="w-3.5 h-3.5" /> Bạn đã nói
        </p>
        <p className="text-sm text-slate-700 italic">"{result.transcribed}"</p>
      </Card>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Nhận xét</p>
        <p className="text-sm text-slate-600">{result.feedback.summary}</p>
      </div>

      {result.feedback.details.length > 0 && (
        <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
          {result.feedback.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}

      {result.feedback.modelAnswer && (
        <button onClick={playModelAudio} disabled={isPlaying} className="flex items-center gap-2 text-sm text-brand font-medium hover:underline disabled:opacity-60">
          {isPlaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
          Nghe câu mẫu chuẩn
        </button>
      )}
    </div>
  );
}
