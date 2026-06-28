"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { categories } from "@/lib/posts";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,11,24,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(28,34,69,0.8)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="Prompts & Tools" style={{ height: 36, width: 36, objectFit: "contain", borderRadius: 8 }} />
          <span className="font-bold text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1rem", letterSpacing: "-0.02em" }}>
            Prompts<span style={{ color: "#3B82F6" }}>&</span>Tools
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm text-pt-gray hover:text-pt-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/blog"
            className="text-sm text-pt-gray hover:text-pt-white transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            All Articles
          </Link>
          <Link
            href="/newsletter"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.35)",
              color: "#60A5FA",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Newsletter
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 text-pt-gray" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-5 pb-5 pt-2 flex flex-col gap-3 border-t" style={{ background: "rgba(8,11,24,0.97)", borderColor: "#1C2245" }}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="text-pt-gray text-sm py-1" onClick={() => setOpen(false)}>
              {cat.label}
            </Link>
          ))}
          <Link href="/blog" className="text-pt-gray text-sm py-1" onClick={() => setOpen(false)}>All Articles</Link>
          <Link href="/newsletter" className="text-pt-blue text-sm py-1 font-semibold" onClick={() => setOpen(false)}>Newsletter</Link>
        </div>
      )}
    </header>
  );
}
