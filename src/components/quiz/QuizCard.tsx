"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import MultipleChoice from "./MultipleChoice";
import FillBlank from "./FillBlank";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { QuizQuestion } from "@/types";
import { cn } from "@/lib/utils/cn";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  correctAnswer?: string;
  explanation?: string;
  isCorrect?: boolean;
  submitted?: boolean;
  onNext?: () => void;
}

export default function QuizCard({ question, questionNumber, totalQuestions, onAnswer, correctAnswer, explanation, isCorrect, submitted, onNext }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  // ✅ Fix bug 1 & 2: reset state mỗi khi câu hỏi thay đổi
  useEffect(() => {
    setSelectedAnswer("");
  }, [question.id]);

  const handleSelect = (answer: string) => {
    if (submitted) return;
    setSelectedAnswer(answer);
    if (question.type === "MULTIPLE_CHOICE") {
      onAnswer(answer);
    }
  };

  const handleFillSubmit = () => {
    if (selectedAnswer.trim() && !submitted) onAnswer(selectedAnswer);
  };

  return (
    <Card className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Câu {questionNumber} / {totalQuestions}
        </span>
        <Badge level={question.level}>{question.level}</Badge>
      </div>

      {/* Question */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
          {question.type === "MULTIPLE_CHOICE" && "Chọn đáp án đúng"}
          {question.type === "FILL_BLANK" && "Điền vào chỗ trống"}
          {question.type === "ARRANGE" && "Sắp xếp từ"}
        </p>
        <p className="text-lg font-medium text-slate-900 leading-relaxed">{question.question}</p>
      </div>

      {/* Answer input */}
      {question.type === "MULTIPLE_CHOICE" && question.options && (
        <MultipleChoice options={question.options} correctAnswer={submitted ? correctAnswer : undefined} selectedAnswer={selectedAnswer} onSelect={handleSelect} disabled={submitted} />
      )}

      {question.type === "FILL_BLANK" && (
        <div className="space-y-3">
          <FillBlank value={selectedAnswer} onChange={setSelectedAnswer} correctAnswer={submitted ? correctAnswer : undefined} submitted={submitted} onSubmit={handleFillSubmit} />
          {!submitted && (
            <Button onClick={handleFillSubmit} disabled={!selectedAnswer.trim()} size="sm">
              Xác nhận
            </Button>
          )}
        </div>
      )}

      {question.type === "ARRANGE" && question.options && (
        // ✅ Fix bug 2: key={question.id} để force re-mount khi đổi câu
        <ArrangeAnswer key={question.id} words={question.options} onAnswer={onAnswer} correctAnswer={submitted ? correctAnswer : undefined} submitted={submitted} />
      )}

      {/* Explanation */}
      {submitted && explanation && (
        <div className={cn("p-4 rounded-xl border text-sm leading-relaxed", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-blue-50 border-blue-200 text-blue-800")}>
          <p className="font-medium mb-1">{isCorrect ? "✅ Chính xác!" : "💡 Giải thích"}</p>
          <p>{explanation}</p>
        </div>
      )}

      {/* Next */}
      {submitted && onNext && (
        <div className="flex justify-end">
          <Button onClick={onNext} className="gap-2">
            Câu tiếp theo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}

// ─── Arrange (key prop từ parent sẽ force re-mount) ───────────────────────────
function ArrangeAnswer({ words, onAnswer, correctAnswer, submitted }: { words: string[]; onAnswer: (answer: string) => void; correctAnswer?: string; submitted?: boolean }) {
  // Shuffle words khi mount
  const [arranged, setArranged] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(() => [...words].sort(() => Math.random() - 0.5));

  const addWord = (word: string, idx: number) => {
    if (submitted) return;
    const newArranged = [...arranged, word];
    const newRemaining = remaining.filter((_, i) => i !== idx);
    setArranged(newArranged);
    setRemaining(newRemaining);
    if (newRemaining.length === 0) {
      onAnswer(newArranged.join(" "));
    }
  };

  const removeWord = (idx: number) => {
    if (submitted) return;
    const word = arranged[idx];
    setArranged(arranged.filter((_, i) => i !== idx));
    setRemaining([...remaining, word]);
  };

  const isCorrect = submitted && correctAnswer && arranged.join(" ").toLowerCase() === correctAnswer.toLowerCase();

  return (
    <div className="space-y-4">
      {/* Arranged sentence */}
      <div
        className={cn(
          "min-h-12 p-3 rounded-xl border-2 flex flex-wrap gap-2 transition-colors",
          !submitted && "border-slate-200 bg-slate-50",
          submitted && isCorrect && "border-green-400 bg-green-50",
          submitted && !isCorrect && correctAnswer && "border-red-400 bg-red-50",
        )}
      >
        {arranged.length === 0 ? (
          <p className="text-slate-400 text-sm self-center">Nhấn vào từ bên dưới để sắp xếp...</p>
        ) : (
          arranged.map((word, i) => (
            <button
              key={i}
              onClick={() => removeWord(i)}
              disabled={submitted}
              className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-70"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((word, i) => (
            <button
              key={i}
              onClick={() => addWord(word, i)}
              disabled={submitted}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {submitted && !isCorrect && correctAnswer && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-green-700">
            Đáp án đúng: <span className="font-semibold">{correctAnswer}</span>
          </p>
        </div>
      )}
    </div>
  );
}
