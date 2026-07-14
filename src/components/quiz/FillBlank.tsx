"use client";

import { useRef, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FillBlankProps {
  value: string;
  onChange: (val: string) => void;
  correctAnswer?: string; // chỉ có sau khi submit toàn bộ bài
  submitted?: boolean; // true = đã bấm nộp câu này
  onSubmit?: () => void;
}

export default function FillBlank({ value, onChange, correctAnswer, submitted, onSubmit }: FillBlankProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!submitted) inputRef.current?.focus();
  }, [submitted]);

  // Chỉ tính đúng/sai khi đã submitted VÀ có correctAnswer từ server
  const hasResult = submitted && correctAnswer !== undefined;
  const isCorrect = hasResult && value.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && onSubmit?.()}
          disabled={submitted}
          placeholder="Nhập câu trả lời..."
          className={cn(
            "w-full px-4 py-3.5 pr-12 rounded-md border-2 text-sm font-medium transition-all bg-postcard",
            "focus:outline-none placeholder:text-ink-muted/60",
            // Chưa submit → border bình thường
            !submitted && "border-paper-line focus:border-airmail",
            // Đã submit + có kết quả → hiện màu
            hasResult && isCorrect && "border-stamp-teal bg-stamp-teal/10 text-[#1E6E63]",
            hasResult && !isCorrect && "border-airmail bg-airmail/10 text-airmail-dark",
            // Đã submit nhưng chưa có kết quả từ server → giữ neutral
            submitted && !hasResult && "border-paper-line bg-postcard-dark text-ink-muted",
          )}
        />
        {hasResult && <div className="absolute right-3 top-1/2 -translate-y-1/2">{isCorrect ? <CheckCircle className="w-5 h-5 text-stamp-teal" /> : <XCircle className="w-5 h-5 text-airmail" />}</div>}
      </div>

      {hasResult && !isCorrect && correctAnswer && (
        <div className="flex items-center gap-2 px-4 py-3 bg-stamp-teal/10 rounded-md border-[1.5px] border-stamp-teal/30">
          <CheckCircle className="w-4 h-4 text-stamp-teal flex-shrink-0" />
          <p className="text-sm text-[#1E6E63]">
            Đáp án đúng: <span className="font-semibold">{correctAnswer}</span>
          </p>
        </div>
      )}
    </div>
  );
}
