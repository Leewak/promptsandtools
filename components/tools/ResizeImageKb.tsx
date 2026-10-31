"use client";

import { useState } from "react";
import { baseName, download, drawToCanvas, formatBytes, jpegUnder, loadImage } from "@/lib/toolkit";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "./ui";

const PRESETS = [20, 50, 100, 200, 500];

export default function ResizeImageKb({ defaultKb = 50 }: { defaultKb?: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [kb, setKb] = useState(defaultKb);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{ blob: Blob; width: number; height: number; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setResult(null);
    try {
      const img = await loadImage(file);
      let w = img.naturalWidth, h = img.naturalHeight;
      const W = Number(width), H = Number(height);
      if (W && H) { w = W; h = H; } else if (W) { h = Math.round(h * (W / w)); w = W; } else if (H) { w = Math.round(w * (H / h)); h = H; }
      const out = await jpegUnder(drawToCanvas(img, w, h), kb * 1024);
      setResult({ ...out, url: URL.createObjectURL(out.blob) });
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  }

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label={file ? `Selected: ${file.name} (${formatBytes(file.size)})` : "Choose a photo (JPG, PNG, WebP)"} onFiles={(f) => { setFile(f[0] ?? null); setResult(null); }} />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} type="button" onClick={() => setKb(p)} className="px-3 py-1.5 rounded-lg text-sm"
              style={{ border: "1px solid #2A3366", background: kb === p ? "#3B82F6" : "transparent", color: kb === p ? "#fff" : "#C7D2FE" }}>
              {p} KB
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Maximum size (KB)"><input type="number" min={5} value={kb} onChange={(e) => setKb(Number(e.target.value) || 1)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Width in px (optional)"><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className={inputCls} style={inputStyle} placeholder="keep" /></Field>
          <Field label="Height in px (optional)"><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={inputCls} style={inputStyle} placeholder="keep" /></Field>
        </div>
        <div><Button onClick={run} disabled={!file || busy}>{busy ? "Working…" : `Resize to under ${kb} KB`}</Button></div>
        {error && <Note tone="error">{error}</Note>}
        {result && (
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Resized result" className="max-w-[220px] rounded-lg" style={{ border: "1px solid #2A3366" }} />
            <div className="flex flex-col gap-3">
              <Note tone="ok">Done: {formatBytes(result.blob.size)} · {result.width}×{result.height} px · JPG</Note>
              <Button onClick={() => download(result.blob, `${baseName(file!.name)}-${kb}kb.jpg`)}>Download JPG</Button>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
