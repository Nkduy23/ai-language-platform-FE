// Ô nhập tin nhắn + nút gửi
import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-surface-border p-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Nhập tin nhắn... (Enter để gửi)"
        className="flex-1 resize-none rounded-lg border border-surface-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
      />
      <Button onClick={handleSend} disabled={disabled || !value.trim()} size="md">
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
