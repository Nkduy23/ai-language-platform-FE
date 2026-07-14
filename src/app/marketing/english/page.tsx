// English landing page (SEO)
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Học Tiếng Anh Online Cùng AI — Miễn Phí",
  description: "Học tiếng Anh online hiệu quả với AI. Luyện từ vựng A1-C2, ngữ pháp, hội thoại thực tế. Phát âm chuẩn với Web Speech. Bắt đầu miễn phí.",
  keywords: ["học tiếng Anh", "học tiếng Anh online", "tiếng Anh AI", "luyện tiếng Anh miễn phí"],
  openGraph: {
    title: "Học Tiếng Anh Online Cùng AI",
    description: "Học tiếng Anh hiệu quả với AI. Từ vựng, ngữ pháp, hội thoại thực tế.",
    url: "https://ailanguage.com/marketing/english",
  },
};

const LEVELS = [
  { level: "A1–A2", label: "Beginner", desc: "Từ vựng cơ bản, câu đơn giản, chào hỏi" },
  { level: "B1–B2", label: "Intermediate", desc: "Hội thoại hàng ngày, ngữ pháp trung cấp" },
  { level: "C1–C2", label: "Advanced", desc: "Tiếng Anh công việc, phỏng vấn, học thuật" },
];

const TOPICS = ["Giao tiếp hàng ngày", "Du lịch", "Công việc & Email", "Phỏng vấn", "Học thuật", "Ẩm thực"];

export default function EnglishPage() {
  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <span className="text-3xl sm:text-4xl">🇺🇸</span>
          <span className="text-xs sm:text-sm text-lang-en bg-lang-en/10 border-[1.5px] border-lang-en/30 px-3 py-1 rounded-full font-medium">Tiếng Anh · English</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-navy mb-4 leading-tight">
          Học Tiếng Anh Online
          <br />
          <span className="text-lang-en italic">Cùng AI Thông Minh</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-muted mb-6 sm:mb-8 max-w-2xl">
          Từ A1 đến C2, luyện tập hội thoại thực tế với AI như đang nói chuyện với người bản ngữ. Flashcard thông minh, Quiz đa dạng, phát âm chuẩn.
        </p>
        <Link
          href="/auth/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-lang-en text-postcard font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity shadow-stamp"
        >
          Học tiếng Anh miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Levels */}
      <section className="bg-postcard-dark py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl mb-5 sm:mb-6">Phù hợp mọi trình độ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LEVELS.map((l) => (
              <div key={l.level} className="postcard-corner bg-postcard rounded-md border-[1.5px] border-lang-en/30 p-5 shadow-stamp-sm">
                <div className="text-lang-en font-display font-bold text-lg mb-1">{l.level}</div>
                <div className="font-medium text-ink-navy mb-1">{l.label}</div>
                <div className="text-sm text-ink-muted">{l.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <h2 className="text-lg sm:text-xl mb-5 sm:mb-6">Chủ đề học đa dạng</h2>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {TOPICS.map((t) => (
            <span key={t} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-lang-en/10 text-lang-en rounded-full text-xs sm:text-sm font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-navy py-10 sm:py-12 text-center px-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-postcard mb-3">Bắt đầu học tiếng Anh ngay</h2>
        <p className="text-sm sm:text-base text-postcard/70 mb-6">Miễn phí · Không cần thẻ tín dụng</p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-lang-en text-postcard font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base shadow-stamp"
        >
          Đăng ký miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
