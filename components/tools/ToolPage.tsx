import Link from "next/link";
import type { Metadata } from "next";
import { AdsterraBanner, AdsterraInline } from "@/components/Adsterra";
import { ToolRunner } from "./ToolRunner";
import { Faq } from "./Faq";
import { categoryAnchor, getTool, type ToolDef } from "@/lib/tools";

const SITE = "https://promptsandtools.online";

export function toolMetadata(t: ToolDef): Metadata {
  const url = `${SITE}/tools/${t.slug}`;
  return {
    title: t.title, description: t.description,
    openGraph: { title: t.title, description: t.description, url, siteName: "Prompts&Tools", type: "website" },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
    alternates: { canonical: url },
  };
}

export function ToolPage({ t }: { t: ToolDef }) {
  const url = `${SITE}/tools/${t.slug}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: t.h1, url, description: t.description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any (runs in the browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Tools", item: `${SITE}/tools` },
      { "@type": "ListItem", position: 2, name: t.category, item: `${SITE}/tools#${categoryAnchor[t.category]}` },
      { "@type": "ListItem", position: 3, name: t.crumb, item: url },
    ] },
  ];
  const related = t.related.map(getTool).filter((r): r is ToolDef => !!r);

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-[72px] flex flex-col gap-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="flex flex-col gap-3">
        <nav className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#6E739C" }}>
          <Link href="/tools" className="hover:text-white">Tools</Link> / <Link href={`/tools#${categoryAnchor[t.category]}`} className="hover:text-white">{t.category}</Link> / <span style={{ color: "#9CA1C9" }}>{t.crumb}</span>
        </nav>
        <h1 className="font-bold text-[clamp(34px,5vw,52px)] leading-[1.05]" style={{ letterSpacing: "-0.03em", color: "#E8EAF6" }}>{t.h1}</h1>
        <p className="text-lg max-w-3xl" style={{ color: "#9CA1C9" }}>{t.intro}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <ToolRunner kind={t.kind} props={t.props} />
          <AdsterraInline />
        </div>
        <aside className="flex flex-col gap-6">
          <AdsterraBanner size="300x250" />
          <div>
            <p className="text-xs mb-2" style={{ fontFamily: "var(--font-mono)", color: "#7DD3FC", letterSpacing: "0.12em" }}>RELATED</p>
            {related.map((r) => (
              <Link key={r.slug} href={`/tools/${r.slug}`} className="flex items-center justify-between py-2.5 text-[15px] hover:text-white" style={{ color: "#C9CCE8", borderTop: "1px solid #1A1D3B" }}>
                {r.crumb === r.name ? r.name : r.h1} <span style={{ color: "#5B6090" }}>→</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <section className="max-w-[780px]">
        <h2 className="text-[28px] font-bold mb-5" style={{ letterSpacing: "-0.02em", color: "#E8EAF6" }}>{t.howToTitle}</h2>
        <ol className="flex flex-col gap-4">
          {t.steps.map((s, i) => (
            <li key={s} className="grid grid-cols-[40px_1fr] text-base leading-relaxed" style={{ color: "#C9CCE8" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "#60A5FA" }}>{String(i + 1).padStart(2, "0")}</span>{s}
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-[780px]">
        <h2 className="text-[28px] font-bold mb-5" style={{ letterSpacing: "-0.02em", color: "#E8EAF6" }}>FAQ</h2>
        <Faq items={t.faq} />
      </section>
    </div>
  );
}
