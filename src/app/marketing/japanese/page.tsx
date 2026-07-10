// Japanese landing page (SEO)
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🌐</span>
            </div>
            <span className="font-bold text-slate-900 text-sm truncate">AI Language</span>
          </Link>
          <Link href="/auth/register" className="text-xs sm:text-sm bg-brand text-white font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap flex-shrink-0">
            Bắt đầu miễn phí
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <span className="text-3xl sm:text-4xl">🇯🇵</span>
          <span className="text-xs sm:text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Tiếng Nhật · 日本語</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          Học Tiếng Nhật Online
          <br />
          <span className="text-brand">Từ Zero Cùng AI</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 max-w-2xl">
          Học tiếng Nhật từ Hiragana cơ bản đến JLPT N1. Phát âm chuẩn, từ vựng thực tế, hội thoại với AI như người Nhật thật.
        </p>
        <Link
          href="/auth/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors"
        >
          Học tiếng Nhật miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <section className="bg-slate-50 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-5 sm:mb-6">Chủ đề học</h2>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {TOPICS.map((t) => (
              <span key={t} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-xs sm:text-sm font-medium">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 text-center px-4" style={{ background: "linear-gradient(135deg, #bc002d 0%, #ff6b6b 100%)" }}>
        <h2 className="text-lg sm:text-2xl font-bold text-white mb-3">日本語を始めましょう！ Bắt đầu học tiếng Nhật</h2>
        <p className="text-sm sm:text-base text-red-200 mb-6">Miễn phí · Không cần thẻ tín dụng</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm sm:text-base">
          Đăng ký miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
