// Hiển thị 4 tiêu chí điểm: Pronunciation, Grammar, Fluency, Vocabulary
import { cn } from "@/lib/utils/cn";
import type { SpeakingScores } from "@/types";

const CRITERIA: { key: keyof SpeakingScores; label: string }[] = [
  { key: "pronunciation", label: "Phát âm" },
  { key: "grammar", label: "Ngữ pháp" },
  { key: "fluency", label: "Trôi chảy" },
  { key: "vocabulary", label: "Từ vựng" },
];

function scoreColor(score: number) {
  if (score >= 85) return "text-green-600 bg-green-50";
  if (score >= 70) return "text-blue-600 bg-blue-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

export default function ScoreCard({ scores }: { scores: SpeakingScores }) {
  const overall = Math.round((scores.pronunciation + scores.grammar + scores.fluency + scores.vocabulary) / 4);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold", scoreColor(overall))}>{overall}</div>
        <p className="text-sm text-slate-500 mt-1">Điểm tổng</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CRITERIA.map(({ key, label }) => (
          <div key={key} className="rounded-lg border border-surface-border p-3">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={cn("text-lg font-semibold", scoreColor(scores[key]).split(" ")[0])}>{scores[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
