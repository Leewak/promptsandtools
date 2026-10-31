"use client";

import { useRef, useState, type ReactNode } from "react";

export const card = { background: "#10142A", border: "1px solid #1C2245" } as const;

export function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl p-5 sm:p-7" style={card}>{children}</div>;
}

export function Drop({ accept, multiple, onFiles, label }: { accept: string; multiple?: boolean; onFiles: (f: File[]) => void; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onClick={() => input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...e.dataTransfer.files]); }}
      className="cursor-pointer rounded-xl px-6 py-10 text-center transition-colors"
      style={{ border: `2px dashed ${over ? "#3B82F6" : "#2A3366"}`, background: over ? "rgba(59,130,246,0.08)" : "rgba(8,11,24,0.5)" }}
    >
      <p className="font-semibold text-pt-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>{label}</p>
      <p className="text-sm mt-1" style={{ color: "#6B7DB8" }}>or drag and drop here. Files stay on your device.</p>
      <input ref={input} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => { onFiles([...(e.target.files ?? [])]); e.target.value = ""; }} />
    </div>
  );
}

export function Button({ children, onClick, disabled, secondary }: { children: ReactNode; onClick?: () => void; disabled?: boolean; secondary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-40"
      style={secondary ? { border: "1px solid #2A3366", color: "#C7D2FE" } : { background: "#3B82F6", color: "#fff" }}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#A5B4FC" }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "rounded-lg px-3 py-2.5 text-sm text-pt-white outline-none focus:ring-2 focus:ring-blue-500";
export const inputStyle = { background: "#0C0F22", border: "1px solid #2A3366" } as const;

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "ok" }) {
  const c = tone === "error" ? "#F87171" : tone === "ok" ? "#34D399" : "#6B7DB8";
  return <p className="text-sm" style={{ color: c }}>{children}</p>;
}
