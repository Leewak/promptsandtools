import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";

const SITE_URL = "https://promptsandtools.online";
const SITE_NAME = "Prompts & Tools";
const AUTHOR = "Prompts & Tools Editorial";

export async function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author ?? AUTHOR }],
    openGraph: { title: post.title, description: post.excerpt, url: `${SITE_URL}/blog/${post.slug}`, siteName: SITE_NAME, type: "article", publishedTime: post.date },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const catColor = getCategoryColor(post.category);

  const blogSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.excerpt,
    author: { "@type": "Person", name: post.author ?? AUTHOR },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` } },
    datePublished: post.date, dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags.join(", "), articleSection: getCategoryLabel(post.category), wordCount: post.wordCount ?? 1500,
  };

  const faqSchema = post.faq?.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <div className="pt-10 pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#4A5568" }}>
            <Link href="/" className="hover:text-pt-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-pt-blue transition-colors">Articles</Link>
            <span>/</span>
            <span>{getCategoryLabel(post.category)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="tag-pill text-xs" style={{ borderColor: `${catColor}40`, background: `${catColor}10`, color: catColor }}>{getCategoryLabel(post.category)}</span>
            <span className="text-xs" style={{ color: "#4A5568" }}>{post.readTime} min read · {formatDate(post.date)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-[1.2] mb-6 text-gradient" style={{ letterSpacing: "-0.025em" }}>{post.title}</h1>
          <div className="flex items-center gap-3 mb-8 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff" }}>P</div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#E2E8F0" }}>{post.author ?? AUTHOR}</p>
              <p className="text-xs" style={{ color: "#4A5568" }}>Updated {formatDate(post.date)}</p>
            </div>
          </div>
          {post.quickAnswer && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(59,130,246,0.07)", border: "2px solid rgba(59,130,246,0.25)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3B82F6" }}>Quick Answer</p>
              <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>{post.quickAnswer}</p>
            </div>
          )}
          <div className="mb-8 p-3 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#4A5568" }}>
            <strong style={{ color: "#718096" }}>Affiliate disclosure:</strong> Some links may earn us a small commission at no extra cost to you.
          </div>
          {post.affiliates && post.affiliates[0] && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#3B82F6" }}>{post.affiliates[0].badge ?? "Recommended"}</p>
              <p className="font-bold mb-3" style={{ color: "#E2E8F0" }}>{post.affiliates[0].name}</p>
              <a href={post.affiliates[0].url} target="_blank" rel="noopener sponsored" className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff" }}>{post.affiliates[0].cta}</a>
            </div>
          )}
          <div className="prose-dark">
            <p className="text-lg leading-relaxed" style={{ color: "#94A3B8" }}>{post.excerpt}</p>
            <h2>What We Tested &amp; How</h2>
            <p>Every tool in this guide was tested on real work tasks over multiple weeks — not synthetic benchmarks. We focus on what actually moves the needle for content creators, marketers, and business owners.</p>
            <h2>Who This Is For</h2>
            <p>Creators and professionals who want honest, practical AI tool reviews without the affiliate-stuffed top-10 lists. We include tools we actually use and decline partnerships with tools we don&apos;t recommend.</p>
          </div>
          {post.affiliates && post.affiliates.length > 1 && (
            <div className="my-10 p-5 rounded-xl" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#22D3EE" }}>{post.affiliates[1].badge ?? "Also Great"}</p>
              <p className="font-bold mb-3" style={{ color: "#E2E8F0" }}>{post.affiliates[1].name}</p>
              <a href={post.affiliates[1].url} target="_blank" rel="noopener sponsored" className="inline-block text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: "#22D3EE", color: "#080B18" }}>{post.affiliates[1].cta}</a>
            </div>
          )}
          {post.faq && post.faq.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6" style={{ color: "#E2E8F0" }}>Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faq.map((item, i) => (
                  <div key={i} className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: "#CBD5E1" }}>{item.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#718096" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {post.affiliates && post.affiliates.length > 0 && (
            <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#4A5568" }}>Tools We Recommend</h3>
              <div className="space-y-3">
                {post.affiliates.map((aff, i) => (
                  <a key={i} href={aff.url} target="_blank" rel="noopener sponsored" className="flex items-center justify-between p-4 rounded-xl group transition-all" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      {aff.badge && <span className="text-xs mb-0.5 block" style={{ color: "#3B82F6" }}>{aff.badge}</span>}
                      <span className="font-semibold text-sm group-hover:text-white transition-colors" style={{ color: "#CBD5E1" }}>{aff.name}</span>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-lg font-medium shrink-0 ml-4" style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff" }}>{aff.cta.replace(" →", "")}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {post.tags.map((tag) => <span key={tag} className="tag-pill text-xs">{tag}</span>)}
          </div>
          <div className="mt-10">
            <Link href="/blog" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#3B82F6" }}>← Back to Articles</Link>
          </div>
        </div>
      </div>
    </>
  );
}
