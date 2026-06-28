import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter — Weekly AI Tools Digest | Prompts & Tools",
  description: "One email per week. The AI tools worth knowing about, the prompts that actually work, and what's overhyped. No spam.",
};

export default function NewsletterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(34,211,238,0.1))", border: "1px solid rgba(59,130,246,0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{ border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.06)", color: "#22D3EE" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22D3EE" }} />
          Every Tuesday — free forever
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.03em" }}>
          The AI Tools Worth<br />
          <span className="text-gradient">Knowing About</span>
        </h1>

        <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7DB8" }}>
          One email per week. What&apos;s new, what actually works, what&apos;s overhyped, and the prompt of the week.
        </p>
        <p className="text-xs mb-10" style={{ color: "#3A4570" }}>
          Join readers who build smarter workflows. No spam. Unsubscribe anytime.
        </p>

        <form className="space-y-3">
          <input type="email" placeholder="your@email.com" required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF", fontFamily: "ui-monospace" }} />
          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
            Subscribe — It&apos;s Free
          </button>
        </form>

        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            ["Weekly", "New issue every Tuesday"],
            ["Tested", "Every tool we cover is tested"],
            ["No spam", "Unsubscribe in one click"],
          ].map(([title, desc]) => (
            <div key={title} className="text-center">
              <p className="font-semibold text-sm mb-1" style={{ color: "#CBD5E1" }}>{title}</p>
              <p className="text-xs" style={{ color: "#3A4570" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
