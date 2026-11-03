"use client";

import { useState } from "react";
import { Button, Drop, Field, Note, Panel, Segmented, inputCls, inputStyle } from "../ui";
import { baseName, blobBytes, download, formatBytes, loadPdfLib, makeZip, parseRanges, pdfBlob, useBusy } from "./shared";

type Mode = "Every page" | "Every N pages" | "Custom ranges";
interface Out { name: string; blob: Blob }

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [mode, setMode] = useState<Mode>("Every page");
  const [n, setN] = useState(2);
  const [ranges, setRanges] = useState("1-2, 3-");
  const [outs, setOuts] = useState<Out[]>([]);
  const { busy, error, setError, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => {
    setOuts([]); setFile(f[0]);
    setPages((await loadPdfLib(f[0])).getPageCount());
  });

  const run = () => wrap(async () => {
    if (!file) return;
    const src = await loadPdfLib(file);
    const { PDFDocument } = await import("pdf-lib");
    let groups: number[][] = [];
    if (mode === "Every page") groups = src.getPageIndices().map((i) => [i]);
    else if (mode === "Every N pages") { const k = Math.max(1, n); for (let i = 0; i < pages; i += k) groups.push(Array.from({ length: Math.min(k, pages - i) }, (_, j) => i + j)); }
    else {
      for (const part of ranges.split(",").map((s) => s.trim()).filter(Boolean)) {
        const r = parseRanges(part, pages);
        if (!r) { setError(`"${part}" is not a valid range for a ${pages}-page file. Use a format like 1-3, 5, 7-.`); return; }
        groups.push(r.map((x) => x - 1));
      }
    }
    const base = baseName(file.name), res: Out[] = [];
    for (let g = 0; g < groups.length; g++) {
      const out = await PDFDocument.create();
      (await out.copyPages(src, groups[g])).forEach((p) => out.addPage(p));
      const label = groups[g].length === 1 ? `page-${groups[g][0] + 1}` : `pages-${groups[g][0] + 1}-${groups[g][groups[g].length - 1] + 1}`;
      res.push({ name: `${base}-${label}.pdf`, blob: pdfBlob(await out.save()) });
    }
    setOuts(res);
  });

  const zipAll = async () => download(makeZip(await Promise.all(outs.map(async (o) => ({ name: o.name, data: await blobBytes(o.blob) })))), `${file ? baseName(file.name) : "split"}-split.zip`);

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="application/pdf,.pdf" label="Drop a PDF here" onFiles={open} />
        {file && pages > 0 && (
          <>
            <Note>{file.name}: {pages} page{pages === 1 ? "" : "s"}</Note>
            <Segmented options={["Every page", "Every N pages", "Custom ranges"] as Mode[]} value={mode} onChange={(m) => { setMode(m); setOuts([]); }} />
            {mode === "Every N pages" && <div className="max-w-[200px]"><Field label="Pages per file"><input type="number" min={1} value={n} onChange={(e) => setN(Number(e.target.value) || 1)} className={inputCls} style={inputStyle} /></Field></div>}
            {mode === "Custom ranges" && <div className="max-w-md"><Field label="Ranges, one file per range (e.g. 1-3, 4, 5-)"><input value={ranges} onChange={(e) => setRanges(e.target.value)} className={inputCls} style={inputStyle} /></Field></div>}
            <div className="flex gap-3"><Button onClick={run} disabled={busy}>{busy ? "Splitting…" : "Split PDF"}</Button></div>
          </>
        )}
        {error && <Note tone="error">{error}</Note>}
        {outs.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center flex-wrap"><Button onClick={zipAll}>Download all as ZIP ({outs.length} files)</Button></div>
            <ul className="flex flex-col gap-2">
              {outs.map((o) => (
                <li key={o.name} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm" style={{ background: "#0C0D22", border: "1px solid #1F2244" }}>
                  <span className="text-[#E8EAF6] truncate">{o.name} <span style={{ color: "#9CA1C9" }}>({formatBytes(o.blob.size)})</span></span>
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
