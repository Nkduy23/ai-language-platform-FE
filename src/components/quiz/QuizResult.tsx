// Quiz result summary
import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import type { QuizResult as QuizResultType } from "@/types";
import { getGradeColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface QuizResultProps {
  result: QuizResultType;
  onRestart: () => void;
}

export default function QuizResult({ result, onRestart }: QuizResultProps) {
  const accuracy = result.score;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Score card */}
      <Card className="text-center py-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        <p className={cn("text-4xl sm:text-5xl font-bold mb-2", getGradeColor(accuracy))}>{accuracy}%</p>
        <p className="text-slate-500 text-sm mb-1">{result.grade}</p>
        <p className="text-slate-400 text-xs">
          {result.correct} / {result.total} câu đúng
        </p>

        <div className="max-w-xs mx-auto mt-4">
          <ProgressBar value={accuracy} color={accuracy >= 70 ? "green" : accuracy >= 50 ? "orange" : "blue"} />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-brand font-semibold">⚡ +{result.xpEarned} XP</div>
      </Card>

      {/* Detail answers */}
      <Card padding="sm">
        <h3 className="font-semibold text-slate-900 mb-4 px-2">Chi tiết từng câu</h3>
        <div className="space-y-3">
          {result.details.map((detail, i) => (
            <div key={detail.questionId} className={cn("flex items-start gap-3 p-3 rounded-xl", detail.isCorrect ? "bg-green-50" : "bg-red-50")}>
              <div className="flex-shrink-0 mt-0.5">{detail.isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Câu {i + 1}: {detail.question}
                </p>
                {!detail.isCorrect && (
                  <div className="space-y-0.5">
                    <p className="text-xs text-red-500">
                      Bạn trả lời: <span className="font-medium">{detail.yourAnswer || "(bỏ qua)"}</span>
                    </p>
                    <p className="text-xs text-green-600">
                      Đáp án đúng: <span className="font-medium">{detail.correctAnswer}</span>
                    </p>
                  </div>
                )}
                {detail.explanation && <p className="text-xs text-slate-500 mt-1 italic">{detail.explanation}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onRestart} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
}
