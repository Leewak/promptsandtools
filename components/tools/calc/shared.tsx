"use client";

import type { ReactNode } from "react";
import { Field, inputCls, inputStyle } from "../ui";

export const toNum = (s: string) => (s.trim() === "" ? NaN : Number(s));
export const money = (x: number, d = 2) => (Number.isFinite(x) ? x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "–");
export const plain = (x: number, d = 4) => (Number.isFinite(x) ? String(+x.toFixed(d)) : "–");

export function Num({ label, value, onChange, step = "any", min }: { label: string; value: string; onChange: (v: string) => void; step?: string; min?: number }) {
  return (
    <Field label={label}>
      <input type="number" inputMode="decimal" step={step} min={min} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} style={inputStyle} />
    </Field>
  );
}

export function Txt({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <Field label={label}>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} style={inputStyle} />
    </Field>
  );
}

export function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} style={inputStyle}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </Field>
  );
}

export const Grid = ({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) => (
  <div className={`grid gap-4 ${cols === 3 ? "sm:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : ""}`}>{children}</div>
);

/** Result list. The first row is shown large. */
export function Out({ rows }: { rows: [string, string][] }) {
  if (!rows.length) return <p className="text-sm" style={{ color: "#6E739C" }}>Enter the values above to see the result.</p>;
  return (
    <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: "#0C0D22", border: "1px solid #23264A" }} aria-live="polite">
      {rows.map(([k, v], i) => (
        <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-4">
          <span className="text-sm" style={{ color: "#9CA1C9" }}>{k}</span>
          <span data-result={k} className={i === 0 ? "text-2xl font-bold" : "text-base font-semibold"} style={{ color: i === 0 ? "#34D399" : "#E8EAF6", fontFamily: "var(--font-mono)" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

export const Formula = ({ children }: { children: ReactNode }) => (
  <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-mono)", color: "#7DD3FC" }}>{children}</p>
);
export const Disclaimer = ({ children }: { children: ReactNode }) => <p className="text-xs leading-relaxed" style={{ color: "#6E739C" }}>{children}</p>;

export const Stack = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;
