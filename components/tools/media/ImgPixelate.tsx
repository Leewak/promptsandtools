"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { Slider, baseName, canvasToBlob, download, extFor, formatBytes, loadImage, mimeFor, useBusy } from "./shared";

type Style = "Pixelate" | "Blur" | "Black box";
interface R { x: number; y: number; w: number; h: number }

export default function ImgPixelate() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [rects, setRects] = useState<R[]>([]);
  const [style, setStyle] = useState<Style>("Pixelate");
  const [strength, setStrength] = useState(50);
  const [fmt, setFmt] = useState("jpg");
  const [saved, setSaved] = useState<Blob | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [live, setLive] = useState<R | null>(null);
  const { error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => { const i = await loadImage(f[0]); setFile(f[0]); setImg(i); setRects([]); setSaved(null); setFmt(f[0].type === "image/png" ? "png" : "jpg"); });

  useEffect(() => {
    if (!img || !cv.current) return;
    const c = cv.current, W = img.naturalWidth, H = img.naturalHeight;
    c.width = W; c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const all = live ? [...rects, live] : rects;
    for (const r of all) {
      if (r.w < 2 || r.h < 2) continue;
      const x = Math.round(r.x), y = Math.round(r.y), w = Math.round(r.w), h = Math.round(r.h);
      if (style === "Black box") { ctx.fillStyle = "#000"; ctx.fillRect(x, y, w, h); continue; }
      const block = Math.max(2, Math.round((strength / 100) * Math.min(w, h) / 3));
      const tmp = document.createElement("canvas"); tmp.width = Math.max(1, Math.ceil(w / block)); tmp.height = Math.max(1, Math.ceil(h / block));
      const t = tmp.getContext("2d")!;
      t.imageSmoothingEnabled = style === "Blur";
      t.drawImage(img, x, y, w, h, 0, 0, tmp.width, tmp.height);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.imageSmoothingEnabled = style === "Blur";
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, tmp.width * block, tmp.height * block);
      ctx.restore();
    }
    setSaved(null);
  }, [img, rects, live, style, strength]);

  const pos = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * img!.naturalWidth, y: ((e.clientY - r.top) / r.height) * img!.naturalHeight }; };
  const down = (e: React.PointerEvent) => { cv.current!.setPointerCapture(e.pointerId); start.current = pos(e); };
  const move = (e: React.PointerEvent) => { if (!start.current) return; const p = pos(e), s = start.current; setLive({ x: Math.min(p.x, s.x), y: Math.min(p.y, s.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) }); };
  const up = () => { if (live && live.w > 3 && live.h > 3) setRects([...rects, live]); setLive(null); start.current = null; };

  const save = async () => { if (!file) return; const b = await canvasToBlob(cv.current!, mimeFor(fmt), 0.95); setSaved(b); download(b, `${baseName(file.name)}-censored.${extFor(fmt)}`); };

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image here" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && file && (
          <>
            <Note>Drag on the picture to cover a face, licence plate or other detail. Draw as many areas as you need.</Note>
            <div className="flex flex-wrap gap-5 items-end">
              <Segmented options={["Pixelate", "Blur", "Black box"] as Style[]} value={style} onChange={setStyle} />
              {style !== "Black box" && <Slider label="Strength" value={strength} min={10} max={100} onChange={setStrength} suffix="%" />}
            </div>
            <canvas ref={cv} data-testid="censor-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} className="max-w-full self-start touch-none cursor-crosshair rounded-lg" style={{ maxHeight: 500, width: "auto", border: "1px solid #23264A" }} />
            <div className="flex flex-wrap gap-3 items-center">
              <Button secondary disabled={!rects.length} onClick={() => setRects(rects.slice(0, -1))}>Undo last area</Button>
              <Button secondary disabled={!rects.length} onClick={() => setRects([])}>Clear all</Button>
              <Segmented options={["jpg", "png"]} value={fmt} onChange={setFmt} format={(f) => f.toUpperCase()} />
              <Button onClick={save} disabled={!rects.length}>Download</Button>
              {saved && <Note tone="ok">Saved ({formatBytes(saved.size)})</Note>}
            </div>
            <Note>For sensitive details, prefer Pixelate with high strength or Black box. Light blur can sometimes be partly reversed.</Note>
          </>
        )}
      </div>
    </Panel>
  );
}
