// Chọn ngôn ngữ đang học — dùng chung ở learn, quiz, chat, profile settings...
import { LANGUAGES } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";
import type { LanguageCode } from "@/types";

interface Props {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  className?: string;
}

export default function LanguageSelector({ value, onChange, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={cn(
            "flex-1 min-w-[100px] rounded-lg border px-3 py-2 text-sm transition-colors",
            value === code ? "border-brand bg-brand/5 text-brand font-medium" : "border-surface-border text-slate-600 hover:border-slate-300",
          )}
        >
          {LANGUAGES[code].flag} {LANGUAGES[code].name}
        </button>
      ))}
    </div>
  );
}
