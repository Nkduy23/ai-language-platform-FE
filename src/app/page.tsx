import Link from "next/link";
import { ArrowRight, BookOpen, Brain, MessageCircle, Mic, CheckCircle, Zap, Star, ClipboardList, Flame, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { contentApi } from "@/lib/api/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";
import ScrollReveal from "@/components/shared/motifs/ScrollReveal";
import StatCounter from "@/components/shared/motifs/StatCounter";
import FlightPath from "@/components/shared/motifs/FlightPath";
import HeroParallaxBg from "@/components/shared/motifs/HeroParallaxBg";
import FaqAccordion from "@/components/shared/FaqAccordion";
import StickyMobileCta from "@/components/shared/StickyMobileCta";
import ProductShowcase from "@/components/shared/ProductShowcase";

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

const STATS: { value: number; suffix: string; label: string; decimal?: boolean }[] = [
  { value: 12000, suffix: "+", label: "Học viên đang học" },
  { value: 850, suffix: "+", label: "Bài học & chủ đề" },
  { value: 1200000, suffix: "+", label: "Lượt hội thoại với AI" },
  { value: 4.8, suffix: "/5", label: "Đánh giá từ người học", decimal: true },
];

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "1. Kiểm tra trình độ",
    desc: "Làm bài placement test 5 phút để AI xác định đúng cấp độ CEFR của bạn — không đoán mò, không học lại từ đầu.",
  },
  {
    icon: Flame,
    title: "2. Học mỗi ngày",
    desc: "Flashcard, Quiz, AI Chat và Speaking — xen kẽ theo lộ trình cá nhân hoá, chỉ 10-15 phút mỗi ngày.",
  },
  {
    icon: Trophy,
    title: "3. Theo dõi & lên cấp",
    desc: "Giữ streak, tích XP, nhận huy hiệu và leo bảng xếp hạng khi trình độ của bạn được đóng dấu lên hộ chiếu.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Mình học tiếng Nhật được 3 tháng, giờ đã tự tin đặt món ở nhà hàng Nhật mà không cần tra Google Translate nữa.",
    name: "Thảo My",
    detail: "Học viên tiếng Nhật · N4",
    accent: "ja" as const,
  },
  {
    quote: "AI Chat sửa lỗi ngữ pháp ngay lập tức giúp mình nhớ lâu hơn hẳn so với học từ vựng đơn thuần.",
    name: "Đức Anh",
    detail: "Học viên tiếng Anh · B2",
    accent: "en" as const,
  },
  {
    quote: "Phần luyện phát âm rất hữu ích, mình phát hiện ra mấy lỗi thanh điệu mà trước giờ không để ý.",
    name: "Gia Hân",
    detail: "Học viên tiếng Trung · HSK3",
    accent: "zh" as const,
  },
];

const FAQS = [
  {
    question: "Nền tảng có thực sự miễn phí không?",
    answer: "Có. Gói Free cho phép học flashcard, quiz và ngữ pháp không giới hạn. AI Chat và AI Speaking có giới hạn lượt dùng mỗi ngày; nâng cấp Premium/Pro nếu bạn cần dùng nhiều hơn.",
  },
  {
    question: "AI chấm điểm phát âm có chính xác không?",
    answer: "Hệ thống dùng công nghệ nhận diện giọng nói kết hợp GPT-4o để đánh giá phát âm, ngữ pháp, độ trôi chảy và từ vựng — tương đương một giáo viên bản ngữ đang lắng nghe bạn nói.",
  },
  {
    question: "Tôi có thể học trên điện thoại không?",
    answer: "Có, giao diện responsive đầy đủ trên di động. Bạn có thể học mọi lúc mọi nơi, kể cả luyện nói qua micro trên điện thoại.",
  },
  {
    question: "Tôi có thể huỷ gói Premium/Pro bất cứ lúc nào không?",
    answer: "Có. Không ràng buộc hợp đồng dài hạn, bạn có thể huỷ ngay trong trang Hồ sơ và vẫn dùng được tới hết chu kỳ đã thanh toán.",
  },
  {
    question: "Placement test hoạt động thế nào?",
    answer: "Bạn trả lời một loạt câu hỏi độ khó tăng dần; AI phân tích kết quả để xếp bạn vào đúng cấp độ CEFR (A1–C2) và gợi ý lộ trình học phù hợp ngay từ ngày đầu.",
  },
];

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
        {/* Texture chấm mờ thay cho world-map line-art (asset thật sẽ thay sau), trôi chậm hơn nội dung khi cuộn */}
        <HeroParallaxBg />

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

      {/* Stats — social proof, số liệu đếm lên khi cuộn tới */}
      <section className="bg-ink-navy-dark py-10 sm:py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.08}>
              <p className="text-2xl sm:text-3xl font-display font-bold text-gold-foil font-mono">
                {s.decimal ? (
                  <>
                    {s.value}
                    {s.suffix}
                  </>
                ) : (
                  <StatCounter value={s.value} suffix={s.suffix} />
                )}
              </p>
              <p className="text-xs sm:text-sm text-postcard/60 mt-1">{s.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Product showcase — xem giao diện thật trước khi đăng ký */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl text-center mb-2 sm:mb-3">Giao diện thật, không chỉ là lời hứa</h2>
          <p className="text-sm sm:text-base text-ink-muted text-center mb-8 sm:mb-10 px-2">Xem qua Flashcard, AI Chat và Quiz trước khi bắt đầu</p>
        </ScrollReveal>
        <ScrollReveal>
          <ProductShowcase />
        </ScrollReveal>
      </section>

      {/* Languages */}
      <section className="bg-postcard-dark py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-xl sm:text-2xl text-center mb-8 sm:mb-10">3 ngôn ngữ, 1 nền tảng</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {LANGUAGES.map((lang, i) => (
              <ScrollReveal key={lang.name} delay={i * 0.08}>
                <Link href={lang.href}>
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl text-center mb-2 sm:mb-3">Tất cả những gì bạn cần</h2>
          <p className="text-sm sm:text-base text-ink-muted text-center mb-8 sm:mb-10 px-2">Từ từ vựng cơ bản đến hội thoại nâng cao — đầy đủ trong một app</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.06}>
              <div className="flex gap-4 p-5 sm:p-6 bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp-sm">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-navy mb-1 text-sm sm:text-base">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works — hành trình 3 bước, nối bằng flight-path chạy theo scroll */}
      <section className="bg-postcard-dark py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-xl sm:text-2xl text-center mb-2 sm:mb-3">Hành trình học của bạn</h2>
            <p className="text-sm sm:text-base text-ink-muted text-center mb-10 sm:mb-14 px-2">3 bước đơn giản, như đóng từng dấu mộc lên hộ chiếu ngôn ngữ</p>
          </ScrollReveal>

          <FlightPath className="space-y-10 sm:space-y-14">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.1}>
                <div className={`flex items-center gap-5 sm:gap-8 ${i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-airmail/10 border-[1.5px] border-airmail/30 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-airmail" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-ink-navy text-base sm:text-lg mb-1">{step.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </FlightPath>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl text-center mb-2 sm:mb-3">Học viên nói gì</h2>
          <p className="text-sm sm:text-base text-ink-muted text-center mb-8 sm:mb-10 px-2">Những dấu mộc đầu tiên trên hành trình của họ</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.08}>
              <div className={`postcard-corner bg-postcard rounded-md border-[1.5px] ${LANG_BORDER[t.accent]} p-5 sm:p-6 shadow-stamp-sm h-full flex flex-col`}>
                <div className="flex gap-0.5 mb-3 text-gold-foil">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-ink-navy leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="mt-4 pt-3 border-t border-paper-line">
                  <p className="text-sm font-semibold text-ink-navy">{t.name}</p>
                  <p className={`text-xs font-medium ${LANG_TEXT[t.accent]}`}>{t.detail}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-postcard-dark py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-8 sm:mb-10 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl">Blog học ngoại ngữ</h2>
                  <p className="text-sm sm:text-base text-ink-muted mt-1">Mẹo học tiếng Anh, Trung, Nhật hiệu quả cùng AI</p>
                </div>
                <Link href="/marketing/blog" className="hidden sm:inline-flex items-center gap-1.5 text-airmail text-sm font-medium whitespace-nowrap hover:underline">
                  Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.06}>
                  <Link
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
                </ScrollReveal>
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

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl text-center mb-2 sm:mb-3">Câu hỏi thường gặp</h2>
          <p className="text-sm sm:text-base text-ink-muted text-center mb-8 sm:mb-10 px-2">Còn thắc mắc gì khác? Liên hệ với chúng mình bất cứ lúc nào.</p>
        </ScrollReveal>
        <ScrollReveal>
          <FaqAccordion items={FAQS} />
        </ScrollReveal>
      </section>

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
      <StickyMobileCta />
    </div>
  );
}
