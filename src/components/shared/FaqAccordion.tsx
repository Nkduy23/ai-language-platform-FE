// Accordion FAQ — dùng ở cuối trang Home
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="postcard-corner bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp-sm overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-ink-navy text-sm sm:text-base">{item.question}</span>
              <ChevronDown className={cn("w-4 h-4 text-airmail flex-shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            <div
              className={cn("grid transition-all duration-200 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
              style={{ display: "grid" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-ink-muted leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
