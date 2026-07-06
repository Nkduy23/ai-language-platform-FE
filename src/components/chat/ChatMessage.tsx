// Bong bóng chat 1 tin nhắn (user hoặc assistant)
import { cn } from "@/lib/utils/cn";
import type { ChatMessage as ChatMessageType } from "@/types";
import { Bot, User } from "lucide-react";

interface Props {
  message: ChatMessageType;
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function ChatMessage({ message, onSelect, isSelected }: Props) {
  const isUser = message.role === "user" || message.role === "USER";
  const hasFeedback = !isUser && message.grammarNote;

  return (
    <div className={cn("flex gap-2 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-brand" />
        </div>
      )}
      <button
        onClick={hasFeedback ? onSelect : undefined}
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm text-left",
          isUser ? "bg-brand text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm",
          hasFeedback && "cursor-pointer hover:ring-2 hover:ring-brand/40",
          isSelected && "ring-2 ring-brand",
        )}
      >
        {message.content}
        {hasFeedback && <div className="mt-1 text-xs opacity-60">Chạm để xem nhận xét ngữ pháp →</div>}
      </button>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </div>
  );
}
