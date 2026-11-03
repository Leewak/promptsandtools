"use client";

import { useState, type ReactNode } from "react";

export { formatBytes, download, baseName, canvasToBlob, drawToCanvas, loadImage } from "@/lib/toolkit";

/** Parse "1-3, 5, 8-" into a sorted list of unique 1-based page numbers, or null if invalid. */
export function parseRanges(input: string, max: number): number[] | null {
  const out = new Set<number>();
  for (const part of input.split(/[,\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d*)-(\d*)$/) || part.match(/^(\d+)$/);
    if (!m) return null;
    let a: number, b: number;
    if (m.length === 2) { a = b = Number(m[1]); } else { a = m[1] ? Number(m[1]) : 1; b = m[2] ? Number(m[2]) : max; }
    if (!a || !b || a > b || b > max) return null;
    for (let i = a; i <= b; i++) out.add(i);
  }
  return out.size ? [...out].sort((x, y) => x - y) : null;
}

export async function loadPdfLib(file: File) {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = new Uint8Array(await file.arrayBuffer());
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (e) {
    throw new Error(/encrypt/i.test(String(e)) ? "This PDF is password-protected. Remove the password in the app that made it, then try again." : "This file could not be read as a PDF.");
  }
}

export async function openPdfjs(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  try {
    return await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  } catch (e) {
    throw new Error(/password/i.test(String(e)) ? "This PDF is password-protected. Remove the password in the app that made it, then try again." : "This file could not be read as a PDF.");
  }
}

export async function renderPageCanvas(doc: Awaited<ReturnType<typeof openPdfjs>>, n: number, scale: number) {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return canvas;
}

export const pdfBlob = (bytes: Uint8Array) => new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });

const crcTable = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(d: Uint8Array) { let c = 0xffffffff; for (let i = 0; i < d.length; i++) c = crcTable[(c ^ d[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

/** Minimal uncompressed ZIP writer, so several output files can be saved with one click. */
export function makeZip(files: { name: string; data: Uint8Array }[]): Blob {
  const enc = new TextEncoder();
  const parts: BlobPart[] = [], central: BlobPart[] = [];
  let offset = 0, cdSize = 0;
  for (const f of files) {
    const name = enc.encode(f.name), crc = crc32(f.data), size = f.data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(12, 0x21, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, size, true); lh.setUint32(22, size, true); lh.setUint16(26, name.length, true);
    parts.push(lh.buffer, name, f.data as Uint8Array<ArrayBuffer>);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(14, 0x21, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, size, true); ch.setUint32(24, size, true); ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
    central.push(ch.buffer, name);
    offset += 30 + name.length + size; cdSize += 46 + name.length;
  }
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end.buffer], { type: "application/zip" });
}

export async function blobBytes(b: Blob) { return new Uint8Array(await b.arrayBuffer()); }

export const mimeFor = (fmt: string) => (fmt === "png" ? "image/png" : fmt === "webp" ? "image/webp" : "image/jpeg");
export const extFor = (fmt: string) => (fmt === "jpeg" ? "jpg" : fmt);

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-end gap-4">{children}</div>;
}

export function Checker({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden inline-block max-w-full" style={{ backgroundColor: "#fff", backgroundImage: "linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,8px 8px" }}>
      {children}
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, suffix = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm min-w-[200px]" style={{ color: "#C9CCE8" }}>
      <span>{label}: <b style={{ color: "#E8EAF6" }}>{value}{suffix}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function useBusy() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function wrap(fn: () => Promise<void>) {
    setBusy(true); setError("");
    try { await fn(); } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    setBusy(false);
  }
  return { busy, error, setError, wrap };
}
