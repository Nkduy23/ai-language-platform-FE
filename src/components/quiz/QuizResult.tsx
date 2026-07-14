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
        <div className="w-16 h-16 bg-gold-foil/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gold-foil" />
        </div>

        <p className={cn("text-4xl sm:text-5xl font-display font-bold mb-2", getGradeColor(accuracy))}>{accuracy}%</p>
        <p className="text-ink-muted text-sm mb-1">{result.grade}</p>
        <p className="text-ink-muted/70 text-xs">
          {result.correct} / {result.total} câu đúng
        </p>

        <div className="max-w-xs mx-auto mt-4">
          <ProgressBar value={accuracy} color={accuracy >= 70 ? "green" : accuracy >= 50 ? "orange" : "blue"} />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-airmail font-semibold font-mono">⚡ +{result.xpEarned} XP</div>
      </Card>

      {/* Detail answers */}
      <Card padding="sm">
        <h3 className="font-semibold text-ink-navy mb-4 px-2">Chi tiết từng câu</h3>
        <div className="space-y-3">
          {result.details.map((detail, i) => (
            <div
              key={detail.questionId}
              className={cn("flex items-start gap-3 p-3 rounded-md border-[1.5px]", detail.isCorrect ? "bg-stamp-teal/10 border-stamp-teal/20" : "bg-airmail/10 border-airmail/20")}
            >
              <div className="flex-shrink-0 mt-0.5">{detail.isCorrect ? <CheckCircle className="w-5 h-5 text-stamp-teal" /> : <XCircle className="w-5 h-5 text-airmail" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-navy mb-1">
                  Câu {i + 1}: {detail.question}
                </p>
                {!detail.isCorrect && (
                  <div className="space-y-0.5">
                    <p className="text-xs text-airmail-dark">
                      Bạn trả lời: <span className="font-medium">{detail.yourAnswer || "(bỏ qua)"}</span>
                    </p>
                    <p className="text-xs text-[#1E6E63]">
                      Đáp án đúng: <span className="font-medium">{detail.correctAnswer}</span>
                    </p>
                  </div>
                )}
                {detail.explanation && <p className="text-xs text-ink-muted mt-1 italic">{detail.explanation}</p>}
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
