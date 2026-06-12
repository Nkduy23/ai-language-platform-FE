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
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Hoàn thành!</h2>
        <p className="text-slate-500 text-sm mb-6">Bạn đã học {stats.total} từ</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-600">{stats.know}</p>
            <p className="text-xs text-green-500 mt-1">Đã biết</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.hard}</p>
            <p className="text-xs text-yellow-500 mt-1">Còn khó</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-600">{stats.dontknow}</p>
            <p className="text-xs text-red-500 mt-1">Chưa biết</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-brand">
          <span className="text-lg font-bold">+{stats.xpEarned} XP</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 text-sm">Độ chính xác: {accuracy}%</span>
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
        <span className="text-sm text-slate-500 flex-shrink-0">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Flashcard */}
      <FlashcardView card={currentCard} isFavorited={favoritedIds.has(currentCard.id)} onToggleFavorite={handleToggleFavorite} />

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handleResult("dontknow")}
          disabled={isSubmitting}
          className={cn("flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all", "border-red-200 hover:border-red-400 hover:bg-red-50 disabled:opacity-50")}
        >
          <XCircle className="w-6 h-6 text-red-400" />
          <span className="text-xs font-medium text-red-400">Chưa biết</span>
        </button>

        <button
          onClick={() => handleResult("hard")}
          disabled={isSubmitting}
          className={cn("flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all", "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-50")}
        >
          <AlertCircle className="w-6 h-6 text-yellow-400" />
          <span className="text-xs font-medium text-yellow-500">Còn khó</span>
        </button>

        <button
          onClick={() => handleResult("know")}
          disabled={isSubmitting}
          className={cn("flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all", "border-green-200 hover:border-green-400 hover:bg-green-50 disabled:opacity-50")}
        >
          <CheckCircle className="w-6 h-6 text-green-400" />
          <span className="text-xs font-medium text-green-500">Đã biết</span>
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">Nhấn vào thẻ để xem nghĩa, rồi chọn mức độ nhớ</p>
    </div>
  );
}
