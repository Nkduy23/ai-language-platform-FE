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
        {/* Front — thẻ bưu thiếp: viền cứng, góc bẻ giấy */}
        <div className="flashcard-front postcard-corner absolute inset-0 bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp flex flex-col items-center justify-center p-5 sm:p-8 select-none">
          <Badge level={card.level} className="mb-4">
            {card.level}
          </Badge>

          <p className="text-3xl sm:text-4xl font-display font-bold text-ink-navy text-center mb-3 break-words">{card.word}</p>

          {card.pronunciation && <p className="text-ink-muted text-sm sm:text-base font-mono">{card.pronunciation}</p>}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak();
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-airmail/10 text-airmail rounded-md text-sm font-medium hover:bg-airmail/20 transition-colors"
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
                className="p-2 rounded-md hover:bg-postcard-dark transition-colors"
              >
                {isFavorited ? <Star className="w-5 h-5 text-gold-foil fill-gold-foil" /> : <StarOff className="w-5 h-5 text-paper-line" />}
              </button>
            )}
          </div>

          <p className="text-xs text-ink-muted/60 mt-6">Nhấn để xem nghĩa</p>
        </div>

        {/* Back — mặt sau bưu thiếp, có đường kẻ kiểu ô ghi địa chỉ */}
        <div className="flashcard-back postcard-corner absolute inset-0 bg-ink-navy rounded-md border-[1.5px] border-ink-navy-dark shadow-stamp flex flex-col justify-between p-5 sm:p-8 select-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, #F5EFE0 27px, #F5EFE0 28px)" }}
          />
          <div className="relative">
            <p className="text-postcard/60 text-sm font-medium mb-1">Nghĩa</p>
            <p className="text-postcard text-xl sm:text-2xl font-display font-bold break-words">{card.meaningVi}</p>
            {card.meaningEn && <p className="text-postcard/60 text-sm mt-1 italic">{card.meaningEn}</p>}
          </div>

          {card.exampleSentence && (
            <div className="relative bg-white/10 rounded-md p-3 sm:p-4 border border-white/10">
              <p className="text-postcard/60 text-xs font-medium mb-1">Ví dụ</p>
              <p className="text-postcard text-sm leading-relaxed">{card.exampleSentence}</p>
            </div>
          )}

          <div className="relative flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-postcard rounded-md text-sm hover:bg-white/20 transition-colors border border-white/10"
            >
              <Volume2 className="w-4 h-4" />
              Phát âm
            </button>
            <p className="text-postcard/60 text-xs">Nhấn để lật lại</p>
          </div>
        </div>
      </div>
    </div>
  );
}
