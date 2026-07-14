// Blog list page — SSR cho SEO, target long-tail keywords theo PLAN.md
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { contentApi } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "Blog học ngoại ngữ — AI Language Platform",
  description: "Mẹo học tiếng Anh, Trung, Nhật hiệu quả, cập nhật phương pháp học cùng AI.",
};

export const revalidate = 3600; // ISR — cập nhật blog mỗi giờ

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof contentApi.listBlogPosts>>["data"] = [];
  try {
    const res = await contentApi.listBlogPosts();
    posts = res.data;
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-2xl sm:text-3xl mb-2">Blog học ngoại ngữ</h1>
        <p className="text-sm sm:text-base text-ink-muted mb-8 sm:mb-10">Mẹo học tiếng Anh, Trung, Nhật hiệu quả cùng AI</p>

        {posts.length === 0 ? (
          <p className="text-ink-muted/70 text-sm sm:text-base">Chưa có bài viết nào. Quay lại sau nhé!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/marketing/blog/${post.slug}`}
                className="block postcard-corner rounded-md border-[1.5px] border-paper-line p-4 sm:p-5 bg-postcard shadow-stamp-sm hover:shadow-stamp hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-xs text-airmail font-mono font-medium">{post.language}</span>
                <h2 className="font-semibold text-ink-navy mt-1 mb-2 text-sm sm:text-base">{post.title}</h2>
                <p className="text-xs sm:text-sm text-ink-muted line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-ink-muted/70 mt-3">
                  {new Date(post.publishedAt).toLocaleDateString("vi-VN")} · {post.authorName}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
