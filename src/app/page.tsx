import Link from "next/link";
import { ArrowRight, BookOpen, Brain, MessageCircle, Mic, CheckCircle, Zap } from "lucide-react";
import type { Metadata } from "next";
import { contentApi } from "@/lib/api/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";

export const metadata: Metadata = {
  title: "AI Language Platform — Học Tiếng Anh, Trung, Nhật Cùng AI",
  description: "Nền tảng học ngoại ngữ AI-first. Luyện từ vựng, ngữ pháp, hội thoại với AI như giáo viên bản ngữ thật. Miễn phí.",
  openGraph: {
    title: "AI Language Platform — Học Ngoại Ngữ Cùng AI",
    description: "Học tiếng Anh, Trung, Nhật với AI. Flashcard, Quiz, AI Chat miễn phí.",
    url: "https://ailanguage.com",
  },
};

export const revalidate = 3600; // ISR — cập nhật blog mỗi giờ

const FEATURES = [
  {
    icon: BookOpen,
    title: "Flashcard thông minh",
    desc: "Học từ vựng với hệ thống SRS, phát âm chuẩn bằng Web Speech API.",
    color: "bg-stamp-teal/15 text-stamp-teal",
  },
  {
    icon: Brain,
    title: "Quiz đa dạng",
    desc: "Trắc nghiệm, điền từ, sắp xếp câu theo cấp độ CEFR A1→C2.",
    color: "bg-ink-navy/10 text-ink-navy",
  },
  {
    icon: MessageCircle,
    title: "AI Chat",
    desc: "Hội thoại trực tiếp với AI như người bản ngữ, nhận phản hồi ngữ pháp tức thì.",
    color: "bg-airmail/15 text-airmail",
  },
  {
    icon: Mic,
    title: "AI Speaking",
    desc: "Luyện phát âm, nhận đánh giá pronunciation, fluency, grammar.",
    color: "bg-gold-foil/20 text-[#8A6425]",
  },
];

const LANGUAGES = [
  { flag: "🇺🇸", name: "Tiếng Anh", href: "/marketing/english", desc: "A1 → C2 · 600+ từ vựng", accent: "en" as const },
  { flag: "🇨🇳", name: "Tiếng Trung", href: "/marketing/chinese", desc: "HSK 1→6 · Pinyin chuẩn", accent: "zh" as const },
  { flag: "🇯🇵", name: "Tiếng Nhật", href: "/marketing/japanese", desc: "N5→N1 · Hiragana, Kanji", accent: "ja" as const },
];

const LANG_BORDER = { en: "border-lang-en", zh: "border-lang-zh", ja: "border-lang-ja" };
const LANG_TEXT = { en: "text-lang-en", zh: "text-lang-zh", ja: "text-[#8A6425]" };

const PERKS = ["Miễn phí hoàn toàn để bắt đầu", "Không cần thẻ tín dụng", "Học mọi lúc, mọi nơi", "Theo dõi tiến trình chi tiết"];

const BLOG_PREVIEW_COUNT = 6;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof contentApi.listBlogPosts>>["data"] = [];
  try {
    const res = await contentApi.listBlogPosts();
    posts = res.data.slice(0, BLOG_PREVIEW_COUNT);
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      {/* Hero — nền ink-navy như trang bìa hộ chiếu */}
      <section className="relative bg-ink-navy overflow-hidden">
        {/* Texture chấm mờ thay cho world-map line-art (asset thật sẽ thay sau) */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "radial-gradient(#F5EFE0 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24 pb-14 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-postcard text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8">
            <Zap className="w-3.5 h-3.5 flex-shrink-0 text-gold-foil" />
            Powered by GPT-4o + Whisper AI
          </div>

          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-postcard mb-4 sm:mb-5 leading-tight text-balance">
              Học ngoại ngữ như
              <br />
              <span className="text-airmail italic">nói chuyện với người thật</span>
            </h1>
            <PostmarkStamp label="FLUENI • EST. 2026 •" color="gold-foil" size={88} rotate={-10} className="hidden md:flex absolute -right-24 -top-6">
              AI
            </PostmarkStamp>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-postcard/70 mb-8 sm:mb-10 max-w-2xl mx-auto text-balance px-2">
            Nền tảng học tiếng Anh, Trung, Nhật với AI. Thực hành hội thoại, luyện phát âm và theo dõi tiến trình — tất cả trong một nơi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-airmail text-postcard font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-md hover:bg-airmail-dark transition-all shadow-stamp hover:shadow-stamp-sm active:translate-x-px active:translate-y-px active:shadow-none"
            >
              Bắt đầu miễn phí
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-postcard font-medium px-6 py-3 sm:py-3.5 rounded-md border-[1.5px] border-postcard/30 hover:bg-white/10 hover:border-postcard/50 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 mt-6 sm:mt-8 px-2">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-1.5 text-xs sm:text-sm text-postcard/60">
                <CheckCircle className="w-4 h-4 text-stamp-teal flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          {/* Dải "hộ chiếu mini" — 3 ngôn ngữ như 3 trang passport xếp chồng lệch nhau */}
          <div className="flex justify-center -space-x-6 mt-10 sm:mt-14">
            {LANGUAGES.map((lang, i) => (
              <div
                key={lang.name}
                className={`w-24 sm:w-28 bg-postcard rounded-md border-[1.5px] ${LANG_BORDER[lang.accent]} shadow-stamp-sm px-3 py-4 text-center`}
                style={{ transform: `rotate(${(i - 1) * 6}deg)`, zIndex: i === 1 ? 10 : 1 }}
              >
                <span className="text-2xl block mb-1">{lang.flag}</span>
                <p className={`text-[10px] font-mono font-semibold ${LANG_TEXT[lang.accent]}`}>{lang.name.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="bg-postcard-dark py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl text-center mb-8 sm:mb-10">3 ngôn ngữ, 1 nền tảng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {LANGUAGES.map((lang) => (
              <Link key={lang.name} href={lang.href}>
                <div
                  className={`relative postcard-corner bg-postcard rounded-md border-[1.5px] ${LANG_BORDER[lang.accent]} p-6 sm:p-8 text-center shadow-stamp-sm hover:shadow-stamp hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
                >
                  <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">{lang.flag}</span>
                  <h3 className="font-display font-bold text-ink-navy text-base sm:text-lg mb-1">{lang.name}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted">{lang.desc}</p>
                  <div className={`mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium ${LANG_TEXT[lang.accent]}`}>
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
        <h2 className="text-xl sm:text-2xl text-center mb-2 sm:mb-3">Tất cả những gì bạn cần</h2>
        <p className="text-sm sm:text-base text-ink-muted text-center mb-8 sm:mb-10 px-2">Từ từ vựng cơ bản đến hội thoại nâng cao — đầy đủ trong một app</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 sm:p-6 bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp-sm">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-navy mb-1 text-sm sm:text-base">{f.title}</h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-postcard-dark py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl">Blog học ngoại ngữ</h2>
                <p className="text-sm sm:text-base text-ink-muted mt-1">Mẹo học tiếng Anh, Trung, Nhật hiệu quả cùng AI</p>
              </div>
              <Link href="/marketing/blog" className="hidden sm:inline-flex items-center gap-1.5 text-airmail text-sm font-medium whitespace-nowrap hover:underline">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/marketing/blog/${post.slug}`}
                  className="block postcard-corner relative bg-postcard rounded-md border-[1.5px] border-paper-line p-5 sm:p-6 shadow-stamp-sm hover:shadow-stamp hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-xs text-airmail font-mono font-medium">{post.language}</span>
                  <h3 className="font-semibold text-ink-navy mt-1 mb-2 text-sm sm:text-base line-clamp-2">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-ink-muted/70 mt-3">
                    {new Date(post.publishedAt).toLocaleDateString("vi-VN")} · {post.authorName}
                  </p>
                </Link>
              ))}
            </div>

            <div className="flex justify-center sm:hidden mt-8">
              <Link href="/marketing/blog" className="inline-flex items-center gap-1.5 text-airmail text-sm font-medium hover:underline">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative bg-ink-navy py-12 sm:py-16 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 airmail-border" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-postcard mb-3 sm:mb-4">Bắt đầu học ngay hôm nay</h2>
          <p className="text-sm sm:text-base text-postcard/70 mb-6 sm:mb-8">Miễn phí mãi mãi cho gói cơ bản. Không cần thẻ tín dụng.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-airmail text-postcard font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-md hover:bg-airmail-dark transition-all shadow-stamp text-sm sm:text-base"
          >
            Đăng ký miễn phí
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 airmail-border" />
      </section>

      <Footer />
    </div>
  );
}
