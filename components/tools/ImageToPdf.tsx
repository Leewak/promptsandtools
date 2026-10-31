"use client";

import { useState } from "react";
import { canvasToBlob, download, drawToCanvas, formatBytes, loadImage } from "@/lib/toolkit";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "./ui";

const PAGES: Record<string, [number, number] | null> = { a4: [595.28, 841.89], letter: [612, 792], fit: null };

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [page, setPage] = useState("a4");
  const [margin, setMargin] = useState(20);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Blob | null>(null);

  function move(i: number, d: number) {
    const f = [...files]; const j = i + d; if (j < 0 || j >= f.length) return;
    [f[i], f[j]] = [f[j], f[i]]; setFiles(f); setDone(null);
  }

  async function run() {
    setBusy(true); setDone(null);
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    for (const f of files) {
      const img = await loadImage(f);
      const maxSide = 2400, s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const jpg = await pdf.embedJpg(await (await canvasToBlob(drawToCanvas(img, img.naturalWidth * s, img.naturalHeight * s), "image/jpeg", 0.85)).arrayBuffer());
      const size = PAGES[page];
      if (!size) { pdf.addPage([jpg.width, jpg.height]).drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height }); continue; }
      const landscape = jpg.width > jpg.height;
      const [pw, ph] = landscape ? [size[1], size[0]] : size;
      const r = Math.min((pw - 2 * margin) / jpg.width, (ph - 2 * margin) / jpg.height);
      const w = jpg.width * r, h = jpg.height * r;
      pdf.addPage([pw, ph]).drawImage(jpg, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
    }
    setDone(new Blob([(await pdf.save()) as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    setBusy(false);
  }

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop button="Choose images" accept="image/*" multiple label="Drop images here (JPG, PNG, WebP)" onFiles={(f) => { setFiles([...files, ...f]); setDone(null); }} />
        {files.length > 0 && (
          <ol className="flex flex-col gap-2">
            {files.map((f, i) => (
              <li key={i + f.name} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm" style={{ background: "#0C0D22", border: "1px solid #1F2244" }}>
                <span className="text-[#E8EAF6] truncate">{i + 1}. {f.name} <span style={{ color: "#9CA1C9" }}>({formatBytes(f.size)})</span></span>
                <span className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => move(i, -1)} className="px-2" style={{ color: "#C9CCE8" }} aria-label="Move up">↑</button>
                  <button type="button" onClick={() => move(i, 1)} className="px-2" style={{ color: "#C9CCE8" }} aria-label="Move down">↓</button>
                  <button type="button" onClick={() => { setFiles(files.filter((_, j) => j !== i)); setDone(null); }} className="px-2" style={{ color: "#F87171" }} aria-label="Remove">✕</button>
                </span>
              </li>
            ))}
          </ol>
        )}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Field label="Page size">
            <select value={page} onChange={(e) => setPage(e.target.value)} className={inputCls} style={inputStyle}>
              <option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Same as image</option>
            </select>
          </Field>
          <Field label="Margin (pt)"><input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value) || 0)} className={inputCls} style={inputStyle} disabled={page === "fit"} /></Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={!files.length || busy}>{busy ? "Building PDF…" : "Create PDF"}</Button>
          {done && <Button secondary onClick={() => download(done, "images.pdf")}>Download PDF ({formatBytes(done.size)})</Button>}
        </div>
        {done && <Note>Too big for an upload form? Run it through the PDF compressor to hit a size limit.</Note>}
      </div>
    </Panel>
  );
}
