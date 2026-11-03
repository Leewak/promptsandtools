"use client";

import { useRef, useState } from "react";
import { Drop, Note, Panel, Button } from "../ui";
import { loadImage, useBusy } from "./shared";

interface Col { hex: string; rgb: string; hsl: string }
const toCol = (r: number, g: number, b: number): Col => {
  const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  const R = r / 255, G = g / 255, B = b / 255, mx = Math.max(R, G, B), mn = Math.min(R, G, B), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4; h = Math.round(h * 60); if (h < 0) h += 360; }
  return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` };
};

export default function ColorPicker() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [has, setHas] = useState(false);
  const [picked, setPicked] = useState<Col | null>(null);
  const [history, setHistory] = useState<Col[]>([]);
  const [palette, setPalette] = useState<Col[]>([]);
  const [copied, setCopied] = useState("");
  const { error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => {
    const img = await loadImage(f[0]);
    const c = cv.current!, s = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, c.width, c.height);
    setHas(true); setPicked(null); setHistory([]);
    // dominant colours: bucket pixels into a coarse 4-bit grid and take the most common buckets
    const d = ctx.getImageData(0, 0, c.width, c.height).data, buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < d.length; i += 16) {
      if (d[i + 3] < 128) continue;
      const k = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4), e = buckets.get(k) ?? { n: 0, r: 0, g: 0, b: 0 };
      e.n++; e.r += d[i]; e.g += d[i + 1]; e.b += d[i + 2]; buckets.set(k, e);
    }
    const top: Col[] = [];
    for (const e of [...buckets.values()].sort((a, b) => b.n - a.n)) {
      const col = toCol(Math.round(e.r / e.n), Math.round(e.g / e.n), Math.round(e.b / e.n));
      const [r, g, b] = [col.rgb.match(/\d+/g)!.map(Number)][0];
      if (top.every((t) => { const [r2, g2, b2] = t.rgb.match(/\d+/g)!.map(Number); return Math.hypot(r - r2, g - g2, b - b2) > 60; })) top.push(col);
      if (top.length === 6) break;
    }
    setPalette(top);
  });

  const pick = (e: React.PointerEvent | React.MouseEvent) => {
    const c = cv.current!, r = c.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * c.width), y = Math.floor(((e.clientY - r.top) / r.height) * c.height);
    const [R, G, B] = c.getContext("2d", { willReadFrequently: true })!.getImageData(Math.max(0, Math.min(c.width - 1, x)), Math.max(0, Math.min(c.height - 1, y)), 1, 1).data;
    return toCol(R, G, B);
  };
  const click = (e: React.MouseEvent) => { const col = pick(e); setPicked(col); setHistory([col, ...history.filter((h) => h.hex !== col.hex)].slice(0, 12)); };
  const copy = async (t: string) => { await navigator.clipboard.writeText(t); setCopied(t); setTimeout(() => setCopied(""), 1200); };

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image to pick colours from" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        <canvas ref={cv} data-testid="picker-canvas" onClick={click} className="max-w-full self-start rounded-lg cursor-crosshair" style={{ display: has ? "block" : "none", maxHeight: 460, width: "auto", border: "1px solid #23264A" }} />
        {has && <Note>Click anywhere on the image to read that pixel&apos;s colour.</Note>}
        {picked && (
          <div className="flex flex-wrap items-center gap-4">
            <span className="h-16 w-16 rounded-lg" style={{ background: picked.hex, border: "1px solid #2A2E55" }} />
            <div className="flex flex-col gap-2">
              {[picked.hex, picked.rgb, picked.hsl].map((t) => <Button key={t} secondary onClick={() => copy(t)}>{copied === t ? "Copied" : t}</Button>)}
            </div>
          </div>
        )}
        {history.length > 1 && (
          <div><p className="text-sm mb-2" style={{ color: "#C9CCE8" }}>Picked colours</p><div className="flex flex-wrap gap-2">{history.map((h) => <button key={h.hex} type="button" title={h.hex} onClick={() => copy(h.hex)} className="h-9 w-9 rounded" style={{ background: h.hex, border: "1px solid #2A2E55" }} aria-label={h.hex} />)}</div></div>
        )}
        {palette.length > 0 && (
          <div><p className="text-sm mb-2" style={{ color: "#C9CCE8" }}>Main colours in this image (click to copy)</p>
            <div className="flex flex-wrap gap-3">{palette.map((p) => <button key={p.hex} type="button" onClick={() => copy(p.hex)} className="flex flex-col items-center gap-1 text-xs" style={{ color: "#9CA1C9", fontFamily: "var(--font-mono)" }}><span className="h-12 w-16 rounded" style={{ background: p.hex, border: "1px solid #2A2E55" }} />{copied === p.hex ? "Copied" : p.hex}</button>)}</div></div>
        )}
      </div>
    </Panel>
  );
}
