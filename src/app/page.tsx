import Link from "next/link";
import { ArrowRight, BookOpen, Brain, MessageCircle, Mic, CheckCircle, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Language Platform — Học Tiếng Anh, Trung, Nhật Cùng AI",
  description: "Nền tảng học ngoại ngữ AI-first. Luyện từ vựng, ngữ pháp, hội thoại với AI như giáo viên bản ngữ thật. Miễn phí.",
  openGraph: {
    title: "AI Language Platform — Học Ngoại Ngữ Cùng AI",
    description: "Học tiếng Anh, Trung, Nhật với AI. Flashcard, Quiz, AI Chat miễn phí.",
    url: "https://ailanguage.com",
  },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "Flashcard thông minh",
    desc: "Học từ vựng với hệ thống SRS, phát âm chuẩn bằng Web Speech API.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Brain,
    title: "Quiz đa dạng",
    desc: "Trắc nghiệm, điền từ, sắp xếp câu theo cấp độ CEFR A1→C2.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "AI Chat",
    desc: "Hội thoại trực tiếp với AI như người bản ngữ, nhận phản hồi ngữ pháp tức thì.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mic,
    title: "AI Speaking",
    desc: "Luyện phát âm, nhận đánh giá pronunciation, fluency, grammar.",
    color: "bg-orange-100 text-orange-600",
  },
];

const LANGUAGES = [
  { flag: "🇺🇸", name: "Tiếng Anh", href: "/marketing/english", desc: "A1 → C2 · 600+ từ vựng" },
  { flag: "🇨🇳", name: "Tiếng Trung", href: "/marketing/chinese", desc: "HSK 1→6 · Pinyin chuẩn" },
  { flag: "🇯🇵", name: "Tiếng Nhật", href: "/marketing/japanese", desc: "N5→N1 · Hiragana, Kanji" },
];

const PERKS = ["Miễn phí hoàn toàn để bắt đầu", "Không cần thẻ tín dụng", "Học mọi lúc, mọi nơi", "Theo dõi tiến trình chi tiết"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-base">🌐</span>
            </div>
            <span className="font-bold text-slate-900 text-sm sm:text-base">AI Language</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href="/auth/login" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium px-2.5 sm:px-4 py-2 whitespace-nowrap">
              Đăng nhập
            </Link>
            <Link href="/auth/register" className="text-xs sm:text-sm bg-brand text-white font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-brand text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-5 sm:mb-6">
          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
          Powered by GPT-4o + Whisper AI
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-5 leading-tight text-balance">
          Học ngoại ngữ như
          <br />
          <span className="text-brand">nói chuyện với người thật</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-8 sm:mb-10 max-w-2xl mx-auto text-balance px-2">
          Nền tảng học tiếng Anh, Trung, Nhật với AI. Thực hành hội thoại, luyện phát âm và theo dõi tiến trình — tất cả trong một nơi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-blue-200"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 font-medium px-6 py-3 sm:py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 mt-6 sm:mt-8 px-2">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {perk}
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8 sm:mb-10">3 ngôn ngữ, 1 nền tảng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {LANGUAGES.map((lang) => (
              <Link key={lang.name} href={lang.href}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center hover:border-brand hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">{lang.flag}</span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">{lang.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500">{lang.desc}</p>
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-brand text-xs sm:text-sm font-medium">
                    Khám phá <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2 sm:mb-3">Tất cả những gì bạn cần</h2>
        <p className="text-sm sm:text-base text-slate-500 text-center mb-8 sm:mb-10 px-2">Từ từ vựng cơ bản đến hội thoại nâng cao — đầy đủ trong một app</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-12 sm:py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Bắt đầu học ngay hôm nay</h2>
          <p className="text-sm sm:text-base text-blue-200 mb-6 sm:mb-8">Miễn phí mãi mãi cho gói cơ bản. Không cần thẻ tín dụng.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-brand font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base"
          >
            Đăng ký miễn phí
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 sm:py-8 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm text-slate-400">© 2025 AI Language Platform · Học tiếng Anh, Trung, Nhật cùng AI</p>
        </div>
      </footer>
    </div>
  );
}
