"use client";

import { useState } from "react";
import { baseName, canvasToBlob, download, drawToCanvas, formatBytes, loadImage } from "@/lib/toolkit";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "./ui";

type Out = { name: string; before: number; blob: Blob };
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" };

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState("image/jpeg");
  const [maxWidth, setMaxWidth] = useState("");
  const [outs, setOuts] = useState<Out[]>([]);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true); setOuts([]);
    const res: Out[] = [];
    for (const f of files) {
      try {
        const img = await loadImage(f);
        const mw = Number(maxWidth);
        const scale = mw && img.naturalWidth > mw ? mw / img.naturalWidth : 1;
        const canvas = drawToCanvas(img, img.naturalWidth * scale, img.naturalHeight * scale, format === "image/jpeg" ? "#ffffff" : "rgba(0,0,0,0)");
        const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);
        res.push({ name: `${baseName(f.name)}-compressed.${EXT[format]}`, before: f.size, blob });
      } catch { /* skip unreadable file */ }
    }
    setOuts(res); setBusy(false);
  }

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" multiple label={files.length ? `${files.length} image(s) selected` : "Choose images (you can pick several)"} onFiles={(f) => { setFiles(f); setOuts([]); }} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label={`Quality: ${Math.round(quality * 100)}%`}>
            <input type="range" min={0.1} max={0.95} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} disabled={format === "image/png"} />
          </Field>
          <Field label="Output format">
            <select value={format} onChange={(e) => setFormat(e.target.value)} className={inputCls} style={inputStyle}>
              <option value="image/jpeg">JPG (smallest for photos)</option>
              <option value="image/webp">WebP (small, modern)</option>
              <option value="image/png">PNG (lossless)</option>
            </select>
          </Field>
          <Field label="Max width in px (optional)"><input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className={inputCls} style={inputStyle} placeholder="keep" /></Field>
        </div>
        <div><Button onClick={run} disabled={!files.length || busy}>{busy ? "Compressing…" : "Compress"}</Button></div>
        {outs.length > 0 && (
          <div className="flex flex-col gap-2">
            {outs.map((o) => {
              const pct = Math.round((1 - o.blob.size / o.before) * 100);
              return (
                <div key={o.name} className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3" style={{ background: "#0C0F22", border: "1px solid #1C2245" }}>
                  <span className="text-sm text-pt-white break-all">{o.name}</span>
                  <span className="text-sm" style={{ color: pct > 0 ? "#34D399" : "#FBBF24" }}>{formatBytes(o.before)} → {formatBytes(o.blob.size)} ({pct > 0 ? `-${pct}%` : "larger, try JPG or lower quality"})</span>
                  <Button secondary onClick={() => download(o.blob, o.name)}>Download</Button>
                </div>
              );
            })}
            <Note>PNG is lossless, so it often stays large. For photos, JPG or WebP usually saves the most.</Note>
          </div>
        )}
      </div>
    </Panel>
  );
}
