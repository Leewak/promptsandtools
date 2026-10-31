"use client";

import { useState } from "react";
import { download, drawToCanvas, formatBytes, jpegUnder, loadImage } from "@/lib/toolkit";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "./ui";

const PRESETS = [
  { label: "140×60 px, under 20 KB", w: 140, h: 60, kb: 20 },
  { label: "300×80 px, under 30 KB", w: 300, h: 80, kb: 30 },
  { label: "350×100 px, under 50 KB", w: 350, h: 100, kb: 50 },
];

export default function SignatureResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [w, setW] = useState(140), [h, setH] = useState(60), [kb, setKb] = useState(20);
  const [clean, setClean] = useState(true);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState("");

  async function run() {
    if (!file) return;
    setError(""); setResult(null);
    try {
      const img = await loadImage(file);
      // crop to the ink so the signature fills the box
      const src = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
      const sctx = src.getContext("2d")!; const d = sctx.getImageData(0, 0, src.width, src.height);
      let x0 = src.width, y0 = src.height, x1 = 0, y1 = 0;
      for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
        const i = (y * src.width + x) * 4, lum = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
        if (lum < 150) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (clean) { const v = lum > 170 ? 255 : lum < 110 ? 0 : lum; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; }
      }
      sctx.putImageData(d, 0, 0);
      if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = src.width; y1 = src.height; }
      const pad = 0.08, cw = x1 - x0, ch = y1 - y0;
      const out = document.createElement("canvas"); out.width = w; out.height = h;
      const ctx = out.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      const s = Math.min((w * (1 - 2 * pad)) / cw, (h * (1 - 2 * pad)) / ch);
      ctx.drawImage(src, x0, y0, cw, ch, (w - cw * s) / 2, (h - ch * s) / 2, cw * s, ch * s);
      const res = await jpegUnder(drawToCanvas(out, w, h), kb * 1024);
      setResult({ blob: res.blob, url: URL.createObjectURL(res.blob) });
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label={file ? `Selected: ${file.name}` : "Choose a photo or scan of your signature (dark ink on white paper)"} onFiles={(f) => { setFile(f[0] ?? null); setResult(null); }} />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => { setW(p.w); setH(p.h); setKb(p.kb); }} className="px-3 py-1.5 rounded-lg text-sm" style={{ border: "1px solid #2A3366", color: "#C7D2FE" }}>{p.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Width (px)"><input type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 1)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Height (px)"><input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 1)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Max KB"><input type="number" value={kb} onChange={(e) => setKb(Number(e.target.value) || 1)} className={inputCls} style={inputStyle} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm" style={{ color: "#C7D2FE" }}><input type="checkbox" checked={clean} onChange={(e) => setClean(e.target.checked)} /> Clean background to pure white</label>
        <div><Button onClick={run} disabled={!file}>Resize signature</Button></div>
        {error && <Note tone="error">{error}</Note>}
        {result && (
          <div className="flex flex-wrap items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Resized signature" className="rounded bg-white" style={{ border: "1px solid #2A3366" }} />
            <Note tone="ok">{w}×{h} px · {formatBytes(result.blob.size)}</Note>
            <Button onClick={() => download(result.blob, `signature-${w}x${h}.jpg`)}>Download JPG</Button>
          </div>
        )}
      </div>
    </Panel>
  );
}
