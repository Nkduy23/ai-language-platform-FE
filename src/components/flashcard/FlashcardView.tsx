// Single flashcard with flip animation
"use client";

import { useEffect, useState } from "react";
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

  // Card mới (đổi id) → tự động lật lại về mặt trước, tránh việc user phải tự
  // bấm lật lại khi đã next sang từ tiếp theo mà mặt thẻ vẫn đang ở mặt sau.
  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

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

        {/* Back */}
        <div className="flashcard-back postcard-corner absolute inset-0 bg-ink-navy rounded-md border-[1.5px] border-ink-navy-dark shadow-stamp flex flex-col overflow-hidden select-none">
          {/* Nội dung */}
          <div className="flex-1 flex flex-col justify-center gap-5 p-6 sm:p-8">
            <div>
              <p className="text-postcard/60 text-sm font-medium mb-1">Nghĩa</p>

              <p className="text-postcard text-2xl sm:text-3xl font-display font-bold break-words">{card.meaningVi}</p>

              {card.meaningEn && <p className="text-postcard/60 italic text-sm mt-2">{card.meaningEn}</p>}
            </div>

            {card.exampleSentence && (
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-postcard/60 text-xs uppercase tracking-wide mb-2">Ví dụ</p>

                <p className="text-postcard text-sm leading-7">{card.exampleSentence}</p>
              </div>
            )}
          </div>

          {/* Footer postcard */}
          <div className="relative h-16 border-t border-white/10 flex items-center justify-between px-6 sm:px-8 flex-shrink-0">
            {/* Đường chia địa chỉ */}
            <div className="absolute right-36 top-0 bottom-0 w-px bg-white/10" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                speak();
              }}
              className="relative z-10 flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-postcard text-sm transition-colors hover:bg-white/20"
            >
              <Volume2 className="w-4 h-4" />
              Phát âm
            </button>

            <p className="relative z-10 text-xs text-postcard/60">Nhấn để lật lại</p>
          </div>
        </div>
      </div>
    </div>
  );
}
