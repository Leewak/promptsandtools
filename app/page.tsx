import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { posts, getFeaturedPosts, categories } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompts & Tools — The Practical Guide to AI Tools for Real Work",
  description: "Honest reviews, comparisons, and how-to guides for AI tools that actually help you work smarter. No hype, just results.",
};

export default function HomePage() {
  const featured = getFeaturedPosts();
  const latest = posts.filter((p) => !p.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)" }} />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: "#60A5FA" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-pt-cyan" style={{ background: "#22D3EE" }} />
            Updated weekly — AI tools that actually work
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.03em" }}>
            The Practical Guide to{" "}
            <span className="text-gradient">AI Tools</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: "#6B7DB8" }}>
            No hype. No fluff. Honest reviews, tested prompts, and step-by-step guides for AI tools that help you work smarter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "#3B82F6", color: "#fff", fontFamily: "var(--font-space-grotesk)", boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}>
              Browse All Articles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/category/comparisons"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:text-white hover:border-white/20"
              style={{ border: "1px solid #1C2245", color: "#6B7DB8", fontFamily: "var(--font-space-grotesk)" }}>
              Tool Comparisons
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[["50+", "Tools Reviewed"], ["100K+", "Monthly Readers"], ["0", "Sponsored Posts"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "var(--font-space-grotesk)", color: "#3B82F6" }}>{num}</div>
                <div className="text-xs" style={{ color: "#4A5580" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}
                className="tag-pill transition-all duration-200 hover:scale-[1.03]"
                style={{ borderColor: `${cat.color}40`, background: `${cat.color}10`, color: cat.color }}>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-xl" style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF" }}>Featured Articles</h2>
            <Link href="/blog" className="text-sm flex items-center gap-1 hover:text-white transition-colors" style={{ color: "#4A5580" }}>
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="py-12 pb-20" style={{ borderTop: "1px solid #0F1325" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-bold text-xl mb-8" style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF" }}>Latest</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16" style={{ background: "#0C0F22", borderTop: "1px solid #1C2245" }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="tag-pill mb-6 inline-flex">Weekly digest</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.02em" }}>
            The AI tools worth knowing about
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#4A5580" }}>
            One email per week. What&apos;s new, what works, what&apos;s overhyped. No spam.
          </p>
          <form className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF", fontFamily: "ui-monospace" }} />
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "#3B82F6", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
