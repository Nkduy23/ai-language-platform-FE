// Chọn ngôn ngữ đang học — dùng chung ở learn, quiz, chat, profile settings...
import { LANGUAGES } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";
import type { LanguageCode } from "@/types";

interface Props {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  className?: string;
}

// Mỗi ngôn ngữ có 1 màu nhận diện riêng, dùng nhất quán xuyên suốt app
const LANG_ACCENT: Record<LanguageCode, string> = {
  EN: "border-lang-en bg-lang-en/10 text-lang-en",
  ZH: "border-lang-zh bg-lang-zh/10 text-lang-zh",
  JA: "border-lang-ja bg-lang-ja/10 text-[#8A6425]",
};

export default function LanguageSelector({ value, onChange, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={cn(
            "flex-1 min-w-[100px] rounded-md border-[1.5px] px-3 py-2 text-sm font-medium transition-colors",
            value === code ? LANG_ACCENT[code] : "border-surface-border text-ink-muted hover:border-ink-navy/30",
          )}
        >
          {LANGUAGES[code].flag} {LANGUAGES[code].name}
        </button>
      ))}
    </div>
  );
}
