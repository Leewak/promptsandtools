"use client";

// One component for the "load an image, tweak sliders, see a live canvas, download" tools:
// round corners, add border, black & white.
import { useEffect, useRef, useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { Checker, Slider, baseName, canvasToBlob, download, extFor, formatBytes, loadImage, mimeFor, useBusy } from "./shared";

type Mode = "round" | "border" | "grayscale";

export default function ImgLive({ mode = "round" }: { mode?: Mode }) {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [radius, setRadius] = useState(24); // % of the shorter side (0-50)
  const [bw, setBw] = useState(5); // border width, % of shorter side
  const [bColor, setBColor] = useState("#ffffff");
  const [bRound, setBRound] = useState(0);
  const [gray, setGray] = useState(100);
  const [contrast, setContrast] = useState(0);
  const [bright, setBright] = useState(0);
  const [fmt, setFmt] = useState(mode === "round" ? "png" : "jpg");
  const [saved, setSaved] = useState<Blob | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const { error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => { const i = await loadImage(f[0]); setFile(f[0]); setImg(i); setSaved(null); if (mode !== "round") setFmt(f[0].type === "image/png" ? "png" : "jpg"); });

  useEffect(() => {
    if (!img || !cv.current) return;
    const W = img.naturalWidth, H = img.naturalHeight, S = Math.min(W, H), c = cv.current;
    const ctx = c.getContext("2d")!;
    setSaved(null);
    if (mode === "round") {
      c.width = W; c.height = H;
      const r = (radius / 100) * S;
      ctx.clearRect(0, 0, W, H);
      if (fmt === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); }
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, H, r); ctx.clip(); ctx.drawImage(img, 0, 0); ctx.restore();
    } else if (mode === "border") {
      const t = Math.round((bw / 100) * S);
      c.width = W + 2 * t; c.height = H + 2 * t;
      const r = (bRound / 100) * Math.min(c.width, c.height);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, c.width, c.height, r); ctx.clip();
      ctx.fillStyle = bColor; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, t, t); ctx.restore();
    } else {
      c.width = W; c.height = H;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, W, H), p = d.data, g = gray / 100, k = (contrast + 100) / 100, b = bright * 2.55;
      for (let i = 0; i < p.length; i += 4) {
        const l = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        for (let j = 0; j < 3; j++) {
          let v = p[i + j] * (1 - g) + l * g;
          v = (v - 128) * k + 128 + b;
          p[i + j] = v < 0 ? 0 : v > 255 ? 255 : v;
        }
      }
      ctx.putImageData(d, 0, 0);
    }
  }, [img, mode, radius, bw, bColor, bRound, gray, contrast, bright, fmt]);

  const suffix = mode === "round" ? "rounded" : mode === "border" ? "border" : "bw";
  const save = async () => { if (!file) return; const b = await canvasToBlob(cv.current!, mimeFor(fmt), 0.95); setSaved(b); download(b, `${baseName(file.name)}-${suffix}.${extFor(fmt)}`); };
  const transparentOk = (mode === "round" && radius > 0) || (mode === "border" && bRound > 0);

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image here" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && file && (
          <>
            <div className="flex flex-wrap gap-5">
              {mode === "round" && <Slider label="Corner radius" value={radius} min={0} max={50} onChange={setRadius} suffix="%" />}
              {mode === "border" && (
                <>
                  <Slider label="Border width" value={bw} min={0} max={30} onChange={setBw} suffix="%" />
                  <Slider label="Round the outer corners" value={bRound} min={0} max={50} onChange={setBRound} suffix="%" />
                  <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>Border colour<input type="color" value={bColor} onChange={(e) => setBColor(e.target.value)} className="h-10 w-16 rounded" /></label>
                </>
              )}
              {mode === "grayscale" && (
                <>
                  <Slider label="Black & white" value={gray} min={0} max={100} onChange={setGray} suffix="%" />
                  <Slider label="Contrast" value={contrast} min={-50} max={80} onChange={setContrast} />
                  <Slider label="Brightness" value={bright} min={-50} max={50} onChange={setBright} />
                </>
              )}
            </div>
            <Checker><canvas ref={cv} data-testid="live-canvas" className="block max-w-full" style={{ maxHeight: 460, width: "auto", height: "auto" }} /></Checker>
            <div className="flex flex-wrap gap-3 items-center">
              <Segmented options={["png", "jpg", "webp"]} value={fmt} onChange={setFmt} format={(f) => f.toUpperCase()} />
              <Button onClick={save}>Download</Button>
              {saved && <Note tone="ok">Saved ({formatBytes(saved.size)})</Note>}
            </div>
            {transparentOk && fmt === "jpg" && <Note>JPG has no transparency, so the corners will be white. Choose PNG or WebP to keep them transparent.</Note>}
          </>
        )}
      </div>
    </Panel>
  );
}
