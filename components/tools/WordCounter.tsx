"use client";

import { useMemo, useState } from "react";
import { Panel, inputCls, inputStyle } from "./ui";

export default function WordCounter() {
  const [text, setText] = useState("");
  const s = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return {
      Words: words,
      Characters: text.length,
      "Characters (no spaces)": text.replace(/\s/g, "").length,
      Sentences: (text.match(/[^.!?]+[.!?]+/g) ?? (text.trim() ? [text] : [])).length,
      Paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
      "Reading time": `${Math.max(words ? 1 : 0, Math.round(words / 238))} min`,
    };
  }, [text]);
  return (
    <Panel>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {Object.entries(s).map(([k, v]) => (
          <div key={k} className="rounded-xl px-4 py-3" style={{ background: "#0C0F22", border: "1px solid #1C2245" }}>
            <div className="text-2xl font-bold text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>{v}</div>
            <div className="text-xs" style={{ color: "#6B7DB8" }}>{k}</div>
          </div>
        ))}
      </div>
      <textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here…" className={`${inputCls} w-full`} style={inputStyle} />
    </Panel>
  );
}
