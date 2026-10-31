import Link from "next/link";
import type { Metadata } from "next";
import { AdsterraInline } from "@/components/Adsterra";
import { tools, toolCategories, type ToolCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Online Tools: PDF, Image, Passport Photo, QR & More | Prompts & Tools",
  description: "Free tools that run in your browser: compress PDF to 200KB, resize images to KB, passport photos, signature resizer, JPG to PDF, QR codes and more. No sign-up.",
  alternates: { canonical: "https://promptsandtools.online/tools" },
};

export default function ToolsPage() {
  const order: ToolCategory[] = ["forms", "pdf", "image", "text", "developer", "security"];
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-20">
      <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.1] mb-4 text-gradient" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.03em" }}>Free online tools</h1>
      <p className="text-lg max-w-2xl mb-10" style={{ color: "#6B7DB8" }}>Everything runs in your browser: your files never leave your device. No sign-up, no watermark, no limits.</p>
      {order.map((cat) => {
        const list = tools.filter((t) => t.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: "#60A5FA" }}>{toolCategories[cat]}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((t) => (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="rounded-2xl p-5 transition-colors hover:border-blue-500" style={{ background: "#10142A", border: "1px solid #1C2245" }}>
                  <h3 className="font-semibold text-pt-white mb-1.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>{t.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{t.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      <AdsterraInline className="mt-6" />
    </div>
  );
}
