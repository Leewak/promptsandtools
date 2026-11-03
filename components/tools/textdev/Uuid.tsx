"use client";

import { useMemo, useState } from "react";
import { Button, Panel, Field, inputCls, inputStyle } from "../ui";

export default function Uuid() {
  const [n, setN] = useState(5);
  const [upper, setUpper] = useState(false);
  const [hyph, setHyph] = useState(true);
  const [seed, setSeed] = useState(0);
  const out = useMemo(() => {
    void seed;
    const k = Math.max(1, Math.min(n || 1, 1000));
    return Array.from({ length: k }, () => { let u: string = crypto.randomUUID(); if (!hyph) u = u.replace(/-/g, ""); return upper ? u.toUpperCase() : u; }).join("\n");
  }, [n, upper, hyph, seed]);
  const gen = () => setSeed(seed + 1);
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-end">
          <Field label="How many (1-1000)"><input type="number" min={1} max={1000} value={n} onChange={(e) => setN(Number(e.target.value))} className={inputCls} style={{ ...inputStyle, width: 120 }} /></Field>
          <label className="text-sm flex gap-2 items-center pb-2.5" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
          <label className="text-sm flex gap-2 items-center pb-2.5" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={hyph} onChange={(e) => setHyph(e.target.checked)} /> Hyphens</label>
          <Button onClick={gen}>Generate new</Button>
        </div>
        <textarea aria-label="UUIDs" readOnly rows={Math.min(14, Math.max(4, n))} value={out} className={`${inputCls} w-full font-mono`} style={inputStyle} />
        <div><Button secondary onClick={() => navigator.clipboard.writeText(out)}>Copy all</Button></div>
      </div>
    </Panel>
  );
}
