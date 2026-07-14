// Chinese landing page (SEO)
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Học Tiếng Trung Online Cùng AI — Miễn Phí",
  description: "Học tiếng Trung Mandarin online với AI. Pinyin chuẩn, từ vựng HSK, hội thoại thực tế. Bắt đầu miễn phí.",
  keywords: ["học tiếng Trung", "học tiếng Trung online", "tiếng Trung AI", "HSK", "pinyin"],
  openGraph: {
    title: "Học Tiếng Trung Online Cùng AI",
    description: "Học tiếng Trung Mandarin với AI. Pinyin, HSK, hội thoại thực tế.",
  },
};

const TOPICS = ["Chào hỏi cơ bản", "Ẩm thực Trung Hoa", "Đi lại & Du lịch", "Mua sắm", "Công việc", "Văn hóa Trung Quốc"];

export default function ChinesePage() {
  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <span className="text-3xl sm:text-4xl">🇨🇳</span>
          <span className="text-xs sm:text-sm text-lang-zh bg-lang-zh/10 border-[1.5px] border-lang-zh/30 px-3 py-1 rounded-full font-medium">Tiếng Trung · 中文</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-navy mb-4 leading-tight">
          Học Tiếng Trung Online
          <br />
          <span className="text-lang-zh italic">Pinyin Chuẩn Cùng AI</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-muted mb-6 sm:mb-8 max-w-2xl">Học tiếng Trung Mandarin từ cơ bản đến nâng cao. Phát âm Pinyin chuẩn, từ vựng HSK, hội thoại thực tế với AI.</p>
        <Link
          href="/auth/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-lang-zh text-postcard font-semibold px-6 py-3 rounded-md hover:bg-airmail-dark transition-colors shadow-stamp"
        >
          Học tiếng Trung miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <section className="bg-postcard-dark py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl mb-5 sm:mb-6">Chủ đề học</h2>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {TOPICS.map((t) => (
              <span key={t} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-lang-zh/10 text-lang-zh rounded-full text-xs sm:text-sm font-medium">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-navy py-10 sm:py-12 text-center px-4">
        <h2 className="text-lg sm:text-2xl font-display font-bold text-postcard mb-3">开始学中文！ Bắt đầu học tiếng Trung</h2>
        <p className="text-sm sm:text-base text-postcard/70 mb-6">Miễn phí · Không cần thẻ tín dụng</p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-lang-zh text-postcard font-bold px-6 py-3 rounded-md hover:bg-airmail-dark transition-colors text-sm sm:text-base shadow-stamp"
        >
          Đăng ký miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
