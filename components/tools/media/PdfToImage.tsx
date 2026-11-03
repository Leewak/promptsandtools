"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { baseName, blobBytes, canvasToBlob, download, formatBytes, makeZip, openPdfjs, renderPageCanvas, useBusy } from "./shared";

interface Img { name: string; blob: Blob; url: string }

export default function PdfToImage({ format = "jpg" }: { format?: string }) {
  const fmt = format === "png" ? "png" : "jpg";
  const [res, setRes] = useState<"Standard" | "High" | "Max">("High");
  const [file, setFile] = useState<File | null>(null);
  const [imgs, setImgs] = useState<Img[]>([]);
  const [progress, setProgress] = useState("");
  const { busy, error, wrap } = useBusy();
  const scale = res === "Standard" ? 1.33 : res === "High" ? 2 : 3;

  const run = (f: File) => wrap(async () => {
    setFile(f); setImgs([]);
    const doc = await openPdfjs(f);
    const out: Img[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      setProgress(`Page ${i} of ${doc.numPages}`);
      const canvas = await renderPageCanvas(doc, i, scale);
      const blob = await canvasToBlob(canvas, fmt === "png" ? "image/png" : "image/jpeg", 0.92);
      out.push({ name: `${baseName(f.name)}-page-${i}.${fmt}`, blob, url: URL.createObjectURL(blob) });
    }
    setImgs(out); setProgress("");
  });

  const zip = async () => download(makeZip(await Promise.all(imgs.map(async (i) => ({ name: i.name, data: await blobBytes(i.blob) })))), `${file ? baseName(file.name) : "pdf"}-${fmt}.zip`);

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2"><span className="text-sm" style={{ color: "#C9CCE8" }}>Quality</span><Segmented options={["Standard", "High", "Max"] as const} value={res} onChange={setRes} /></div>
        <Drop accept="application/pdf,.pdf" label="Drop a PDF here" onFiles={(f) => run(f[0])} />
        {busy && <Note>Converting… {progress}</Note>}
        {error && <Note tone="error">{error}</Note>}
        {imgs.length > 0 && (
          <>
            <div className="flex gap-3 flex-wrap items-center">
              {imgs.length > 1 && <Button onClick={zip}>Download all {imgs.length} images (ZIP)</Button>}
              <Note tone="ok">{imgs.length} page{imgs.length === 1 ? "" : "s"} converted.</Note>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imgs.map((i) => (
                <div key={i.name} className="flex flex-col gap-2 items-center rounded-lg p-2" style={{ background: "#0C0D22", border: "1px solid #1F2244" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.url} alt={i.name} className="max-h-48 object-contain" />
                  <button type="button" onClick={() => download(i.blob, i.name)} className="text-sm" style={{ color: "#60A5FA" }}>Download ({formatBytes(i.blob.size)})</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
