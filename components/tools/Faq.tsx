"use client";

import { useState } from "react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => (
        <div key={f.q} className="rounded-xl" style={{ background: "#0D0E22", border: "1px solid #1F2244" }}>
          <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
            <span className="text-[17px] font-semibold" style={{ color: "#E8EAF6" }}>{f.q}</span>
            <span className="text-xl" style={{ color: "#60A5FA" }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="px-5 pb-5 text-base leading-relaxed" style={{ color: "#9CA1C9" }}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
