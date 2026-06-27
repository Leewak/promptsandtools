import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts, formatDate, getCategoryColor, getCategoryLabel } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date },
  };
}

const PLACEHOLDER_CONTENT = `
<p>This post is coming soon. The full article will be published shortly with in-depth analysis, tested recommendations, and actionable takeaways.</p>
<h2>What we'll cover</h2>
<p>In this article, we'll go deep on the topic with real examples, comparison data, and our honest assessment after testing. Bookmark this page or subscribe to our newsletter to be notified when it goes live.</p>
<h2>Why this matters</h2>
<p>AI tools are moving fast. Our job is to cut through the noise and tell you what's actually worth your time and money — and what's overhyped marketing.</p>
`;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const catColor = getCategoryColor(post.category);
  const catLabel = getCategoryLabel(post.category);
  const related = posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#2A3260" }}>
          <Link href="/" className="hover:text-pt-blue-light transition-colors" style={{ color: "#4A5580" }}>Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-pt-blue-light transition-colors" style={{ color: "#4A5580" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "#6B7DB8" }}>{catLabel}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="tag-pill" style={{ borderColor: `${catColor}40`, background: `${catColor}15`, color: catColor }}>
            {catLabel}
          </span>
          <span className="text-xs" style={{ color: "#4A5580" }}>{post.readTime} min read</span>
          <span className="text-xs" style={{ color: "#2A3260" }}>·</span>
          <span className="text-xs" style={{ color: "#4A5580" }}>{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-[1.2] mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.025em" }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg mb-8 pb-8" style={{ color: "#6B7DB8", borderBottom: "1px solid #1C2245" }}>
          {post.excerpt}
        </p>

        {/* Content */}
        <div
          className="prose-dark"
          dangerouslySetInnerHTML={{ __html: PLACEHOLDER_CONTENT }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: "1px solid #1C2245" }}>
          {post.tags.map((tag) => (
            <span key={tag} className="tag-pill" style={{ borderColor: "#1C2245", background: "#0C0F22", color: "#4A5580" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-bold text-lg mb-6" style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF" }}>
              Related Articles
            </h2>
            <div className="space-y-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group"
                  style={{ border: "1px solid #1C2245", background: "#0C0F22" }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1 group-hover:text-pt-blue-light transition-colors"
                      style={{ fontFamily: "var(--font-space-grotesk)", color: "#E2E8FF" }}>
                      {r.title}
                    </div>
                    <div className="text-xs" style={{ color: "#4A5580" }}>{r.readTime} min read</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1 text-pt-border group-hover:text-pt-blue transition-colors">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
