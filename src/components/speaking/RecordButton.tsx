// Nút bấm giữ để ghi âm (giống voice message)
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Props {
  isRecording: boolean;
  isAnalyzing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function RecordButton({ isRecording, isAnalyzing, onStart, onStop }: Props) {
  const handleClick = () => {
    if (isAnalyzing) return;
    if (isRecording) onStop();
    else onStart();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isAnalyzing}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-stamp disabled:opacity-60",
          isRecording ? "bg-airmail-dark animate-pulse" : "bg-airmail hover:bg-airmail-dark",
        )}
      >
        {isAnalyzing ? (
          <Loader2 className="w-8 h-8 text-postcard animate-spin" />
        ) : isRecording ? (
          <Square className="w-7 h-7 text-postcard" fill="currentColor" />
        ) : (
          <Mic className="w-8 h-8 text-postcard" />
        )}
      </button>
      <p className="text-sm text-ink-muted">{isAnalyzing ? "Đang phân tích..." : isRecording ? "Bấm để dừng ghi âm" : "Bấm để bắt đầu nói"}</p>
    </div>
  );
}
