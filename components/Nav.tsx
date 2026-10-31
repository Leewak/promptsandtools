"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { label: "PDF", href: "/tools#pdf" },
  { label: "Image", href: "/tools#image" },
  { label: "Passport photos", href: "/tools/passport-photo" },
  { label: "Utilities", href: "/tools#utilities" },
  { label: "Guides", href: "/blog" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50" style={{ background: "rgba(10,11,26,0.86)", backdropFilter: "blur(10px)", borderBottom: "1px solid #1C1E3A" }}>
      <nav className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-8">
        <Logo />
        <div className="hidden md:flex items-center gap-6 flex-1">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-[15px] transition-colors hover:text-white" style={{ color: "#C9CCE8" }}>{l.label}</Link>
          ))}
        </div>
        <span className="hidden md:inline-flex items-center gap-2 text-xs px-3 py-[7px] rounded-lg ml-auto"
          style={{ fontFamily: "var(--font-mono)", color: "#34D399", border: "1px solid #1E4A3C", background: "rgba(52,211,153,0.06)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} /> NO UPLOADS
        </span>
        <button className="md:hidden ml-auto p-2" style={{ color: "#C9CCE8" }} onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="md:hidden px-6 pb-5 flex flex-col gap-3" style={{ borderTop: "1px solid #1C1E3A" }}>
          {LINKS.map((l) => <Link key={l.label} href={l.href} className="pt-3 text-[15px]" style={{ color: "#C9CCE8" }} onClick={() => setOpen(false)}>{l.label}</Link>)}
        </div>
      )}
    </header>
  );
}
