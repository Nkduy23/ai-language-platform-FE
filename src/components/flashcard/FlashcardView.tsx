// Single flashcard with flip animation
"use client";

import { useState } from "react";
import { Volume2, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Badge from "@/components/ui/Badge";
import type { VocabularyCard } from "@/types";
import { LANGUAGES } from "@/lib/constants/app";

interface FlashcardViewProps {
  card: VocabularyCard;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export default function FlashcardView({ card, isFavorited, onToggleFavorite }: FlashcardViewProps) {
  const [flipped, setFlipped] = useState(false);

  const speak = () => {
    if (typeof window === "undefined") return;
    const lang = LANGUAGES[card.language.code]?.locale || "en-US";
    const utterance = new SpeechSynthesisUtterance(card.word);
    utterance.lang = lang;
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flashcard-container w-full max-w-lg mx-auto" style={{ height: 320 }}>
      <div className={cn("flashcard-inner w-full h-full cursor-pointer", flipped && "flipped")} onClick={() => setFlipped(!flipped)}>
        {/* Front — chỉ hiện từ */}
        <div className="flashcard-front absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col items-center justify-center p-8 select-none">
          <Badge level={card.level} className="mb-4">
            {card.level}
          </Badge>

          <p className="text-4xl font-bold text-slate-900 text-center mb-3">{card.word}</p>

          {card.pronunciation && <p className="text-slate-400 text-base font-mono">{card.pronunciation}</p>}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-brand rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Phát âm
            </button>

            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {isFavorited ? <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> : <StarOff className="w-5 h-5 text-slate-300" />}
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 mt-6">Nhấn để xem nghĩa</p>
        </div>

        {/* Back — nghĩa + ví dụ */}
        <div className="flashcard-back absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-card flex flex-col justify-between p-8 select-none">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Nghĩa</p>
            <p className="text-white text-2xl font-bold">{card.meaningVi}</p>
            {card.meaningEn && <p className="text-blue-200 text-sm mt-1 italic">{card.meaningEn}</p>}
          </div>

          {card.exampleSentence && (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-200 text-xs font-medium mb-1">Ví dụ</p>
              <p className="text-white text-sm leading-relaxed">{card.exampleSentence}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Phát âm
            </button>
            <p className="text-blue-200 text-xs">Nhấn để lật lại</p>
          </div>
        </div>
      </div>
    </div>
  );
}
