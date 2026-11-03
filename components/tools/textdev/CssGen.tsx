"use client";

import { useState } from "react";
import { Button, Panel, Segmented, Field, inputStyle } from "../ui";

const Range = ({ label, v, set, min, max }: { label: string; v: number; set: (n: number) => void; min: number; max: number }) => (
  <Field label={`${label}: ${v}`}><input type="range" min={min} max={max} value={v} onChange={(e) => set(Number(e.target.value))} aria-label={label} /></Field>
);
const hexA = (hex: string, a: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };
const CopyCss = ({ css }: { css: string }) => (
  <div className="flex flex-col gap-3">
    <pre id="css-out" className="rounded-lg p-3 text-sm font-mono whitespace-pre-wrap break-all" style={{ ...inputStyle, color: "#E8EAF6" }}>{css}</pre>
    <div><Button secondary onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</Button></div>
  </div>
);

export function Gradient() {
  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(135);
  const [c, setC] = useState(["#3B82F6", "#8B5CF6", "#EC4899"]);
  const [three, setThree] = useState(true);
  const cols = three ? c : c.slice(0, 2);
  const g = type === "linear" ? `linear-gradient(${angle}deg, ${cols.join(", ")})` : `radial-gradient(circle, ${cols.join(", ")})`;
  const css = `background: ${g};`;
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div className="h-48 rounded-xl" style={{ background: g }} />
        <Segmented options={["linear", "radial"]} value={type} onChange={setType} />
        {type === "linear" && <Range label="Angle (deg)" v={angle} set={setAngle} min={0} max={360} />}
        <div className="flex flex-wrap gap-4 items-end">
          {cols.map((x, i) => <Field key={i} label={`Colour ${i + 1}`}><input type="color" value={x} onChange={(e) => setC(c.map((y, k) => (k === i ? e.target.value : y)))} style={{ width: 64, height: 40 }} /></Field>)}
          <label className="text-sm flex gap-2 items-center pb-2.5" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={three} onChange={(e) => setThree(e.target.checked)} /> Third colour</label>
        </div>
        <CopyCss css={css} />
      </div>
    </Panel>
  );
}

export function Shadow() {
  const [x, setX] = useState(0), [y, setY] = useState(10), [b, setB] = useState(30), [s, setS] = useState(0), [a, setA] = useState(25);
  const [col, setCol] = useState("#000000"), [inset, setInset] = useState(false);
  const v = `${inset ? "inset " : ""}${x}px ${y}px ${b}px ${s}px ${hexA(col, a / 100)}`;
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div className="rounded-xl flex items-center justify-center h-56" style={{ background: "#EEF0F8" }}><div className="w-32 h-32 rounded-2xl bg-white" style={{ boxShadow: v }} /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Range label="Offset X (px)" v={x} set={setX} min={-100} max={100} /><Range label="Offset Y (px)" v={y} set={setY} min={-100} max={100} />
          <Range label="Blur (px)" v={b} set={setB} min={0} max={150} /><Range label="Spread (px)" v={s} set={setS} min={-50} max={100} />
          <Range label="Opacity (%)" v={a} set={setA} min={0} max={100} />
          <Field label="Colour"><input type="color" value={col} onChange={(e) => setCol(e.target.value)} style={{ width: 64, height: 40 }} /></Field>
        </div>
        <label className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} /> Inset</label>
        <CopyCss css={`box-shadow: ${v};`} />
      </div>
    </Panel>
  );
}
