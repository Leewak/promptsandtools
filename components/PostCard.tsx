import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate, getCategoryColor, getCategoryLabel } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const catColor = getCategoryColor(post.category);
  const catLabel = getCategoryLabel(post.category);

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="block group">
        <article
          className="relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.01]"
          style={{ border: "1px solid #1C2245", background: post.coverColor || "#10142A" }}
        >
          {/* Cover gradient */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${post.coverColor || "#10142A"} 0%, #080B18 100%)` }}
          />
          {/* Dot grid overlay */}
          <div className="absolute inset-0 dot-grid opacity-30" />
          {/* Glow orb */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${catColor}20 0%, transparent 70%)`, filter: "blur(40px)" }} />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="tag-pill" style={{ borderColor: `${catColor}40`, background: `${catColor}15`, color: catColor }}>
                {catLabel}
              </span>
              <span className="text-xs" style={{ color: "#4A5580" }}>{post.readTime} min read</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4 group-hover:text-pt-blue-light transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.02em" }}>
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7DB8" }}>{post.excerpt}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#3B82F6" }}>
              <span>{formatDate(post.date)}</span>
              <span style={{ color: "#1C2245" }}>·</span>
              <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
                Read article
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        className="rounded-xl p-6 h-full transition-all duration-200 group-hover:border-pt-blue/30"
        style={{ border: "1px solid #1C2245", background: "#0C0F22" }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <span className="tag-pill" style={{ borderColor: `${catColor}40`, background: `${catColor}15`, color: catColor }}>
            {catLabel}
          </span>
          <span className="text-xs" style={{ color: "#4A5580" }}>{post.readTime} min read</span>
        </div>
        <h3 className="font-bold leading-snug mb-3 group-hover:text-pt-blue-light transition-colors duration-200"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "#E2E8FF", fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#4A5580" }}>{post.excerpt}</p>
        <span className="text-xs" style={{ color: "#2A3260" }}>{formatDate(post.date)}</span>
      </article>
    </Link>
  );
}
