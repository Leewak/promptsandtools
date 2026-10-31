"use client";

import Link from "next/link";
import { categories } from "@/lib/posts";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer style={{ background: "#0A0B1A", borderTop: "1px solid #1C1E3A" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4"><Logo size={26} /></div>
            <p className="text-sm leading-relaxed" style={{ color: "#8B90B8" }}>
              Free file tools that run in your browser, plus practical guides to AI tools. Your files never leave your device.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7DD3FC" }}>Guides</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm transition-colors" style={{ color: "#8B90B8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8B90B8")}
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
                { label: "All free tools", href: "/tools" },
                { label: "All guides", href: "/blog" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookie-policy" },
                { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Terms of Use", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors" style={{ color: "#8B90B8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8B90B8")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #1C2245" }}>
          <p className="text-xs" style={{ color: "#5B6090" }}>
            &copy; {new Date().getFullYear()} Prompts & Tools. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#5B6090" }}>
            Some links may be affiliate links. We earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
