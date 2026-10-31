"use client";

import { useState } from "react";
import { Button, Field, Note, Panel } from "./ui";

const SETS = { lower: "abcdefghijkmnopqrstuvwxyz", upper: "ABCDEFGHJKLMNPQRSTUVWXYZ", digits: "23456789", symbols: "!@#$%^&*()-_=+[]{};:,.?" };

type Opts = Record<keyof typeof SETS, boolean>;

function make(len: number, opts: Opts) {
  const active = (Object.keys(SETS) as (keyof typeof SETS)[]).filter((k) => opts[k]);
  if (!active.length) return "";
  const all = active.map((k) => SETS[k]).join("");
  const chars = active.map((k) => SETS[k][pick(SETS[k].length)]); // at least one of each chosen type
  while (chars.length < len) chars.push(all[pick(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) { const j = pick(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
  return chars.join("");
}

function pick(n: number) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }

export default function PasswordGenerator() {
  const [len, setLenState] = useState(16);
  const [opts, setOptsState] = useState<Opts>({ lower: true, upper: true, digits: true, symbols: true });
  const [pw, setPw] = useState(() => make(16, { lower: true, upper: true, digits: true, symbols: true }));
  const [copied, setCopied] = useState(false);
  const regen = (l = len, o = opts) => { setPw(make(l, o)); setCopied(false); };
  const setLen = (l: number) => { setLenState(l); regen(l, opts); };
  const setOpts = (o: Opts) => { setOptsState(o); regen(len, o); };
  const gen = () => regen();

  const pool = (Object.keys(SETS) as (keyof typeof SETS)[]).filter((k) => opts[k]).reduce((n, k) => n + SETS[k].length, 0);
  const bits = pool ? Math.round(len * Math.log2(pool)) : 0;
  const label = bits >= 100 ? "Very strong" : bits >= 70 ? "Strong" : bits >= 50 ? "Fair" : "Weak";

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <div className="rounded-xl px-4 py-4 font-mono text-lg break-all text-[#E8EAF6]" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }}>{pw || "Pick at least one character type"}</div>
        <Note tone={bits >= 70 ? "ok" : "info"}>{label} · about {bits} bits of entropy</Note>
        <Field label={`Length: ${len}`}><input type="range" min={8} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} /></Field>
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#C9CCE8" }}>
          {(Object.keys(SETS) as (keyof typeof SETS)[]).map((k) => (
            <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} />{k === "lower" ? "a–z" : k === "upper" ? "A–Z" : k === "digits" ? "0–9" : "Symbols"}</label>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={gen}>Generate new</Button>
          <Button secondary disabled={!pw} onClick={async () => { await navigator.clipboard.writeText(pw); setCopied(true); }}>{copied ? "Copied" : "Copy"}</Button>
        </div>
        <Note>Generated on your device with the browser&apos;s secure random generator. Nothing is stored or sent.</Note>
      </div>
    </Panel>
  );
}
