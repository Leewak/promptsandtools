import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { categories, getPostsByCategory } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.label} — Prompts & Tools`,
    description: `All articles about ${cat.label}. Honest guides, reviews, and comparisons.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const catPosts = getPostsByCategory(slug);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/blog" className="text-xs flex items-center gap-1.5 mb-6" style={{ color: "#4A5580" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            All Articles
          </Link>
          <span className="tag-pill mb-4 inline-flex" style={{ borderColor: `${cat.color}40`, background: `${cat.color}15`, color: cat.color }}>
            {cat.label}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.02em" }}>
            {cat.label}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#4A5580" }}>{catPosts.length} articles</p>
        </div>

        {catPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {catPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" style={{ color: "#4A5580" }}>
            No articles in this category yet. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
