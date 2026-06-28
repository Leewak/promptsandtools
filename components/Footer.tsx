"use client";

import Link from "next/link";
import { categories } from "@/lib/posts";

export function Footer() {
  return (
    <footer style={{ background: "#0C0F22", borderTop: "1px solid #1C2245" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <span className="font-bold text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}>
                Prompts<span style={{ color: "#3B82F6" }}>&</span>Tools
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#4A5580" }}>
              Practical guides to AI tools and productivity. No hype, no fluff — just what actually works.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#3B82F6" }}>Topics</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm transition-colors" style={{ color: "#4A5580" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5580")}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#3B82F6" }}>Site</h4>
            <ul className="space-y-2">
              {[
                { label: "All Articles", href: "/blog" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookie-policy" },
                { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Terms of Use", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors" style={{ color: "#4A5580" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5580")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #1C2245" }}>
          <p className="text-xs" style={{ color: "#2A3260" }}>
            &copy; {new Date().getFullYear()} Prompts & Tools. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#2A3260" }}>
            Some links may be affiliate links. We earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
