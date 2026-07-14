// Khung chat chính — danh sách tin nhắn + input, tự scroll xuống cuối
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import type { ChatMessage as ChatMessageType } from "@/types";
import { MessageCircle } from "lucide-react";

interface Props {
  messages: ChatMessageType[];
  onSend: (content: string) => void;
  onSelectMessage: (message: ChatMessageType) => void;
  selectedMessageId?: string;
  isSending?: boolean;
  usage?: { used: number; limit: number } | null;
}

export default function ChatWindow({ messages, onSend, onSelectMessage, selectedMessageId, isSending, usage }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full bg-postcard rounded-md border-[1.5px] border-surface-border overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
            <MessageCircle className="w-8 h-8" />
            Bắt đầu trò chuyện với AI để luyện phản xạ nhé!
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} onSelect={() => onSelectMessage(m)} isSelected={m.id === selectedMessageId} />)
        )}
        {isSending && <p className="text-xs text-slate-400 italic">AI đang trả lời...</p>}
        <div ref={bottomRef} />
      </div>

      {usage && (
        <div className="px-4 py-1.5 text-xs text-slate-500 border-t border-surface-border bg-slate-50">
          Đã dùng {usage.used}/{usage.limit} tin nhắn miễn phí hôm nay
        </div>
      )}

      <ChatInput onSend={onSend} disabled={isSending} />
    </div>
  );
}
