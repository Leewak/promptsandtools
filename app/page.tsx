import Link from "next/link";
import type { Metadata } from "next";
import { AdsterraInline } from "@/components/Adsterra";
import { ToolSearch } from "@/components/tools/ToolGrid";
import { PASSPORT_COUNTRIES, cardTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Prompts&Tools: Free File Tools for Any Form (Compress PDF, Resize Photo, Passport Photo)",
  description: "Compress a PDF to 200 KB, resize a photo to 20 KB, or make a passport photo in the official size. Your files are processed on your device and never uploaded.",
  alternates: { canonical: "https://promptsandtools.online" },
};

const POPULAR = [
  ["Compress PDF to 200 KB", "/tools/compress-pdf-to-200kb"],
  ["Resize photo to 20 KB", "/tools/resize-image-to-20kb"],
  ["Resize photo to 50 KB", "/tools/resize-image-to-50kb"],
  ["US passport photo", "/tools/passport-photo/us"],
  ["Signature for online form", "/tools/signature-resizer"],
  ["JPG to PDF", "/tools/image-to-pdf"],
];
const GUIDES = [["AI TOOLS", "ai-tools", "#60A5FA"], ["PROMPTS", "prompts", "#22D3EE"], ["AUTOMATION", "automation", "#A78BFA"], ["COMPARISONS", "comparisons", "#34D399"], ["TUTORIALS", "tutorials", "#FBBF24"]];
const PRIVACY = [
  ["Processed in the browser", "Compression, resizing and cropping run in this tab. Nothing is sent to a server."],
  ["Safe for ID documents", "Passports, signatures and certificates never leave your computer or phone."],
  ["Free, no account", "No sign-up, no watermark and no daily limit. Open a tool and use it."],
];
const mono = { fontFamily: "var(--font-mono)" } as const;
const eyebrow = (color: string) => ({ ...mono, color, letterSpacing: "0.12em" });

export default function HomePage() {
  const between = (
    <>
      <div className="flex flex-wrap justify-center gap-2 max-w-[820px] px-6">
        {POPULAR.map(([label, href]) => (
          <Link key={href} href={href} className="text-sm px-3.5 py-2 rounded-full transition-colors hover:border-[#3B82F6] hover:text-white" style={{ color: "#C9CCE8", background: "#11132A", border: "1px solid #23264A" }}>{label}</Link>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-10 mt-2">
        {[[String(cardTools.length), "free tools"], ["0", "files uploaded"], ["No", "account needed"]].map(([v, l]) => (
          <div key={l} className="text-center"><div className="text-[28px] font-bold" style={{ color: "#60A5FA" }}>{v}</div><div className="text-sm" style={{ color: "#8B90B8" }}>{l}</div></div>
        ))}
      </div>
      <AdsterraInline className="w-full px-6 mt-4" />
    </>
  );

  const after = (
    <div className="w-full text-left">
      <section id="photo-id" className="scroll-mt-24" style={{ background: "#0D0E22", borderTop: "1px solid #1C1E3A", borderBottom: "1px solid #1C1E3A" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-16 grid gap-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div className="flex flex-col gap-4 items-start">
            <p className="text-xs" style={eyebrow("#A78BFA")}>PASSPORT &amp; VISA PHOTOS</p>
            <h2 className="text-4xl font-bold" style={{ letterSpacing: "-0.02em", color: "#E8EAF6" }}>Official sizes, ready to print or upload</h2>
            <p className="text-[17px] leading-relaxed" style={{ color: "#9CA1C9" }}>Choose a country, line your face up with the guide, and download a single photo or a printable 4×6 in sheet.</p>
            <Link href="/tools/passport-photo" className="px-5 py-3 rounded-[10px] text-[15px] font-semibold text-white" style={{ background: "#3B82F6" }}>Make a passport photo →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PASSPORT_COUNTRIES.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/tools/passport-photo/${c.id}`} className="flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-colors hover:border-[#A78BFA]" style={{ background: "#11132A", border: "1px solid #1F2244" }}>
                <span style={{ height: Math.round((64 * c.h) / 70), aspectRatio: `${c.w} / ${c.h}`, border: "1.5px solid #A78BFA", background: "rgba(167,139,250,0.08)", borderRadius: 3 }} />
                <span className="text-[15px] font-semibold" style={{ color: "#E8EAF6" }}>{c.name}</span>
                <span className="text-xs" style={{ ...mono, color: "#9CA1C9" }}>{c.size}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8" style={{ letterSpacing: "-0.02em", color: "#E8EAF6" }}>Your files stay on your device</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {PRIVACY.map(([h, p], i) => (
            <div key={h} className="rounded-[14px] p-6" style={{ border: "1px solid #1F2244" }}>
              <p className="text-xs mb-3" style={{ ...mono, color: "#60A5FA" }}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#E8EAF6" }}>{h}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: "#9CA1C9" }}>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="guides" className="max-w-[1200px] mx-auto px-6 pb-20 scroll-mt-24">
        <div className="rounded-[14px] p-8 flex flex-wrap items-center justify-between gap-6" style={{ background: "#0D0E22", border: "1px solid #1F2244" }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#E8EAF6" }}>Guides &amp; AI tool reviews</h2>
            <p className="text-[15px] mt-1" style={{ color: "#9CA1C9" }}>Prompts, comparisons and step-by-step tutorials.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {GUIDES.map(([label, slug, color]) => (
              <Link key={slug} href={`/category/${slug}`} className="text-xs px-3 py-1.5 rounded" style={{ ...mono, letterSpacing: "0.08em", color, border: `1px solid ${color}55` }}>{label}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div style={{ background: "radial-gradient(900px 420px at 50% -80px, rgba(59,130,246,0.16), transparent 70%)" }}>
      <section className="flex flex-col items-center text-center gap-6 pt-[72px]">
        <span className="text-xs px-4 py-2 mx-6 rounded-full" style={{ ...mono, letterSpacing: "0.08em", color: "#7DD3FC", border: "1px solid #1E3A5F" }}>FREE · RUNS IN YOUR BROWSER · NO SIGN-UP</span>
        <h1 className="font-bold text-[clamp(40px,6vw,72px)] leading-[1.02] max-w-[900px] px-6" style={{ letterSpacing: "-0.035em", textWrap: "balance", color: "#E8EAF6" }}>
          Get your files the right size for <span style={{ background: "linear-gradient(90deg,#3B82F6,#22D3EE)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>any form.</span>
        </h1>
        <p className="text-[19px] leading-[1.55] max-w-[640px] px-6" style={{ color: "#9CA1C9" }}>
          Compress a PDF to 200 KB, resize a photo to 20 KB, or make a passport photo in the official size. Your files are processed on your device and never uploaded.
        </p>
        <ToolSearch between={between} after={after} />
      </section>
    </div>
  );
}
