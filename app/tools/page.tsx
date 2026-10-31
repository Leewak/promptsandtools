import Link from "next/link";
import type { Metadata } from "next";
import { AdsterraInline } from "@/components/Adsterra";
import { ToolCard } from "@/components/tools/ToolGrid";
import { PASSPORT_COUNTRIES, cardTools, categoryAnchor, categoryColor, tools, type ToolCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools: PDF, Image, Passport Photo, QR | Prompts&Tools",
  description: "Every free tool in one place: compress PDF to 100/200/500 KB, resize images to 20/50/100 KB, passport photos for 8 countries, signature resizer, JPG to PDF, QR codes and more.",
  alternates: { canonical: "https://promptsandtools.online/tools" },
};

const ORDER: ToolCategory[] = ["PDF", "Image", "Photo ID", "Utilities"];

export default function ToolsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-20">
      <p className="text-xs mb-2" style={{ fontFamily: "var(--font-mono)", color: "#7DD3FC", letterSpacing: "0.12em" }}>ALL TOOLS</p>
      <h1 className="text-[clamp(34px,5vw,52px)] font-bold mb-3" style={{ letterSpacing: "-0.03em", color: "#E8EAF6" }}>Free online tools</h1>
      <p className="text-lg max-w-2xl mb-10" style={{ color: "#9CA1C9" }}>Everything runs in your browser: your files never leave your device. No sign-up, no watermark, no limits.</p>
      {ORDER.map((cat) => {
        const cards = cardTools.filter((t) => t.category === cat);
        const variants = tools.filter((t) => t.category === cat && !t.card);
        return (
          <section key={cat} id={categoryAnchor[cat]} className="mb-12 scroll-mt-24">
            <h2 className="text-xs mb-4 uppercase" style={{ fontFamily: "var(--font-mono)", color: categoryColor[cat], letterSpacing: "0.12em" }}>{cat}</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {cards.map((t) => <ToolCard key={t.slug} t={t} num={cardTools.indexOf(t) + 1} />)}
            </div>
            {(variants.length > 0 || cat === "Photo ID") && (
              <div className="flex flex-wrap gap-2 mt-4">
                {variants.map((v) => <Link key={v.slug} href={`/tools/${v.slug}`} className="text-sm px-3.5 py-2 rounded-full hover:text-white" style={{ color: "#C9CCE8", background: "#11132A", border: "1px solid #23264A" }}>{v.h1}</Link>)}
                {cat === "Photo ID" && PASSPORT_COUNTRIES.map((c) => <Link key={c.id} href={`/tools/passport-photo/${c.id}`} className="text-sm px-3.5 py-2 rounded-full hover:text-white" style={{ color: "#C9CCE8", background: "#11132A", border: "1px solid #23264A" }}>{c.name} {c.size}</Link>)}
              </div>
            )}
          </section>
        );
      })}
      <AdsterraInline />
    </div>
  );
}
