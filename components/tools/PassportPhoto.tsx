"use client";

import { useEffect, useRef, useState } from "react";
import { canvasToBlob, download, loadImage } from "@/lib/toolkit";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "./ui";

// Common official sizes in millimetres. Always double-check the current rules of the issuing authority.
export const PHOTO_SIZES = [
  { id: "us", label: "United States passport / visa (2×2 in)", w: 51, h: 51 },
  { id: "uk", label: "United Kingdom passport (35×45 mm)", w: 35, h: 45 },
  { id: "schengen", label: "Schengen visa / EU (35×45 mm)", w: 35, h: 45 },
  { id: "canada", label: "Canada passport (50×70 mm)", w: 50, h: 70 },
  { id: "india", label: "India passport (35×45 mm)", w: 35, h: 45 },
  { id: "india-visa", label: "India visa (2×2 in)", w: 51, h: 51 },
  { id: "australia", label: "Australia passport (35×45 mm)", w: 35, h: 45 },
  { id: "china", label: "China visa (33×48 mm)", w: 33, h: 48 },
  { id: "morocco", label: "Morocco ID / passport (35×45 mm)", w: 35, h: 45 },
];
const DPI = 300;
const px = (mm: number) => Math.round((mm / 25.4) * DPI);

export default function PassportPhoto({ defaultSize = "us" }: { defaultSize?: string }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [sizeId, setSizeId] = useState(defaultSize);
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const preview = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const size = PHOTO_SIZES.find((s) => s.id === sizeId)!;
  const W = px(size.w), H = px(size.h);

  function render(canvas: HTMLCanvasElement, w: number, h: number) {
    const ctx = canvas.getContext("2d")!;
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    if (!img) return;
    const base = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const dw = img.naturalWidth * base, dh = img.naturalHeight * base;
    ctx.drawImage(img, (w - dw) / 2 + off.x * w, (h - dh) / 2 + off.y * h, dw, dh);
  }

  useEffect(() => {
    const c = preview.current; if (!c) return;
    const scale = 300 / Math.max(W, H);
    render(c, W * scale, H * scale);
    const ctx = c.getContext("2d")!;
    // head guide: the face should fill roughly the middle of the frame
    ctx.strokeStyle = "rgba(59,130,246,0.9)"; ctx.setLineDash([6, 5]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(c.width / 2, c.height * 0.45, c.width * 0.26, c.height * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
  });

  async function save(sheet: boolean) {
    const photo = document.createElement("canvas"); render(photo, W, H);
    if (!sheet) return download(await canvasToBlob(photo, "image/jpeg", 0.95), `photo-${size.id}-${size.w}x${size.h}mm.jpg`);
    const s = document.createElement("canvas"); s.width = 1800; s.height = 1200; // 6×4 in at 300 dpi
    const ctx = s.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, s.width, s.height);
    const gap = 30, cols = Math.floor((s.width - gap) / (W + gap)), rows = Math.floor((s.height - gap) / (H + gap));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      ctx.drawImage(photo, gap + c * (W + gap), gap + r * (H + gap));
      ctx.strokeStyle = "#ccc"; ctx.strokeRect(gap + c * (W + gap), gap + r * (H + gap), W, H);
    }
    download(await canvasToBlob(s, "image/jpeg", 0.95), `photo-${size.id}-print-sheet-4x6.jpg`);
  }

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop button="Choose photo" accept="image/*" label={img ? "Photo loaded. Choose another?" : "Drop a front-facing photo here"}
          onFiles={async (f) => { if (!f[0]) return; try { setImg(await loadImage(f[0])); setZoom(1); setOff({ x: 0, y: 0 }); setError(""); } catch (e) { setError((e as Error).message); } }} />
        {error && <Note tone="error">{error}</Note>}
        <Field label="Photo size">
          <select value={sizeId} onChange={(e) => setSizeId(e.target.value)} className={inputCls} style={inputStyle}>
            {PHOTO_SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <canvas ref={preview} className="rounded-lg touch-none cursor-move" style={{ border: "1px solid #2A2E55", maxWidth: "100%" }}
            onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
            onPointerMove={(e) => { if (!drag.current) return; const c = preview.current!; setOff((o) => ({ x: o.x + (e.clientX - drag.current!.x) / c.clientWidth, y: o.y + (e.clientY - drag.current!.y) / c.clientHeight })); drag.current = { x: e.clientX, y: e.clientY }; }}
            onPointerUp={() => { drag.current = null; }} />
          <div className="flex flex-col gap-4 flex-1 w-full">
            <Field label={`Zoom: ${zoom.toFixed(2)}×`}><input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /></Field>
            <Note>Drag the photo to place your face inside the dashed oval. Output: {W}×{H} px at 300 dpi.</Note>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => save(false)} disabled={!img}>Download photo</Button>
              <Button secondary onClick={() => save(true)} disabled={!img}>Download 4×6 print sheet</Button>
            </div>
          </div>
        </div>
        <Note>Rules change: check the official requirements (background, expression, glasses, head size) before you submit.</Note>
      </div>
    </Panel>
  );
}
