// Sidebar hiển thị lỗi ngữ pháp + gợi ý + từ mới cho 1 tin nhắn assistant được chọn
import { AlertCircle, Lightbulb, Sparkles, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import type { ChatMessage } from "@/types";

interface Props {
  message: ChatMessage | null;
}

export default function GrammarSidebar({ message }: Props) {
  if (!message || !message.grammarNote) {
    return <Card className="h-full flex items-center justify-center text-center text-sm text-ink-muted">Chọn 1 tin nhắn của AI để xem phân tích ngữ pháp & từ vựng mới</Card>;
  }

  const { errors, suggestions, naturalAlternative } = message.grammarNote;

  return (
    <Card className="h-full overflow-y-auto space-y-5">
      <div>
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-navy mb-2">
          <AlertCircle className="w-4 h-4 text-airmail" /> Lỗi ngữ pháp
        </h3>
        {errors.length === 0 ? (
          <p className="text-sm text-stamp-teal">Không có lỗi nào — tốt lắm! 🎉</p>
        ) : (
          <ul className="space-y-2">
            {errors.map((err, i) => (
              <li key={i} className="text-sm bg-airmail/10 rounded-md p-2.5 border-[1.5px] border-airmail/15">
                <p className="line-through text-airmail-dark">{err.original}</p>
                <p className="text-stamp-teal font-medium">{err.correction}</p>
                <p className="text-ink-muted text-xs mt-1">{err.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {suggestions.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-navy mb-2">
            <Lightbulb className="w-4 h-4 text-gold-foil" /> Gợi ý
          </h3>
          <ul className="space-y-1.5 text-sm text-ink-muted list-disc list-inside">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {naturalAlternative && (
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-navy mb-2">
            <Sparkles className="w-4 h-4 text-airmail" /> Diễn đạt tự nhiên hơn
          </h3>
          <p className="text-sm bg-airmail/5 rounded-md p-2.5 text-ink-navy border-[1.5px] border-airmail/15">{naturalAlternative}</p>
        </div>
      )}

      {message.newWords && message.newWords.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-navy mb-2">
            <BookOpen className="w-4 h-4 text-ink-navy" /> Từ mới
          </h3>
          <ul className="space-y-1.5 text-sm">
            {message.newWords.map((w, i) => (
              <li key={i} className="flex justify-between bg-ink-navy/5 rounded-md px-2.5 py-1.5">
                <span className="font-medium">{w.word}</span>
                <span className="text-ink-muted">{w.meaningVi}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
