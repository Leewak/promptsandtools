"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { Slider, canvasToBlob, download, formatBytes, loadImage, useBusy } from "./shared";

type Layout = "Row" | "Column" | "Grid";

export default function Collage() {
  const [imgs, setImgs] = useState<{ name: string; img: HTMLImageElement }[]>([]);
  const [layout, setLayout] = useState<Layout>("Grid");
  const [gap, setGap] = useState(12);
  const [bg, setBg] = useState("#ffffff");
  const [fmt, setFmt] = useState<"png" | "jpg">("jpg");
  const [saved, setSaved] = useState<Blob | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const { error, wrap } = useBusy();

  const add = (files: File[]) => wrap(async () => {
    const room = 4 - imgs.length;
    const loaded = await Promise.all(files.slice(0, room).map(async (f) => ({ name: f.name, img: await loadImage(f) })));
    setImgs([...imgs, ...loaded]);
  });

  useEffect(() => {
    if (imgs.length === 0 || !cv.current) return;
    const n = imgs.length, c = cv.current, CELL = 700;
    const cols = layout === "Row" ? n : layout === "Column" ? 1 : n === 1 ? 1 : 2;
    const rows = Math.ceil(n / cols);
    c.width = cols * CELL + (cols + 1) * gap; c.height = rows * CELL + (rows + 1) * gap;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height);
    imgs.forEach(({ img }, i) => {
      // a lone last image in a grid stretches across the full row
      const r = Math.floor(i / cols), col = i % cols, span = layout === "Grid" && n === 3 && i === 2 ? 2 : 1;
      const w = CELL * span + (span - 1) * gap, h = CELL;
      const x = gap + col * (CELL + gap), y = gap + r * (CELL + gap);
      const k = Math.max(w / img.naturalWidth, h / img.naturalHeight), sw = w / k, sh = h / k;
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
      ctx.restore();
    });
    setSaved(null);
  }, [imgs, layout, gap, bg]);

  const save = async () => { const b = await canvasToBlob(cv.current!, fmt === "png" ? "image/png" : "image/jpeg", 0.92); setSaved(b); download(b, `collage.${fmt}`); };
  const move = (i: number, d: number) => { const a = [...imgs], j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setImgs(a); };

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        {imgs.length < 4 && <Drop accept="image/*" multiple label={imgs.length ? "Add more images (up to 4)" : "Drop 2 to 4 images here"} button="Choose images" onFiles={add} />}
        {error && <Note tone="error">{error}</Note>}
        {imgs.length > 0 && (
          <>
            <ol className="flex flex-col gap-2">
              {imgs.map((m, i) => (
                <li key={i + m.name} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm" style={{ background: "#0C0D22", border: "1px solid #1F2244" }}>
                  <span className="text-[#E8EAF6] truncate">{i + 1}. {m.name}</span>
                  <span className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => move(i, -1)} className="px-2" style={{ color: "#C9CCE8" }} aria-label="Move earlier">↑</button>
                    <button type="button" onClick={() => move(i, 1)} className="px-2" style={{ color: "#C9CCE8" }} aria-label="Move later">↓</button>
                    <button type="button" onClick={() => setImgs(imgs.filter((_, j) => j !== i))} className="px-2" style={{ color: "#F87171" }} aria-label="Remove">✕</button>
                  </span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-5 items-end">
              <Segmented options={["Grid", "Row", "Column"] as Layout[]} value={layout} onChange={setLayout} />
              <Slider label="Spacing" value={gap} min={0} max={60} onChange={setGap} suffix=" px" />
              <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>Background<input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-16 rounded" /></label>
            </div>
            {imgs.length < 2 && <Note>Add at least one more image to make a collage.</Note>}
            <canvas ref={cv} data-testid="collage-canvas" className="max-w-full self-start rounded-lg" style={{ maxHeight: 520, width: "auto", border: "1px solid #23264A" }} />
            <div className="flex flex-wrap gap-3 items-center">
              <Segmented options={["jpg", "png"] as const} value={fmt} onChange={setFmt} format={(f) => f.toUpperCase()} />
              <Button onClick={save} disabled={imgs.length < 2}>Download collage</Button>
              {saved && <Note tone="ok">Saved ({formatBytes(saved.size)})</Note>}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
