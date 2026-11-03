"use client";

import { useState } from "react";
import { Panel, Field, inputCls, inputStyle } from "../ui";

const LIMITS = [
  { id: "x", label: "X (Twitter) post", max: 280 }, { id: "ig", label: "Instagram caption", max: 2200 }, { id: "igbio", label: "Instagram bio", max: 150 },
  { id: "li", label: "LinkedIn post", max: 3000 }, { id: "yt", label: "YouTube title", max: 100 }, { id: "tt", label: "TikTok caption", max: 2200 },
  { id: "mt", label: "Meta title (SEO)", max: 60 }, { id: "md", label: "Meta description (SEO)", max: 155 }, { id: "sms", label: "SMS (one segment)", max: 160 },
];

export default function CharCount() {
  const [t, setT] = useState("Write or paste your text here to see how it measures up against common limits.");
  const [lim, setLim] = useState("x");
  const L = LIMITS.find((l) => l.id === lim)!;
  const chars = Array.from(t).length, words = (t.match(/\S+/g) ?? []).length, noSp = Array.from(t.replace(/\s/g, "")).length, lines = t ? t.split("\n").length : 0;
  const over = chars > L.max, pct = Math.min(100, (chars / L.max) * 100);
  const stat = (k: string, v: number, id: string) => <div className="rounded-lg px-4 py-3" style={{ background: "#0C0D22", border: "1px solid #23264A" }}><div id={id} className="text-2xl font-bold" style={{ color: "#E8EAF6" }}>{v}</div><div className="text-xs" style={{ color: "#6E739C" }}>{k}</div></div>;
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <textarea aria-label="Text" rows={8} value={t} onChange={(e) => setT(e.target.value)} className={`${inputCls} w-full`} style={inputStyle} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{stat("Characters", chars, "cc-chars")}{stat("Without spaces", noSp, "cc-nospace")}{stat("Words", words, "cc-words")}{stat("Lines", lines, "cc-lines")}</div>
        <Field label="Check against a limit">
          <select value={lim} onChange={(e) => setLim(e.target.value)} className={inputCls} style={inputStyle}>{LIMITS.map((l) => <option key={l.id} value={l.id}>{l.label} ({l.max})</option>)}</select>
        </Field>
        <div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#181B3A" }}><div style={{ width: `${pct}%`, height: "100%", background: over ? "#F87171" : pct > 90 ? "#FBBF24" : "#34D399" }} /></div>
          <p id="cc-status" className="text-sm mt-2" style={{ color: over ? "#F87171" : "#9CA1C9" }}>{over ? `${chars - L.max} over the ${L.max}-character limit` : `${L.max - chars} characters left of ${L.max}`}</p>
        </div>
        <p className="text-xs" style={{ color: "#6E739C" }}>Limits are commonly published figures and platforms change them. X counts every link as 23 characters and some emoji and CJK characters as 2; search engines cut titles and descriptions by pixel width, so treat 60 and 155 as a guide.</p>
      </div>
    </Panel>
  );
}
