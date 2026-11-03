"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Panel, Field, Note, inputCls, inputStyle } from "../ui";

export default function Regex() {
  const [pat, setPat] = useState("(\\w+)@(\\w+\\.com)");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact: anna@example.com, ben@test.com or call 555-1234.");
  const res = useMemo(() => {
    if (!pat) return { err: "", ms: [] as RegExpMatchArray[] };
    try {
      const re = new RegExp(pat, flags.includes("g") ? flags : flags + "g");
      const ms: RegExpMatchArray[] = [];
      for (const m of text.matchAll(re)) { ms.push(m); if (ms.length >= 1000) break; }
      return { err: "", ms };
    } catch (e) { return { err: (e as Error).message, ms: [] }; }
  }, [pat, flags, text]);
  const toggle = (c: string) => setFlags(flags.includes(c) ? flags.replace(c, "") : flags + c);
  const parts: ReactNode[] = []; let last = 0;
  res.ms.forEach((m, i) => {
    const s = m.index ?? 0; if (!m[0]) return;
    parts.push(text.slice(last, s), <mark key={i} style={{ background: "rgba(59,130,246,0.45)", color: "#fff", borderRadius: 3 }}>{m[0]}</mark>);
    last = s + m[0].length;
  });
  parts.push(text.slice(last));
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <Field label="Regular expression">
          <div className="flex items-center gap-2"><span style={{ color: "#6E739C" }}>/</span><input aria-label="Pattern" value={pat} onChange={(e) => setPat(e.target.value)} spellCheck={false} className={`${inputCls} flex-1 font-mono`} style={inputStyle} /><span style={{ color: "#6E739C" }}>/{flags}</span></div>
        </Field>
        <div className="flex flex-wrap gap-4">
          {[["g", "global"], ["i", "ignore case"], ["m", "multiline"], ["s", "dotAll"], ["u", "unicode"]].map(([c, l]) => (
            <label key={c} className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={flags.includes(c)} onChange={() => toggle(c)} /> {c} <span style={{ color: "#6E739C" }}>{l}</span></label>
          ))}
        </div>
        <Field label="Test string"><textarea aria-label="Test string" rows={6} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} className={`${inputCls} w-full font-mono`} style={inputStyle} /></Field>
        {res.err ? <Note tone="error">{res.err}</Note> : (
          <>
            <p id="rx-count" className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "#34D399" }}>{res.ms.length} match{res.ms.length === 1 ? "" : "es"}</p>
            <div className="rounded-lg p-3 text-sm whitespace-pre-wrap break-words font-mono" style={{ ...inputStyle, color: "#C9CCE8" }}>{parts}</div>
            {res.ms.slice(0, 50).map((m, i) => (
              <div key={i} className="text-sm font-mono rounded-lg px-3 py-2" style={{ background: "#0C0D22", border: "1px solid #23264A", color: "#C9CCE8" }}>
                <span style={{ color: "#7DD3FC" }}>#{i + 1}</span> &ldquo;{m[0]}&rdquo; at {m.index}
                {m.slice(1).map((g, k) => <div key={k} style={{ color: "#9CA1C9" }}>group {k + 1}: {g === undefined ? "(no match)" : `“${g}”`}</div>)}
              </div>
            ))}
          </>
        )}
        <p className="text-xs" style={{ color: "#6E739C" }}>Uses your browser&rsquo;s JavaScript regex engine. Other languages (PCRE, Python, Java) differ in some syntax.</p>
      </div>
    </Panel>
  );
}
