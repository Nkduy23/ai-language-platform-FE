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
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog học ngoại ngữ</h1>
        <p className="text-slate-500 mb-10">Mẹo học tiếng Anh, Trung, Nhật hiệu quả cùng AI</p>

        {posts.length === 0 ? (
          <p className="text-slate-400">Chưa có bài viết nào. Quay lại sau nhé!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/marketing/blog/${post.slug}`} className="block rounded-xl border border-surface-border p-5 hover:shadow-card transition-shadow">
                <span className="text-xs text-brand font-medium">{post.language}</span>
                <h2 className="font-semibold text-slate-900 mt-1 mb-2">{post.title}</h2>
                <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-slate-400 mt-3">
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
