// Demo sản phẩm thật — khung trình duyệt giả lập, chuyển tab giữa 3 tính năng
// trực quan nhất (Flashcard, AI Chat, Quiz). Dùng 3 ảnh riêng thay vì gộp 1 ảnh
// để mỗi tính năng được nhìn rõ ràng, đồng thời giữ trang gọn (chỉ 1 ảnh hiện
// tại một lúc, không phải cuộn qua 3 ảnh lớn liên tiếp).
//
// ĐỂ THAY ẢNH THẬT: đặt file vào /public/screenshots/ theo đúng tên bên dưới,
// rồi thay khối placeholder (div có border-dashed) bằng:
//   <img src="/screenshots/<file>" alt={tab.label} className="w-full h-full object-cover" />
// Kích thước đề xuất: 1280×800px (tỉ lệ ~16:10), định dạng png/webp, nền sáng
// để hợp với khung trình duyệt postcard-cream bên ngoài.
"use client";

import { useState } from "react";
import { BookOpen, MessageCircle, Brain, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "flashcard", label: "Flashcard", icon: BookOpen, file: "flashcard.png", accent: "text-stamp-teal", bg: "bg-stamp-teal/10" },
  { key: "chat", label: "AI Chat", icon: MessageCircle, file: "chat.png", accent: "text-airmail", bg: "bg-airmail/10" },
  { key: "quiz", label: "Quiz", icon: Brain, file: "quiz.png", accent: "text-gold-foil", bg: "bg-gold-foil/15" },
] as const;

export default function ProductShowcase() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("flashcard");
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex justify-center gap-2 mb-5 sm:mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium border-[1.5px] transition-colors",
              active === tab.key ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30",
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browser chrome mockup */}
      <div className="postcard-corner bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp overflow-hidden max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-postcard-dark border-b-[1.5px] border-paper-line">
          <span className="w-2.5 h-2.5 rounded-full bg-airmail/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-gold-foil/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-stamp-teal/60" />
          <div className="flex-1 mx-3 bg-postcard rounded-md px-3 py-1 text-[10px] sm:text-xs text-ink-muted font-mono text-center truncate">
            app.flueni.id.vn/dashboard/{activeTab.key}
          </div>
        </div>

        {/* Screen area — thay bằng ảnh thật khi có (xem hướng dẫn đầu file) */}
        <div className={cn("aspect-[16/10] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-paper-line m-3 rounded-md", activeTab.bg)}>
          <div className={cn("w-14 h-14 rounded-full bg-postcard flex items-center justify-center", activeTab.accent)}>
            <activeTab.icon className="w-6 h-6" />
          </div>
          <div className="text-center px-4">
            <p className={cn("text-sm font-semibold", activeTab.accent)}>Ảnh chụp màn hình: {activeTab.label}</p>
            <p className="text-xs text-ink-muted/70 mt-1 flex items-center justify-center gap-1">
              <ImageIcon className="w-3 h-3" /> /public/screenshots/{activeTab.file} · đề xuất 1280×800px
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
