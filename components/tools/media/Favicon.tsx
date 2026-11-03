"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel } from "../ui";
import { blobBytes, canvasToBlob, download, loadImage, makeZip, useBusy } from "./shared";

const SIZES = [16, 32, 48, 64, 180, 192, 512];
interface Out { size: number; blob: Blob; url: string }

/** ICO container that embeds PNG images (supported by every current browser). */
function makeIco(items: { size: number; data: Uint8Array }[]) {
  const head = new DataView(new ArrayBuffer(6 + 16 * items.length));
  head.setUint16(2, 1, true); head.setUint16(4, items.length, true);
  let off = 6 + 16 * items.length;
  items.forEach((it, i) => {
    const o = 6 + 16 * i;
    head.setUint8(o, it.size >= 256 ? 0 : it.size); head.setUint8(o + 1, it.size >= 256 ? 0 : it.size);
    head.setUint16(o + 4, 1, true); head.setUint16(o + 6, 32, true); head.setUint32(o + 8, it.data.length, true); head.setUint32(o + 12, off, true);
    off += it.data.length;
  });
  return new Blob([head.buffer, ...items.map((i) => i.data as Uint8Array<ArrayBuffer>)], { type: "image/x-icon" });
}

export default function Favicon() {
  const [outs, setOuts] = useState<Out[]>([]);
  const [ico, setIco] = useState<Blob | null>(null);
  const { busy, error, wrap } = useBusy();

  const run = (f: File[]) => wrap(async () => {
    setOuts([]); setIco(null);
    const img = await loadImage(f[0]);
    const s = Math.min(img.naturalWidth, img.naturalHeight), sx = (img.naturalWidth - s) / 2, sy = (img.naturalHeight - s) / 2;
    const res: Out[] = [];
    for (const size of SIZES) {
      const c = document.createElement("canvas"); c.width = c.height = size;
      const ctx = c.getContext("2d")!; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
      const blob = await canvasToBlob(c, "image/png");
      res.push({ size, blob, url: URL.createObjectURL(blob) });
    }
    setOuts(res);
    setIco(makeIco(await Promise.all(res.filter((r) => r.size <= 48).map(async (r) => ({ size: r.size, data: await blobBytes(r.blob) })))));
  });

  const names = (s: number) => (s === 180 ? "apple-touch-icon.png" : s === 192 ? "android-chrome-192x192.png" : s === 512 ? "android-chrome-512x512.png" : `favicon-${s}x${s}.png`);
  const zip = async () => {
    const files = await Promise.all(outs.map(async (o) => ({ name: names(o.size), data: await blobBytes(o.blob) })));
    if (ico) files.push({ name: "favicon.ico", data: await blobBytes(ico) });
    download(makeZip(files), "favicons.zip");
  };
  const html = `<link rel="icon" href="/favicon.ico" sizes="48x48">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop a logo or image (square works best)" onFiles={run} />
        {busy && <Note>Generating…</Note>}
        {error && <Note tone="error">{error}</Note>}
        {outs.length > 0 && ico && (
          <>
            <div className="flex flex-wrap gap-3 items-center">
              <Button onClick={zip}>Download all (ZIP with favicon.ico)</Button>
              <Button secondary onClick={() => download(ico, "favicon.ico")}>favicon.ico only</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              {outs.map((o) => (
                <div key={o.size} className="flex flex-col items-center gap-2 text-xs" style={{ color: "#9CA1C9" }}>
                  <Checker2 url={o.url} size={Math.min(o.size, 96)} />
                  <button type="button" onClick={() => download(o.blob, names(o.size))} style={{ color: "#60A5FA" }}>{o.size}×{o.size}</button>
                </div>
              ))}
            </div>
            <Note>The image is cropped to a centred square. Add this to your page &lt;head&gt; after uploading the files to your site root:</Note>
            <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ background: "#0C0D22", border: "1px solid #2A2E55", color: "#C9CCE8", fontFamily: "var(--font-mono)" }}>{html}</pre>
          </>
        )}
      </div>
    </Panel>
  );
}

function Checker2({ url, size }: { url: string; size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" width={size} height={size} style={{ background: "repeating-conic-gradient(#ddd 0 25%, #fff 0 50%) 0 0/12px 12px", imageRendering: size < 40 ? "pixelated" : "auto" }} />;
}
