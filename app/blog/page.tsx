import { PostCard } from "@/components/PostCard";
import { posts, categories } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Articles — AI Tools, Prompts & Automation Guides",
  description: "Browse all articles on AI tools, prompt engineering, automation, and productivity. Honest, tested content with no fluff.",
};

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="tag-pill mb-4 inline-flex">All Articles</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.02em" }}>
            Everything we&apos;ve written
          </h1>
          <p style={{ color: "#4A5580" }}>
            {posts.length} articles and counting — tested, honest, practical.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          <Link href="/blog" className="tag-pill" style={{ borderColor: "rgba(59,130,246,0.5)", background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>
            All
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="tag-pill transition-all hover:scale-[1.03]"
              style={{ borderColor: `${cat.color}30`, background: `${cat.color}08`, color: cat.color }}>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
