"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "../ui";
import { Slider, canvasToBlob, download, formatBytes, loadImage, useBusy } from "./shared";

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const t = line ? `${line} ${word}` : word;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = word; } else line = t;
    }
    lines.push(line);
  }
  return lines;
}

export default function Meme() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [top, setTop] = useState("WHEN THE FORM SAYS MAX 50 KB");
  const [bottom, setBottom] = useState("AND YOUR PHOTO IS 4 MB");
  const [size, setSize] = useState(9); // % of image width
  const [color, setColor] = useState("#ffffff");
  const [saved, setSaved] = useState<Blob | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const { error, wrap: run } = useBusy();

  useEffect(() => {
    if (!img || !cv.current) return;
    const s = Math.min(1, 1400 / img.naturalWidth), W = Math.round(img.naturalWidth * s), H = Math.round(img.naturalHeight * s), c = cv.current;
    c.width = W; c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, W, H);
    const fs = Math.round((size / 100) * W);
    ctx.font = `900 ${fs}px Impact, "Arial Black", "Anton", sans-serif`;
    ctx.textAlign = "center"; ctx.fillStyle = color; ctx.strokeStyle = "#000"; ctx.lineJoin = "round"; ctx.lineWidth = Math.max(2, fs / 7);
    const draw = (t: string, fromTop: boolean) => {
      const lines = wrap(ctx, t.toUpperCase(), W * 0.94);
      lines.forEach((l, i) => {
        const y = fromTop ? fs * 1.05 + i * fs * 1.08 : H - fs * 0.35 - (lines.length - 1 - i) * fs * 1.08;
        ctx.strokeText(l, W / 2, y, W * 0.96); ctx.fillText(l, W / 2, y, W * 0.96);
      });
    };
    draw(top, true); draw(bottom, false);
    setSaved(null);
  }, [img, top, bottom, size, color]);

  const open = (f: File[]) => run(async () => setImg(await loadImage(f[0])));
  const save = async () => { const b = await canvasToBlob(cv.current!, "image/png"); setSaved(b); download(b, "meme.png"); };

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image to make a meme" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Top text"><textarea value={top} onChange={(e) => setTop(e.target.value)} rows={2} className={inputCls} style={inputStyle} /></Field>
              <Field label="Bottom text"><textarea value={bottom} onChange={(e) => setBottom(e.target.value)} rows={2} className={inputCls} style={inputStyle} /></Field>
            </div>
            <div className="flex flex-wrap gap-5 items-end">
              <Slider label="Text size" value={size} min={4} max={16} onChange={setSize} suffix="%" />
              <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>Text colour<input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 rounded" /></label>
            </div>
            <canvas ref={cv} data-testid="meme-canvas" className="max-w-full self-start rounded-lg" style={{ maxHeight: 520, width: "auto", border: "1px solid #23264A" }} />
            <div className="flex flex-wrap gap-3 items-center"><Button onClick={save}>Download PNG</Button>{saved && <Note tone="ok">Saved ({formatBytes(saved.size)})</Note>}</div>
          </>
        )}
      </div>
    </Panel>
  );
}
