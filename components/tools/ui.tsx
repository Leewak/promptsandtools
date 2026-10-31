"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const card = { background: "#10122A", border: "1px solid #23264A" } as const;

export function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl p-5 sm:p-6" style={card}>{children}</div>;
}

export function Drop({ accept, multiple, onFiles, label, button = "Choose file" }: { accept: string; multiple?: boolean; onFiles: (f: File[]) => void; label: string; button?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  useEffect(() => {
    // paste a file or screenshot straight into the tool
    const onPaste = (e: ClipboardEvent) => { const f = [...(e.clipboardData?.files ?? [])]; if (f.length) onFiles(multiple ? f : f.slice(0, 1)); };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onFiles, multiple]);
  return (
    <div
      onClick={() => input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...e.dataTransfer.files]); }}
      className="cursor-pointer rounded-xl px-6 py-12 sm:py-14 text-center flex flex-col items-center gap-3 transition-colors"
      style={{ border: `1.5px dashed ${over ? "#3B82F6" : "#34396B"}`, background: over ? "#0E1230" : "#0C0D22" }}
    >
      <p className="text-[21px] font-semibold" style={{ color: "#E8EAF6" }}>{label}</p>
      <p className="text-sm" style={{ color: "#6E739C" }}>or</p>
      <span className="px-5 py-3 rounded-[10px] text-[15px] font-semibold text-white" style={{ background: "#3B82F6" }}>{button}</span>
      <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#34D399" }}>Stays on this device</p>
      <input ref={input} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => { onFiles([...(e.target.files ?? [])]); e.target.value = ""; }} />
    </div>
  );
}

export function Segmented<T extends string | number>({ options, value, onChange, format }: { options: T[]; value: T; onChange: (v: T) => void; format?: (v: T) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o === value;
        return (
          <button key={String(o)} type="button" onClick={() => onChange(o)} className="px-3.5 py-[9px] rounded-lg text-sm"
            style={{ fontFamily: "var(--font-mono)", border: `1px solid ${on ? "#3B82F6" : "#23264A"}`, background: on ? "rgba(59,130,246,0.14)" : "transparent", color: on ? "#fff" : "#9CA1C9" }}>
            {format ? format(o) : String(o)}
          </button>
        );
      })}
    </div>
  );
}

export function Button({ children, onClick, disabled, secondary }: { children: ReactNode; onClick?: () => void; disabled?: boolean; secondary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] font-semibold text-[15px] transition-opacity disabled:opacity-40"
      style={secondary ? { border: "1px solid #2A2E55", color: "#C9CCE8" } : { background: "#3B82F6", color: "#fff" }}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "rounded-lg px-3 py-2.5 text-sm text-[#E8EAF6] outline-none focus:ring-2 focus:ring-blue-500";
export const inputStyle = { background: "#0C0D22", border: "1px solid #2A2E55" } as const;

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "ok" }) {
  const c = tone === "error" ? "#F87171" : tone === "ok" ? "#34D399" : "#9CA1C9";
  return <p className="text-sm" style={{ color: c }}>{children}</p>;
}
