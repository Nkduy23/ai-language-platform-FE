// Flashcard SRS session manager
"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RotateCcw, Trophy } from "lucide-react";
import FlashcardView from "./FlashcardView";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import { vocabularyApi } from "@/lib/api/vocabulary";
import type { VocabularyCard, FlashcardResult } from "@/types";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

interface FlashcardSessionProps {
  cards: VocabularyCard[];
  onComplete?: (stats: SessionStats) => void;
  onRestart?: () => void;
}

interface SessionStats {
  total: number;
  know: number;
  hard: number;
  dontknow: number;
  xpEarned: number;
}

export default function FlashcardSession({ cards, onComplete, onRestart }: FlashcardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<SessionStats>({ total: cards.length, know: 0, hard: 0, dontknow: 0, xpEarned: 0 });
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;

  const handleResult = async (result: FlashcardResult) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await vocabularyApi.submitFlashcardResult(currentCard.id, result);
      const xpEarned = res.xpEarned || 0;

      setStats((prev) => ({
        ...prev,
        [result]: prev[result] + 1,
        xpEarned: prev.xpEarned + xpEarned,
      }));

      if (xpEarned > 0) {
        toast.success(`+${xpEarned} XP`, { duration: 1000, icon: "⚡" });
      }
    } catch {
      // Không block UX nếu API lỗi
    } finally {
      setIsSubmitting(false);
    }

    if (currentIndex + 1 >= cards.length) {
      setIsDone(true);
      onComplete?.(stats);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleToggleFavorite = async () => {
    const id = currentCard.id;
    try {
      const res = await vocabularyApi.toggleFavorite(id);
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        res.favorited ? next.add(id) : next.delete(id);
        return next;
      });
      toast.success(res.favorited ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích", { duration: 1500 });
    } catch {
      toast.error("Không thể cập nhật");
    }
  };

  // Màn hình kết quả
  if (isDone) {
    const accuracy = Math.round((stats.know / stats.total) * 100);
    return (
      <Card className="max-w-lg mx-auto text-center py-10">
        <div className="w-16 h-16 bg-gold-foil/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gold-foil" />
        </div>
        <h2 className="text-xl mb-1">Hoàn thành!</h2>
        <p className="text-ink-muted text-sm mb-6">Bạn đã học {stats.total} từ</p>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          <div className="bg-stamp-teal/10 rounded-md p-2.5 sm:p-4 border-[1.5px] border-stamp-teal/20">
            <p className="text-lg sm:text-2xl font-bold text-stamp-teal">{stats.know}</p>
            <p className="text-xs text-stamp-teal mt-1">Đã biết</p>
          </div>
          <div className="bg-gold-foil/10 rounded-md p-2.5 sm:p-4 border-[1.5px] border-gold-foil/25">
            <p className="text-lg sm:text-2xl font-bold text-[#8A6425]">{stats.hard}</p>
            <p className="text-xs text-[#8A6425] mt-1">Còn khó</p>
          </div>
          <div className="bg-airmail/10 rounded-md p-2.5 sm:p-4 border-[1.5px] border-airmail/20">
            <p className="text-lg sm:text-2xl font-bold text-airmail-dark">{stats.dontknow}</p>
            <p className="text-xs text-airmail-dark mt-1">Chưa biết</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-airmail">
          <span className="text-lg font-bold font-mono">+{stats.xpEarned} XP</span>
          <span className="text-ink-muted">·</span>
          <span className="text-ink-muted text-sm">Độ chính xác: {accuracy}%</span>
        </div>

        {onRestart && (
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Học lại
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <ProgressBar value={progress} className="flex-1" color="blue" size="sm" />
        <span className="text-sm text-ink-muted flex-shrink-0">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Flashcard */}
      <FlashcardView card={currentCard} isFavorited={favoritedIds.has(currentCard.id)} onToggleFavorite={handleToggleFavorite} />

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => handleResult("dontknow")}
          disabled={isSubmitting}
          className={cn(
            "flex flex-col items-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md border-[1.5px] transition-all flex-1 sm:flex-initial",
            "border-airmail/25 hover:border-airmail hover:bg-airmail/5 disabled:opacity-50",
          )}
        >
          <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-airmail" />
          <span className="text-xs font-medium text-airmail whitespace-nowrap">Chưa biết</span>
        </button>

        <button
          onClick={() => handleResult("hard")}
          disabled={isSubmitting}
          className={cn(
            "flex flex-col items-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md border-[1.5px] transition-all flex-1 sm:flex-initial",
            "border-gold-foil/40 hover:border-gold-foil hover:bg-gold-foil/10 disabled:opacity-50",
          )}
        >
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gold-foil" />
          <span className="text-xs font-medium text-[#8A6425] whitespace-nowrap">Còn khó</span>
        </button>

        <button
          onClick={() => handleResult("know")}
          disabled={isSubmitting}
          className={cn(
            "flex flex-col items-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md border-[1.5px] transition-all flex-1 sm:flex-initial",
            "border-stamp-teal/30 hover:border-stamp-teal hover:bg-stamp-teal/10 disabled:opacity-50",
          )}
        >
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-stamp-teal" />
          <span className="text-xs font-medium text-stamp-teal whitespace-nowrap">Đã biết</span>
        </button>
      </div>

      <p className="text-center text-xs text-ink-muted/70">Nhấn vào thẻ để xem nghĩa, rồi chọn mức độ nhớ</p>
    </div>
  );
}
