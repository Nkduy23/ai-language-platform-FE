// Blog detail page — SSR + dynamic metadata cho SEO
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { contentApi } from "@/lib/api/content";

interface Props {
  params: { slug: string };
}

async function fetchPost(slug: string) {
  try {
    return await contentApi.getBlogPost(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  return {
    title: `${post.title} — AI Language Platform`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : [] },
  };
}

export const revalidate = 3600;

export default async function BlogDetailPage({ params }: Props) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <p className="text-xs text-airmail font-mono font-medium mb-2">{post.language}</p>
        <h1 className="text-2xl sm:text-3xl mb-3">{post.title}</h1>
        <p className="text-xs sm:text-sm text-ink-muted/70 mb-6 sm:mb-8">
          {new Date(post.publishedAt).toLocaleDateString("vi-VN")} · {post.authorName}
        </p>
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="rounded-md border-[1.5px] border-paper-line mb-6 sm:mb-8 w-full" />
        )}
        <div className="prose prose-sm sm:prose-base max-w-none whitespace-pre-wrap text-ink-navy/90 leading-relaxed">{post.content}</div>
      </article>

      <Footer />
    </div>
  );
}
