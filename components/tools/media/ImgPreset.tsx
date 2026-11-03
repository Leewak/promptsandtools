"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { jpegUnder } from "@/lib/toolkit";
import { Slider, canvasToBlob, download, formatBytes, loadImage, useBusy } from "./shared";

const PRESETS: Record<string, { label: string; sizes: { name: string; w: number; h: number }[]; maxMb?: number; tip: string }> = {
  instagram: { label: "Instagram", sizes: [{ name: "Square post", w: 1080, h: 1080 }, { name: "Portrait post", w: 1080, h: 1350 }, { name: "Landscape post", w: 1080, h: 566 }, { name: "Story / Reel", w: 1080, h: 1920 }], tip: "Portrait 1080×1350 takes the most room in the feed." },
  youtube: { label: "YouTube thumbnail", sizes: [{ name: "Thumbnail", w: 1280, h: 720 }], maxMb: 2, tip: "YouTube accepts thumbnails up to 2 MB, so the file is compressed to fit." },
  linkedin: { label: "LinkedIn", sizes: [{ name: "Profile banner", w: 1584, h: 396 }, { name: "Company page cover", w: 1128, h: 191 }, { name: "Post image", w: 1200, h: 627 }], tip: "Keep faces and text away from the left edge on a profile banner, where your profile photo overlaps." },
};

export default function ImgPreset({ preset = "instagram" }: { preset?: string }) {
  const P = PRESETS[preset] ?? PRESETS.instagram;
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [si, setSi] = useState(0);
  const [fit, setFit] = useState<"Fill (crop)" | "Fit (padding)">("Fill (crop)");
  const [fx, setFx] = useState(50);
  const [fy, setFy] = useState(50);
  const [bg, setBg] = useState("#ffffff");
  const [saved, setSaved] = useState<Blob | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const { error, wrap } = useBusy();
  const sz = P.sizes[si];

  useEffect(() => {
    if (!img || !cv.current) return;
    const c = cv.current; c.width = sz.w; c.height = sz.h;
    const ctx = c.getContext("2d")!; ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = bg; ctx.fillRect(0, 0, sz.w, sz.h);
    const W = img.naturalWidth, H = img.naturalHeight;
    if (fit === "Fill (crop)") {
      const k = Math.max(sz.w / W, sz.h / H), sw = sz.w / k, sh = sz.h / k;
      ctx.drawImage(img, (W - sw) * (fx / 100), (H - sh) * (fy / 100), sw, sh, 0, 0, sz.w, sz.h);
    } else {
      const k = Math.min(sz.w / W, sz.h / H);
      ctx.drawImage(img, (sz.w - W * k) / 2, (sz.h - H * k) / 2, W * k, H * k);
    }
    setSaved(null);
  }, [img, sz, fit, fx, fy, bg]);

  const open = (f: File[]) => wrap(async () => { const i = await loadImage(f[0]); setFile(f[0]); setImg(i); });
  const save = () => wrap(async () => {
    const c = cv.current!;
    const b = P.maxMb ? (await jpegUnder(c, P.maxMb * 1024 * 1024 * 0.95)).blob : await canvasToBlob(c, "image/jpeg", 0.92);
    setSaved(b); download(b, `${preset}-${sz.w}x${sz.h}.jpg`);
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label={`Drop an image to resize for ${P.label}`} onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && file && (
          <>
            {P.sizes.length > 1 && <Segmented options={P.sizes.map((_, i) => i)} value={si} onChange={setSi} format={(i) => `${P.sizes[i].name} ${P.sizes[i].w}×${P.sizes[i].h}`} />}
            <div className="flex flex-wrap gap-5 items-end">
              <Segmented options={["Fill (crop)", "Fit (padding)"] as const} value={fit} onChange={setFit} />
              {fit === "Fill (crop)" ? (
                <>
                  <Slider label="Shift left / right" value={fx} min={0} max={100} onChange={setFx} suffix="%" />
                  <Slider label="Shift up / down" value={fy} min={0} max={100} onChange={setFy} suffix="%" />
                </>
              ) : (
                <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>Padding colour<input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-16 rounded" /></label>
              )}
            </div>
            <canvas ref={cv} data-testid="preset-canvas" className="max-w-full self-start rounded-lg" style={{ maxHeight: 460, width: "auto", border: "1px solid #23264A" }} />
            <div className="flex flex-wrap gap-3 items-center">
              <Button onClick={save}>Download JPG {sz.w}×{sz.h}</Button>
              {saved && <Note tone="ok">Saved ({formatBytes(saved.size)})</Note>}
            </div>
            <Note>{P.tip}</Note>
          </>
        )}
      </div>
    </Panel>
  );
}
