"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel } from "../ui";
import { baseName, blobBytes, canvasToBlob, download, drawToCanvas, extFor, formatBytes, loadImage, makeZip, useBusy } from "./shared";

interface Out { name: string; blob: Blob; before: string; size: number }

/** Reports what a JPEG's EXIF block contains, so people can see what they are removing. */
async function scanExif(f: File): Promise<string> {
  if (f.type !== "image/jpeg") return f.type === "image/png" || f.type === "image/webp" ? "May contain text/XMP metadata" : "Unknown";
  const b = new DataView(await f.arrayBuffer());
  if (b.getUint16(0) !== 0xffd8) return "Unknown";
  let o = 2;
  while (o + 4 < b.byteLength) {
    const marker = b.getUint16(o), len = b.getUint16(o + 2);
    if (marker === 0xffe1 && b.getUint32(o + 4) === 0x45786966) {
      const t = o + 10, le = b.getUint16(t) === 0x4949, u16 = (p: number) => b.getUint16(p, le), u32 = (p: number) => b.getUint32(p, le);
      const ifd = t + u32(t + 4), n = u16(ifd), tags = new Set<number>();
      for (let i = 0; i < n; i++) tags.add(u16(ifd + 2 + i * 12));
      const parts = ["EXIF found"];
      if (tags.has(0x8825)) parts.push("GPS location");
      if (tags.has(0x010f) || tags.has(0x0110)) parts.push("camera/phone model");
      if (tags.has(0x0132) || tags.has(0x8769)) parts.push("date/time");
      return parts.join(", ");
    }
    if (marker === 0xffda || (marker & 0xff00) !== 0xff00) break;
    o += 2 + len;
  }
  return "No EXIF block found";
}

export default function ExifRemove() {
  const [outs, setOuts] = useState<Out[]>([]);
  const { busy, error, wrap } = useBusy();

  const run = (files: File[]) => wrap(async () => {
    setOuts([]);
    const res: Out[] = [];
    for (const f of files) {
      const before = await scanExif(f).catch(() => "Could not scan");
      const img = await loadImage(f);
      const type = f.type === "image/png" ? "image/png" : f.type === "image/webp" ? "image/webp" : "image/jpeg";
      // redrawing on a canvas keeps only pixels: EXIF, GPS, camera and XMP data do not carry over
      const blob = await canvasToBlob(drawToCanvas(img, img.naturalWidth, img.naturalHeight, type === "image/jpeg" ? "#fff" : "rgba(0,0,0,0)"), type, 0.95);
      res.push({ name: `${baseName(f.name)}-clean.${extFor(type.split("/")[1])}`, blob, before, size: f.size });
    }
    setOuts(res);
  });

  const zip = async () => download(makeZip(await Promise.all(outs.map(async (o) => ({ name: o.name, data: await blobBytes(o.blob) })))), "photos-clean.zip");

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" multiple label="Drop photos here (JPG, PNG, WebP)" button="Choose photos" onFiles={run} />
        {busy && <Note>Cleaning…</Note>}
        {error && <Note tone="error">{error}</Note>}
        {outs.length > 0 && (
          <div className="flex flex-col gap-3">
            {outs.length > 1 && <div><Button onClick={zip}>Download all {outs.length} as ZIP</Button></div>}
            <ul className="flex flex-col gap-2">
              {outs.map((o) => (
                <li key={o.name} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm" style={{ background: "#0C0D22", border: "1px solid #1F2244" }}>
                  <span className="flex flex-col min-w-0">
                    <span className="text-[#E8EAF6] truncate">{o.name} <span style={{ color: "#9CA1C9" }}>({formatBytes(o.size)} → {formatBytes(o.blob.size)})</span></span>
                    <span style={{ color: "#FBBF24" }} data-testid="exif-before">Before: {o.before}</span>
                  </span>
                  <button type="button" onClick={() => download(o.blob, o.name)} style={{ color: "#60A5FA" }}>Download</button>
                </li>
              ))}
            </ul>
            <Note tone="ok">Metadata removed. The photos were re-saved at high quality, so the file size may change slightly.</Note>
          </div>
        )}
      </div>
    </Panel>
  );
}
