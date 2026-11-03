"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Field, Note, Panel, Segmented, inputCls, inputStyle } from "../ui";
import { baseName, canvasToBlob, download, formatBytes, loadImage, mimeFor, extFor, useBusy } from "./shared";

const RATIOS: Record<string, number | null> = { Free: null, "1:1": 1, "4:3": 4 / 3, "3:2": 3 / 2, "16:9": 16 / 9, "3:4": 3 / 4, "9:16": 9 / 16 };
interface R { x: number; y: number; w: number; h: number }

export default function ImgCrop() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [rect, setRect] = useState<R>({ x: 0, y: 0, w: 0, h: 0 });
  const [ratio, setRatio] = useState("Free");
  const [fmt, setFmt] = useState("png");
  const [out, setOut] = useState<{ blob: Blob; url: string } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const { busy, error, wrap } = useBusy();

  useEffect(() => () => { if (out) URL.revokeObjectURL(out.url); }, [out]);

  const open = (f: File[]) => wrap(async () => {
    const i = await loadImage(f[0]);
    setFile(f[0]); setImg(i); setOut(null);
    setRect({ x: Math.round(i.naturalWidth * 0.1), y: Math.round(i.naturalHeight * 0.1), w: Math.round(i.naturalWidth * 0.8), h: Math.round(i.naturalHeight * 0.8) });
    setFmt(f[0].type === "image/png" ? "png" : "jpg");
  });

  const clamp = (r: R): R => {
    if (!img) return r;
    const W = img.naturalWidth, H = img.naturalHeight;
    const x = Math.max(0, Math.min(W - 1, Math.round(r.x))), y = Math.max(0, Math.min(H - 1, Math.round(r.y)));
    return { x, y, w: Math.max(1, Math.min(W - x, Math.round(r.w))), h: Math.max(1, Math.min(H - y, Math.round(r.h))) };
  };

  const toImg = (e: React.PointerEvent) => { const r = box.current!.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * img!.naturalWidth, y: ((e.clientY - r.top) / r.height) * img!.naturalHeight }; };
  const down = (e: React.PointerEvent) => { box.current!.setPointerCapture(e.pointerId); start.current = toImg(e); setOut(null); };
  const move = (e: React.PointerEvent) => {
    if (!start.current || !img) return;
    const p = toImg(e), s = start.current, a = RATIOS[ratio];
    let w = Math.abs(p.x - s.x), h = Math.abs(p.y - s.y);
    if (a) { if (w / h > a) w = h * a; else h = w / a; }
    const x = p.x < s.x ? s.x - w : s.x, y = p.y < s.y ? s.y - h : s.y;
    setRect(clamp({ x, y, w, h }));
  };
  const up = () => { start.current = null; };

  function setRatioTo(r: string) {
    setRatio(r); setOut(null);
    const a = RATIOS[r];
    if (a && img) { let w = rect.w, h = w / a; if (h > img.naturalHeight - rect.y) { h = img.naturalHeight - rect.y; w = h * a; } setRect(clamp({ ...rect, w, h })); }
  }
  const setField = (k: keyof R, v: number) => { setRect(clamp({ ...rect, [k]: v })); setOut(null); };

  const run = () => wrap(async () => {
    if (!img) return;
    const c = document.createElement("canvas"); c.width = rect.w; c.height = rect.h;
    const ctx = c.getContext("2d")!;
    if (fmt === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    const blob = await canvasToBlob(c, mimeFor(fmt), 0.95);
    setOut({ blob, url: URL.createObjectURL(blob) });
  });

  const pct = img ? { left: `${(rect.x / img.naturalWidth) * 100}%`, top: `${(rect.y / img.naturalHeight) * 100}%`, width: `${(rect.w / img.naturalWidth) * 100}%`, height: `${(rect.h / img.naturalHeight) * 100}%` } : {};

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image to crop" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && file && (
          <>
            <Note>Drag on the picture to draw the crop area, or type exact pixel values below. Image size: {img.naturalWidth}×{img.naturalHeight} px.</Note>
            <Segmented options={Object.keys(RATIOS)} value={ratio} onChange={setRatioTo} />
            <div ref={box} data-testid="crop-box" onPointerDown={down} onPointerMove={move} onPointerUp={up} className="relative inline-block max-w-full self-start touch-none select-none cursor-crosshair" style={{ lineHeight: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="Image to crop" draggable={false} className="max-w-full h-auto block" style={{ maxHeight: 520 }} />
              <div className="absolute pointer-events-none" style={{ ...pct, outline: "2px solid #3B82F6", boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)" }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl">
              {(["x", "y", "w", "h"] as const).map((k) => (
                <Field key={k} label={{ x: "Left (px)", y: "Top (px)", w: "Width (px)", h: "Height (px)" }[k]}>
                  <input type="number" value={rect[k]} onChange={(e) => setField(k, Number(e.target.value) || 0)} className={inputCls} style={inputStyle} aria-label={k} />
                </Field>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Segmented options={["png", "jpg", "webp"]} value={fmt} onChange={(f) => { setFmt(f); setOut(null); }} format={(f) => f.toUpperCase()} />
              <Button onClick={run} disabled={busy}>Crop image</Button>
              {out && <Button secondary onClick={() => download(out.blob, `${baseName(file.name)}-cropped.${extFor(fmt)}`)}>Download ({rect.w}×{rect.h}, {formatBytes(out.blob.size)})</Button>}
            </div>
            {out && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={out.url} alt="Cropped result" className="max-h-64 self-start rounded-lg" style={{ border: "1px solid #23264A" }} />
            )}
          </>
        )}
      </div>
    </Panel>
  );
}
