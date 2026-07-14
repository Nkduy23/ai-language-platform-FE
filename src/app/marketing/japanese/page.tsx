// Japanese landing page (SEO)
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Học Tiếng Nhật Online Cùng AI — Miễn Phí",
  description: "Học tiếng Nhật online với AI. Hiragana, Katakana, Kanji, JLPT N5-N1. Hội thoại thực tế. Bắt đầu miễn phí.",
  keywords: ["học tiếng Nhật", "học tiếng Nhật online", "tiếng Nhật AI", "JLPT", "hiragana", "kanji"],
  openGraph: {
    title: "Học Tiếng Nhật Online Cùng AI",
    description: "Học tiếng Nhật với AI. Hiragana, Kanji, JLPT, hội thoại thực tế.",
  },
};

const TOPICS = ["Hiragana & Katakana", "Kanji cơ bản", "Ẩm thực Nhật", "Du lịch Nhật Bản", "Văn hóa Nhật", "Anime & Manga"];

export default function JapanesePage() {
  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <span className="text-3xl sm:text-4xl">🇯🇵</span>
          <span className="text-xs sm:text-sm text-[#8A6425] bg-gold-foil/15 border-[1.5px] border-gold-foil/40 px-3 py-1 rounded-full font-medium">Tiếng Nhật · 日本語</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-navy mb-4 leading-tight">
          Học Tiếng Nhật Online
          <br />
          <span className="text-[#8A6425] italic">Từ Zero Cùng AI</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-muted mb-6 sm:mb-8 max-w-2xl">
          Học tiếng Nhật từ Hiragana cơ bản đến JLPT N1. Phát âm chuẩn, từ vựng thực tế, hội thoại với AI như người Nhật thật.
        </p>
        <Link
          href="/auth/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-foil text-ink-navy font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity shadow-stamp"
        >
          Học tiếng Nhật miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <section className="bg-postcard-dark py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl mb-5 sm:mb-6">Chủ đề học</h2>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {TOPICS.map((t) => (
              <span key={t} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gold-foil/15 text-[#8A6425] rounded-full text-xs sm:text-sm font-medium">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-navy py-10 sm:py-12 text-center px-4">
        <h2 className="text-lg sm:text-2xl font-display font-bold text-postcard mb-3">日本語を始めましょう！ Bắt đầu học tiếng Nhật</h2>
        <p className="text-sm sm:text-base text-postcard/70 mb-6">Miễn phí · Không cần thẻ tín dụng</p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-gold-foil text-ink-navy font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base shadow-stamp"
        >
          Đăng ký miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
