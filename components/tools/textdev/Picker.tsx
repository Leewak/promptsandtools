"use client";

import { useState } from "react";
import { Button, Panel, Segmented, Field, inputCls, inputStyle } from "../ui";

const rnd = (n: number) => Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * n);
const shuffle = <T,>(a: T[]) => { const l = [...a]; for (let i = l.length - 1; i > 0; i--) { const j = rnd(i + 1); [l[i], l[j]] = [l[j], l[i]]; } return l; };

export default function Picker() {
  const [names, setNames] = useState("Anna\nBen\nChloe\nDavid\nEmma\nFinn");
  const [mode, setMode] = useState("pick");
  const [n, setN] = useState(1);
  const [res, setRes] = useState<string[][] | null>(null);
  const list = names.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  function go() {
    const s = shuffle(list);
    if (mode === "pick") setRes([s.slice(0, Math.max(1, Math.min(n, s.length)))]);
    else { const t = Math.max(1, Math.min(n, s.length)); const teams: string[][] = Array.from({ length: t }, () => []); s.forEach((x, i) => teams[i % t].push(x)); setRes(teams); }
  }
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <Segmented options={["pick", "teams"]} value={mode} onChange={(m) => { setMode(m); setN(m === "pick" ? 1 : 2); setRes(null); }} format={(v) => (v === "pick" ? "Pick winners" : "Make teams")} />
        <Field label="Names (one per line)"><textarea aria-label="Names" rows={8} value={names} onChange={(e) => setNames(e.target.value)} className={`${inputCls} w-full`} style={inputStyle} /></Field>
        <div className="flex flex-wrap gap-4 items-end">
          <Field label={mode === "pick" ? "Number of winners" : "Number of teams"}><input type="number" min={1} value={n} onChange={(e) => setN(Number(e.target.value))} className={inputCls} style={{ ...inputStyle, width: 120 }} /></Field>
          <Button onClick={go} disabled={!list.length}>{mode === "pick" ? "Pick now" : "Make teams"}</Button>
          <span className="text-xs pb-3" style={{ fontFamily: "var(--font-mono)", color: "#6E739C" }}>{list.length} names</span>
        </div>
        {res && (
          <div id="picker-result" className="grid gap-3 sm:grid-cols-2">
            {res.map((t, i) => (
              <div key={i} className="rounded-lg p-4" style={{ background: "#0C0D22", border: "1px solid #23264A" }}>
                <p className="text-xs mb-2" style={{ fontFamily: "var(--font-mono)", color: "#7DD3FC" }}>{mode === "pick" ? (res.length === 1 && t.length === 1 ? "WINNER" : "WINNERS") : `TEAM ${i + 1}`}</p>
                {t.map((x, k) => <p key={k} className="text-lg" style={{ color: "#E8EAF6" }}>{x}</p>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
