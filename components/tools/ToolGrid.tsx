"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cardTools, categoryColor, type ToolCategory } from "@/lib/tools";
import { ToolIcon } from "./ToolIcon";

const CATS: ("All" | ToolCategory)[] = ["All", "PDF", "Image", "Photo ID", "Utilities"];

export function ToolCard({ t, num }: { t: (typeof cardTools)[number]; num: number }) {
  const color = categoryColor[t.category];
  return (
    <Link href={`/tools/${t.slug}`} className="group flex flex-col gap-3.5 rounded-[14px] p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#3B82F6]" style={{ background: "#10122A", border: "1px solid #1F2244" }}>
      <div className="flex items-start justify-between">
        <ToolIcon kind={t.kind} color={color} />
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase px-[7px] py-[3px] rounded" style={{ fontFamily: "var(--font-mono)", color, border: `1px solid ${color}` }}>{t.category}</span>
          <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#5B6090" }}>{String(num).padStart(2, "0")}</span>
        </div>
      </div>
      <h3 className="text-[19px] font-semibold" style={{ color: "#E8EAF6" }}>{t.name}</h3>
      <p className="text-[15px] leading-normal flex-1" style={{ color: "#9CA1C9" }}>{t.short}</p>
      <div className="flex flex-wrap gap-1.5">
        {t.formats.map((f) => <span key={f} className="text-xs px-2 py-1 rounded" style={{ fontFamily: "var(--font-mono)", color: "#C9CCE8", background: "#181B3A" }}>{f}</span>)}
      </div>
    </Link>
  );
}

export function ToolSearch({ between, after }: { between?: ReactNode; after?: ReactNode }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list = cardTools.map((t, i) => ({ t, n: i + 1 })).filter(({ t }) =>
    (cat === "All" || t.category === cat) && words.every((w) => `${t.name} ${t.keywords} ${t.formats.join(" ")}`.toLowerCase().includes(w)));

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" }); }}
        className="w-[calc(100%-48px)] max-w-[640px] flex items-center gap-3 rounded-[14px] pl-[18px] pr-1.5 py-1.5" style={{ background: "#11132A", border: "1px solid #2A2E55", boxShadow: "0 10px 40px rgba(59,130,246,0.12)" }}>
        <span style={{ fontFamily: "var(--font-mono)", color: "#6E739C" }}>/</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tools" placeholder="What do you need? e.g. pdf 200 kb, passport photo"
          className="flex-1 min-w-0 bg-transparent outline-none text-[17px]" style={{ color: "#E8EAF6" }} />
        <button className="px-5 py-3 rounded-[10px] text-[15px] font-semibold text-white shrink-0" style={{ background: "#3B82F6" }}>Find tool</button>
      </form>
      {between}
      <section id="tools" className="w-full max-w-[1200px] mx-auto px-6 pt-8 pb-16 text-left scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs mb-2" style={{ fontFamily: "var(--font-mono)", color: "#7DD3FC", letterSpacing: "0.12em" }}>ALL TOOLS</p>
            <h2 className="text-4xl font-bold" style={{ letterSpacing: "-0.02em", color: "#E8EAF6" }}>Pick a tool</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} className="text-xs uppercase px-3.5 py-2 rounded-md"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", border: `1px solid ${cat === c ? "#3B82F6" : "#23264A"}`, background: cat === c ? "rgba(59,130,246,0.14)" : "transparent", color: cat === c ? "#fff" : "#9CA1C9" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {list.length ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {list.map(({ t, n }) => <ToolCard key={t.slug} t={t} num={n} />)}
          </div>
        ) : (
          <p className="rounded-[14px] p-10 text-center" style={{ border: "1px dashed #2A2E55", color: "#9CA1C9" }}>No tool matches &ldquo;{q}&rdquo;. Try &ldquo;pdf&rdquo;, &ldquo;photo&rdquo; or &ldquo;kb&rdquo;.</p>
        )}
      </section>
      {after}
    </>
  );
}
