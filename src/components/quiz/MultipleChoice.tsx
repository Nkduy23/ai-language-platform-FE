// Multiple choice component
"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MultipleChoiceProps {
  options: string[];
  correctAnswer?: string; // chỉ có sau khi submit
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export default function MultipleChoice({ options, correctAnswer, selectedAnswer, onSelect, disabled }: MultipleChoiceProps) {
  const getStyle = (option: string) => {
    if (!selectedAnswer) {
      return "border-paper-line hover:border-airmail hover:bg-airmail/5 text-ink-navy";
    }
    if (correctAnswer) {
      if (option === correctAnswer) return "border-stamp-teal bg-stamp-teal/10 text-[#1E6E63]";
      if (option === selectedAnswer && option !== correctAnswer) return "border-airmail bg-airmail/10 text-airmail-dark";
    }
    if (option === selectedAnswer) return "border-airmail bg-airmail/10 text-airmail";
    return "border-paper-line text-ink-muted/60";
  };

  const getIcon = (option: string) => {
    if (!correctAnswer || !selectedAnswer) return null;
    if (option === correctAnswer) return <CheckCircle className="w-5 h-5 text-stamp-teal flex-shrink-0" />;
    if (option === selectedAnswer) return <XCircle className="w-5 h-5 text-airmail flex-shrink-0" />;
    return null;
  };

  return (
    <div className="space-y-3">
      {options.map((option, i) => (
        <button
          key={i}
          onClick={() => !disabled && onSelect(option)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-md border-2 text-sm font-medium text-left transition-all duration-150",
            "disabled:cursor-not-allowed",
            getStyle(option),
          )}
        >
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 font-mono">{String.fromCharCode(65 + i)}</span>
            <span>{option}</span>
          </div>
          {getIcon(option)}
        </button>
      ))}
    </div>
  );
}
