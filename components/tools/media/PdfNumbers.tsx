"use client";

import { useState } from "react";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "../ui";
import { baseName, download, formatBytes, loadPdfLib, pdfBlob, useBusy } from "./shared";

export default function PdfNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pos, setPos] = useState("bottom-center");
  const [fmt, setFmt] = useState("n");
  const [start, setStart] = useState(1);
  const [size, setSize] = useState(11);
  const [skipFirst, setSkipFirst] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const { busy, error, wrap } = useBusy();

  const run = () => wrap(async () => {
    if (!file) return;
    setResult(null);
    const { StandardFonts, rgb } = await import("pdf-lib");
    const doc = await loadPdfLib(file);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages(), total = pages.length;
    pages.forEach((pg, i) => {
      if (skipFirst && i === 0) return;
      const num = start + i - (skipFirst ? 1 : 0);
      const text = fmt === "n" ? `${num}` : fmt === "page" ? `Page ${num}` : `Page ${num} of ${total + start - 1 - (skipFirst ? 1 : 0)}`;
      const { width, height } = pg.getSize();
      const w = font.widthOfTextAtSize(text, size), m = 28;
      const x = pos.endsWith("left") ? m : pos.endsWith("right") ? width - m - w : (width - w) / 2;
      const y = pos.startsWith("top") ? height - m - size * 0.7 : m - size * 0.3;
      pg.drawText(text, { x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
    });
    setResult(pdfBlob(await doc.save()));
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="application/pdf,.pdf" label="Drop a PDF here" onFiles={(f) => { setFile(f[0]); setResult(null); }} />
        {file && (
          <>
            <Note>{file.name}</Note>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Position">
                <select value={pos} onChange={(e) => setPos(e.target.value)} className={inputCls} style={inputStyle}>
                  {["bottom-center", "bottom-right", "bottom-left", "top-center", "top-right", "top-left"].map((p) => <option key={p} value={p}>{p.replace("-", " ")}</option>)}
                </select>
              </Field>
              <Field label="Format">
                <select value={fmt} onChange={(e) => setFmt(e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="n">1, 2, 3</option><option value="page">Page 1</option><option value="of">Page 1 of N</option>
                </select>
              </Field>
              <Field label="Start at"><input type="number" min={0} value={start} onChange={(e) => setStart(Number(e.target.value) || 0)} className={inputCls} style={inputStyle} /></Field>
              <Field label="Font size"><input type="number" min={6} max={36} value={size} onChange={(e) => setSize(Number(e.target.value) || 11)} className={inputCls} style={inputStyle} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={skipFirst} onChange={(e) => setSkipFirst(e.target.checked)} /> Don&apos;t number the first page (cover)</label>
            <div className="flex flex-wrap gap-3">
              <Button onClick={run} disabled={busy}>{busy ? "Adding numbers…" : "Add page numbers"}</Button>
              {result && <Button secondary onClick={() => download(result, `${baseName(file.name)}-numbered.pdf`)}>Download PDF ({formatBytes(result.size)})</Button>}
            </div>
          </>
        )}
        {error && <Note tone="error">{error}</Note>}
      </div>
    </Panel>
  );
}
