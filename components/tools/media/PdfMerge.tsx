"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel } from "../ui";
import { download, formatBytes, loadPdfLib, pdfBlob, useBusy } from "./shared";

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [done, setDone] = useState<Blob | null>(null);
  const { busy, error, wrap } = useBusy();

  function move(i: number, d: number) {
    const f = [...files], j = i + d; if (j < 0 || j >= f.length) return;
    [f[i], f[j]] = [f[j], f[i]]; setFiles(f); setDone(null);
  }

  const run = () => wrap(async () => {
    setDone(null);
    const { PDFDocument } = await import("pdf-lib");
    const out = await PDFDocument.create();
    for (const f of files) {
      const src = await loadPdfLib(f).catch((e) => { throw new Error(`${f.name}: ${e.message}`); });
      (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
    }
    setDone(pdfBlob(await out.save()));
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop button="Choose PDFs" accept="application/pdf,.pdf" multiple label="Drop two or more PDFs here" onFiles={(f) => { setFiles([...files, ...f.filter((x) => /pdf$/i.test(x.type) || /\.pdf$/i.test(x.name))]); setDone(null); }} />
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
        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={files.length < 2 || busy}>{busy ? "Merging…" : "Merge PDFs"}</Button>
          {done && <Button secondary onClick={() => download(done, "merged.pdf")}>Download merged.pdf ({formatBytes(done.size)})</Button>}
        </div>
        {files.length === 1 && <Note>Add at least one more PDF to merge.</Note>}
        {error && <Note tone="error">{error}</Note>}
        {done && <Note tone="ok">Merged {files.length} files. Pages keep their original text and quality.</Note>}
      </div>
    </Panel>
  );
}
