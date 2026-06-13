// Multiple choice component
"use client";

import { useState } from "react";
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
      return "border-slate-200 hover:border-brand hover:bg-blue-50 text-slate-700";
    }
    if (correctAnswer) {
      if (option === correctAnswer) return "border-green-400 bg-green-50 text-green-700";
      if (option === selectedAnswer && option !== correctAnswer) return "border-red-400 bg-red-50 text-red-600";
    }
    if (option === selectedAnswer) return "border-brand bg-blue-50 text-brand";
    return "border-slate-200 text-slate-400";
  };

  const getIcon = (option: string) => {
    if (!correctAnswer || !selectedAnswer) return null;
    if (option === correctAnswer) return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
    if (option === selectedAnswer) return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
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
            "w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-medium text-left transition-all duration-150",
            "disabled:cursor-not-allowed",
            getStyle(option),
          )}
        >
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0">{String.fromCharCode(65 + i)}</span>
            <span>{option}</span>
          </div>
          {getIcon(option)}
        </button>
      ))}
    </div>
  );
}
