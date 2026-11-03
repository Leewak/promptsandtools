"use client";

import { useState } from "react";
import { Button, Drop, Field, Note, Panel, Segmented, inputCls, inputStyle } from "../ui";
import { Slider, baseName, canvasToBlob, download, drawToCanvas, extFor, formatBytes, loadImage, mimeFor, useBusy } from "./shared";

export default function ImgResize() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [fmt, setFmt] = useState("jpg");
  const [q, setQ] = useState(90);
  const [out, setOut] = useState<Blob | null>(null);
  const { busy, error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => {
    const i = await loadImage(f[0]); setFile(f[0]); setImg(i); setW(i.naturalWidth); setH(i.naturalHeight); setOut(null);
    setFmt(f[0].type === "image/png" ? "png" : f[0].type === "image/webp" ? "webp" : "jpg");
  });
  const ar = img ? img.naturalWidth / img.naturalHeight : 1;
  const setWidth = (v: number) => { setW(v); if (lock) setH(Math.max(1, Math.round(v / ar))); setOut(null); };
  const setHeight = (v: number) => { setH(v); if (lock) setW(Math.max(1, Math.round(v * ar))); setOut(null); };
  const pct = (p: number) => { if (!img) return; setW(Math.round(img.naturalWidth * p / 100)); setH(Math.round(img.naturalHeight * p / 100)); setOut(null); };

  const run = () => wrap(async () => {
    if (!img) return;
    if (w > 12000 || h > 12000) throw new Error("Keep each side under 12,000 px so your browser can handle it.");
    const c = drawToCanvas(img, w, h, fmt === "png" ? "rgba(0,0,0,0)" : "#ffffff");
    setOut(await canvasToBlob(c, mimeFor(fmt), q / 100));
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image to resize" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && file && (
          <>
            <Note>Original: {img.naturalWidth}×{img.naturalHeight} px, {formatBytes(file.size)}</Note>
            <div className="flex flex-wrap gap-2">{[25, 50, 75, 150, 200].map((p) => <Button key={p} secondary onClick={() => pct(p)}>{p}%</Button>)}</div>
            <div className="flex flex-wrap items-end gap-4">
              <Field label="Width (px)"><input type="number" min={1} value={w} onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))} className={inputCls} style={inputStyle} aria-label="width" /></Field>
              <Field label="Height (px)"><input type="number" min={1} value={h} onChange={(e) => setHeight(Math.max(1, Number(e.target.value) || 1))} className={inputCls} style={inputStyle} aria-label="height" /></Field>
              <label className="flex items-center gap-2 text-sm pb-2.5" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Keep aspect ratio</label>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Segmented options={["jpg", "png", "webp"]} value={fmt} onChange={(f) => { setFmt(f); setOut(null); }} format={(f) => f.toUpperCase()} />
              {fmt !== "png" && <Slider label="Quality" value={q} min={30} max={100} onChange={(v) => { setQ(v); setOut(null); }} suffix="%" />}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={run} disabled={busy}>Resize image</Button>
              {out && <Button secondary onClick={() => download(out, `${baseName(file.name)}-${w}x${h}.${extFor(fmt)}`)}>Download ({w}×{h}, {formatBytes(out.size)})</Button>}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
