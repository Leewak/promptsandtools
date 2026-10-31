import Link from "next/link";

/** Logo direction 1a: gradient tile with "&" next to the Prompts&Tools wordmark. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span aria-hidden className="inline-flex items-center justify-center shrink-0 font-bold text-white"
      style={{ width: size, height: size, borderRadius: size * 0.25, background: "linear-gradient(135deg,#3B82F6,#22D3EE)", fontFamily: "var(--font-space-grotesk)", fontSize: size * 0.62, lineHeight: 1 }}>
      &amp;
    </span>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Prompts & Tools home">
      <LogoMark size={size} />
      <span className="font-bold" style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 20, letterSpacing: "-0.02em", color: "#E8EAF6" }}>
        Prompts<span style={{ color: "#3B82F6" }}>&amp;</span>Tools
      </span>
    </Link>
  );
}
