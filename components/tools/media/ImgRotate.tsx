"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { baseName, canvasToBlob, download, extFor, formatBytes, loadImage, mimeFor, useBusy } from "./shared";

export default function ImgRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [rot, setRot] = useState(0);
  const [fx, setFx] = useState(false);
  const [fy, setFy] = useState(false);
  const [fmt, setFmt] = useState("png");
  const [size, setSize] = useState<Blob | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const { error, wrap } = useBusy();

  useEffect(() => {
    if (!img || !cv.current) return;
    const swap = rot % 180 !== 0, c = cv.current, W = img.naturalWidth, H = img.naturalHeight;
    c.width = swap ? H : W; c.height = swap ? W : H;
    const ctx = c.getContext("2d")!;
    if (fmt === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.save(); ctx.translate(c.width / 2, c.height / 2); ctx.rotate((rot * Math.PI) / 180); ctx.scale(fx ? -1 : 1, fy ? -1 : 1);
    ctx.drawImage(img, -W / 2, -H / 2); ctx.restore();
    setSize(null);
  }, [img, rot, fx, fy, fmt]);

  const open = (f: File[]) => wrap(async () => { const i = await loadImage(f[0]); setFile(f[0]); setImg(i); setRot(0); setFx(false); setFy(false); setFmt(f[0].type === "image/png" ? "png" : "jpg"); });
  const save = async () => { if (!file) return; const b = await canvasToBlob(cv.current!, mimeFor(fmt), 0.95); setSize(b); download(b, `${baseName(file.name)}-rotated.${extFor(fmt)}`); };

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image to rotate or flip" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {img && file && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button secondary onClick={() => setRot((rot + 270) % 360)}>Rotate left ↺</Button>
              <Button secondary onClick={() => setRot((rot + 90) % 360)}>Rotate right ↻</Button>
              <Button secondary onClick={() => setRot((rot + 180) % 360)}>Rotate 180°</Button>
              <Button secondary onClick={() => setFx(!fx)}>Flip horizontal ⇋</Button>
              <Button secondary onClick={() => setFy(!fy)}>Flip vertical ⇅</Button>
              <Button secondary onClick={() => { setRot(0); setFx(false); setFy(false); }}>Reset</Button>
            </div>
            <canvas ref={cv} data-testid="rotate-canvas" className="max-w-full rounded-lg self-start" style={{ maxHeight: 420, width: "auto", border: "1px solid #23264A" }} />
            <div className="flex flex-wrap gap-3 items-center">
              <Segmented options={["png", "jpg", "webp"]} value={fmt} onChange={setFmt} format={(f) => f.toUpperCase()} />
              <Button onClick={save}>Download</Button>
              {size && <Note tone="ok">Saved ({formatBytes(size.size)})</Note>}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
