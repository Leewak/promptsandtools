"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel } from "../ui";
import { Slider, baseName, blobBytes, canvasToBlob, download, drawToCanvas, extFor, formatBytes, loadImage, makeZip, mimeFor, useBusy } from "./shared";

interface Out { name: string; blob: Blob; from: number; url: string }
const ACCEPT: Record<string, string> = { jpg: "image/jpeg,.jpg,.jpeg", png: "image/png,.png", webp: "image/webp,.webp" };

export default function ImgConvert({ from = "jpg", to = "png" }: { from?: string; to?: string }) {
  const [q, setQ] = useState(92);
  const [outs, setOuts] = useState<Out[]>([]);
  const { busy, error, wrap } = useBusy();

  const run = (files: File[]) => wrap(async () => {
    setOuts([]);
    const res: Out[] = [];
    for (const f of files) {
      const img = await loadImage(f);
      const c = drawToCanvas(img, img.naturalWidth, img.naturalHeight, to === "jpg" ? "#ffffff" : "rgba(0,0,0,0)");
      const blob = await canvasToBlob(c, mimeFor(to), q / 100);
      if (blob.type !== mimeFor(to)) throw new Error(`Your browser can't save ${to.toUpperCase()} files. Try a current version of Chrome, Edge, Firefox or Safari.`);
      res.push({ name: `${baseName(f.name)}.${extFor(to)}`, blob, from: f.size, url: URL.createObjectURL(blob) });
    }
    setOuts(res);
  });

  const zip = async () => download(makeZip(await Promise.all(outs.map(async (o) => ({ name: o.name, data: await blobBytes(o.blob) })))), `${from}-to-${to}.zip`);

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        {to !== "png" && <Slider label="Quality" value={q} min={40} max={100} onChange={setQ} suffix="%" />}
        <Drop accept={ACCEPT[from]} multiple label={`Drop ${from.toUpperCase()} images here`} button={`Choose ${from.toUpperCase()} files`} onFiles={run} />
        {busy && <Note>Converting…</Note>}
        {error && <Note tone="error">{error}</Note>}
        {outs.length > 0 && (
          <div className="flex flex-col gap-3">
            {outs.length > 1 && <div><Button onClick={zip}>Download all {outs.length} as ZIP</Button></div>}
            <ul className="flex flex-col gap-2">
              {outs.map((o) => (
                <li key={o.name} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm" style={{ background: "#0C0D22", border: "1px solid #1F2244" }}>
                  <span className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.url} alt="" className="h-10 w-10 object-cover rounded" />
                    <span className="text-[#E8EAF6] truncate">{o.name} <span style={{ color: "#9CA1C9" }}>({formatBytes(o.from)} → {formatBytes(o.blob.size)})</span></span>
                  </span>
                  <button type="button" onClick={() => download(o.blob, o.name)} style={{ color: "#60A5FA" }}>Download</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Panel>
  );
}
