"use client";

import { useMemo, useState } from "react";
import { Note, Panel, Segmented, Field, inputCls, inputStyle } from "../ui";

type Op = { t: "=" | "+" | "-"; v: string };
function diff(a: string[], b: string[]): Op[] {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Op[] = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ t: "=", v: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ t: "-", v: a[i++] });
    else out.push({ t: "+", v: b[j++] });
  }
  while (i < n) out.push({ t: "-", v: a[i++] });
  while (j < m) out.push({ t: "+", v: b[j++] });
  return out;
}

export default function Diff() {
  const [a, setA] = useState("The quick brown fox\njumps over the dog\nEnd of file");
  const [b, setB] = useState("The quick red fox\njumps over the lazy dog\nEnd of file\nNew last line");
  const [mode, setMode] = useState("lines");
  const [ic, setIc] = useState(false);
  const res = useMemo(() => {
    const split = (s: string) => (mode === "lines" ? s.split(/\r?\n/) : s.split(/(\s+)/).filter((x) => x !== ""));
    const x = split(a), y = split(b);
    if (x.length * y.length > 9_000_000) return null;
    const norm = (t: string[]) => (ic ? t.map((s) => s.toLowerCase()) : t);
    const nx = norm(x), ny = norm(y);
    const ops = diff(nx, ny);
    // map back to original text
    let i = 0, j = 0;
    return ops.map((o) => { const v = o.t === "+" ? y[j++] : o.t === "-" ? x[i++] : (i++, y[j++]); return { t: o.t, v }; });
  }, [a, b, mode, ic]);
  const added = res?.filter((o) => o.t === "+").length ?? 0, removed = res?.filter((o) => o.t === "-").length ?? 0;
  const col = { "+": { bg: "rgba(52,211,153,0.16)", c: "#6EE7B7" }, "-": { bg: "rgba(248,113,113,0.16)", c: "#FCA5A5" }, "=": { bg: "transparent", c: "#C9CCE8" } };
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Segmented options={["lines", "words"]} value={mode} onChange={setMode} format={(v) => (v === "lines" ? "Compare by line" : "Compare by word")} />
          <label className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={ic} onChange={(e) => setIc(e.target.checked)} /> Ignore case</label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Original text"><textarea aria-label="Original text" rows={9} value={a} onChange={(e) => setA(e.target.value)} className={`${inputCls} font-mono`} style={inputStyle} /></Field>
          <Field label="Changed text"><textarea aria-label="Changed text" rows={9} value={b} onChange={(e) => setB(e.target.value)} className={`${inputCls} font-mono`} style={inputStyle} /></Field>
        </div>
        {!res ? <Note tone="error">These texts are too large to compare in the browser. Try a smaller section.</Note> : (
          <>
            <p data-testid="diff-summary" className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "#9CA1C9" }}>{added} added · {removed} removed {mode === "lines" ? "lines" : "words"}</p>
            <div className="rounded-lg p-3 text-sm overflow-auto max-h-[420px]" style={{ ...inputStyle, fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap" }}>
              {mode === "lines"
                ? res.map((o, k) => <div key={k} style={{ background: col[o.t].bg, color: col[o.t].c }}>{o.t === "=" ? "  " : o.t + " "}{o.v}</div>)
                : res.map((o, k) => <span key={k} style={{ background: col[o.t].bg, color: col[o.t].c, textDecoration: o.t === "-" ? "line-through" : undefined }}>{o.v}</span>)}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
