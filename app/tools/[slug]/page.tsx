import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { AdsterraInline, AdsterraNative } from "@/components/Adsterra";
import { ToolRunner } from "@/components/tools/ToolRunner";
import { getTool, tools, toolCategories } from "@/lib/tools";

const SITE_URL = "https://promptsandtools.online";
const SITE_NAME = "Prompts & Tools";

export async function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return {
    title: `${t.title} | ${SITE_NAME}`,
    description: t.description,
    openGraph: { title: t.title, description: t.description, url: `${SITE_URL}/tools/${t.slug}`, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title: t.title, description: t.description },
    alternates: { canonical: `${SITE_URL}/tools/${t.slug}` },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) notFound();
  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: t.name, url: `${SITE_URL}/tools/${t.slug}`, description: t.description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any (runs in the browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free tools", item: `${SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: t.name, item: `${SITE_URL}/tools/${t.slug}` },
    ] },
  ];
  const related = t.related.map(getTool).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-28 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="text-xs mb-5" style={{ color: "#4A5580" }}>
        <Link href="/" className="hover:text-pt-white">Home</Link> / <Link href="/tools" className="hover:text-pt-white">Free tools</Link> / <span style={{ color: "#6B7DB8" }}>{toolCategories[t.category]}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold leading-[1.15] mb-4 text-gradient" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>{t.h1}</h1>
      <p className="text-lg leading-relaxed mb-8" style={{ color: "#94A3B8" }}>{t.intro}</p>

      <ToolRunner slug={t.slug} />

      <AdsterraInline className="my-10" />

      <section className="mt-4">
        <h2 className="text-2xl font-bold mb-4 text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>How to use it</h2>
        <ol className="flex flex-col gap-2 list-decimal pl-5" style={{ color: "#CBD5E1" }}>
          {t.steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>Frequently asked questions</h2>
        <div className="flex flex-col gap-3">
          {t.faq.map((f) => (
            <details key={f.q} className="rounded-xl px-5 py-4" style={{ background: "#10142A", border: "1px solid #1C2245" }}>
              <summary className="cursor-pointer font-semibold text-pt-white">{f.q}</summary>
              <p className="text-sm leading-relaxed mt-3" style={{ color: "#A0AEC0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>Related free tools</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link key={r!.slug} href={`/tools/${r!.slug}`} className="rounded-xl px-4 py-4 text-sm font-semibold text-pt-white hover:border-blue-500 transition-colors" style={{ background: "#10142A", border: "1px solid #1C2245" }}>
                {r!.name} →
              </Link>
            ))}
          </div>
        </section>
      )}

      <AdsterraNative className="mt-12" />
    </div>
  );
}
