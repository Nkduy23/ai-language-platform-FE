// Fill in the blank
"use client";

import { useRef, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FillBlankProps {
  value: string;
  onChange: (val: string) => void;
  correctAnswer?: string;
  submitted?: boolean;
  onSubmit?: () => void;
}

export default function FillBlank({ value, onChange, correctAnswer, submitted, onSubmit }: FillBlankProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!submitted) inputRef.current?.focus();
  }, [submitted]);

  const isCorrect = submitted && correctAnswer && value.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          disabled={submitted}
          placeholder="Nhập câu trả lời..."
          className={cn(
            "w-full px-4 py-3.5 pr-12 rounded-xl border-2 text-sm font-medium transition-all",
            "focus:outline-none placeholder:text-slate-400",
            !submitted && "border-slate-200 focus:border-brand",
            submitted && isCorrect && "border-green-400 bg-green-50 text-green-700",
            submitted && !isCorrect && "border-red-400 bg-red-50 text-red-600",
          )}
        />
        {submitted && <div className="absolute right-3 top-1/2 -translate-y-1/2">{isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />}</div>}
      </div>

      {submitted && !isCorrect && correctAnswer && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">
            Đáp án đúng: <span className="font-semibold">{correctAnswer}</span>
          </p>
        </div>
      )}
    </div>
  );
}
