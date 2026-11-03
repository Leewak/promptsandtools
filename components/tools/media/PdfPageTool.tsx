"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel } from "../ui";
import { baseName, download, formatBytes, loadPdfLib, openPdfjs, pdfBlob, renderPageCanvas, useBusy } from "./shared";

type Mode = "extract" | "delete" | "rotate" | "reorder";
interface Pg { n: number; rot: number; thumb: string }

const COPY: Record<Mode, { drop: string; hint: string; action: string; file: string }> = {
  extract: { drop: "Drop a PDF here", hint: "Click the pages you want to keep. Only selected pages go into the new PDF.", action: "Extract selected pages", file: "extracted" },
  delete: { drop: "Drop a PDF here", hint: "Click the pages you want to remove. Everything else stays.", action: "Delete selected pages", file: "pages-removed" },
  rotate: { drop: "Drop a PDF here", hint: "Rotate single pages with the arrows under each page, or rotate every page at once.", action: "Save rotated PDF", file: "rotated" },
  reorder: { drop: "Drop a PDF here", hint: "Move pages left or right with the arrows under each page, then save.", action: "Save new order", file: "reordered" },
};

export default function PdfPageTool({ mode = "extract" }: { mode?: Mode }) {
  const c = COPY[mode];
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Pg[]>([]);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<Blob | null>(null);
  const [note, setNote] = useState("");
  const { busy, error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => {
    setFile(f[0]); setResult(null); setSel(new Set()); setPages([]); setNote("");
    await loadPdfLib(f[0]); // fail early on protected or broken files
    const doc = await openPdfjs(f[0]);
    const list: Pg[] = [];
    const limit = Math.min(doc.numPages, 300);
    for (let i = 1; i <= limit; i++) {
      const canvas = await renderPageCanvas(doc, i, 0.3);
      list.push({ n: i, rot: 0, thumb: canvas.toDataURL("image/jpeg", 0.6) });
      if (i % 5 === 0 || i === limit) setPages([...list]);
    }
    if (doc.numPages > limit) setNote(`Only the first ${limit} pages are shown, so the rest of this long file can't be edited here.`);
  });

  const toggle = (n: number) => { const s = new Set(sel); if (s.has(n)) s.delete(n); else s.add(n); setSel(s); setResult(null); };
  const move = (i: number, d: number) => { const p = [...pages], j = i + d; if (j < 0 || j >= p.length) return; [p[i], p[j]] = [p[j], p[i]]; setPages(p); setResult(null); };
  const spin = (i: number | "all", d: number) => { setPages(pages.map((p, k) => (i === "all" || i === k ? { ...p, rot: (p.rot + d + 360) % 360 } : p))); setResult(null); };

  const run = () => wrap(async () => {
    if (!file) return;
    const { PDFDocument, degrees } = await import("pdf-lib");
    const src = await loadPdfLib(file);
    let use = pages;
    if (mode === "extract") use = pages.filter((p) => sel.has(p.n));
    if (mode === "delete") use = pages.filter((p) => !sel.has(p.n));
    if (use.length === 0) throw new Error(mode === "extract" ? "Select at least one page to extract." : "That would remove every page. Keep at least one.");
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, use.map((p) => p.n - 1));
    copied.forEach((pg, i) => { if (use[i].rot) pg.setRotation(degrees((pg.getRotation().angle + use[i].rot) % 360)); out.addPage(pg); });
    // pages beyond the display limit are kept as-is for delete/rotate/reorder
    if (mode !== "extract" && src.getPageCount() > pages.length) {
      const rest = await out.copyPages(src, Array.from({ length: src.getPageCount() - pages.length }, (_, i) => pages.length + i));
      rest.forEach((pg) => out.addPage(pg));
    }
    setResult(pdfBlob(await out.save()));
  });

  const small = { color: "#C9CCE8", background: "#0C0D22", border: "1px solid #2A2E55" } as const;

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="application/pdf,.pdf" label={c.drop} onFiles={open} />
        {busy && !pages.length && <Note>Reading pages…</Note>}
        {pages.length > 0 && (
          <>
            <Note>{c.hint} {file?.name}: {pages.length} page{pages.length === 1 ? "" : "s"}.</Note>
            {mode === "rotate" && (
              <div className="flex gap-2 flex-wrap">
                <Button secondary onClick={() => spin("all", -90)}>Rotate all left ↺</Button>
                <Button secondary onClick={() => spin("all", 90)}>Rotate all right ↻</Button>
                <Button secondary onClick={() => spin("all", 180)}>Rotate all 180°</Button>
              </div>
            )}
            {(mode === "extract" || mode === "delete") && (
              <div className="flex gap-2 flex-wrap">
                <Button secondary onClick={() => setSel(new Set(pages.map((p) => p.n)))}>Select all</Button>
                <Button secondary onClick={() => setSel(new Set())}>Clear</Button>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-testid="pages">
              {pages.map((p, i) => {
                const on = sel.has(p.n) && (mode === "extract" || mode === "delete");
                const ring = on ? (mode === "delete" ? "#F87171" : "#34D399") : "#23264A";
                return (
                  <div key={p.n} className="flex flex-col gap-2 items-center">
                    <button type="button" data-page={p.n} onClick={() => (mode === "extract" || mode === "delete") && toggle(p.n)} className="relative w-full aspect-[3/4] flex items-center justify-center overflow-hidden rounded-lg" style={{ background: "#0C0D22", border: `2px solid ${ring}`, opacity: on && mode === "delete" ? 0.45 : 1 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.thumb} alt={`Page ${p.n}`} className="max-w-full max-h-full transition-transform" style={{ transform: `rotate(${p.rot}deg)` }} />
                      {on && <span className="absolute top-1 right-1 text-xs px-1.5 rounded" style={{ background: ring, color: "#000" }}>{mode === "delete" ? "remove" : "keep"}</span>}
                    </button>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "#9CA1C9" }}>
                      {mode === "reorder" && <button type="button" aria-label={`Move page ${p.n} left`} onClick={() => move(i, -1)} className="px-2 py-1 rounded" style={small}>←</button>}
                      {mode === "rotate" && <button type="button" aria-label={`Rotate page ${p.n} left`} onClick={() => spin(i, -90)} className="px-2 py-1 rounded" style={small}>↺</button>}
                      <span>Page {p.n}</span>
                      {mode === "reorder" && <button type="button" aria-label={`Move page ${p.n} right`} onClick={() => move(i, 1)} className="px-2 py-1 rounded" style={small}>→</button>}
                      {mode === "rotate" && <button type="button" aria-label={`Rotate page ${p.n} right`} onClick={() => spin(i, 90)} className="px-2 py-1 rounded" style={small}>↻</button>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={run} disabled={busy}>{busy ? "Working…" : c.action}</Button>
              {result && file && <Button secondary onClick={() => download(result, `${baseName(file.name)}-${c.file}.pdf`)}>Download PDF ({formatBytes(result.size)})</Button>}
            </div>
            {note && <Note>{note}</Note>}
          </>
        )}
        {error && <Note tone="error">{error}</Note>}
      </div>
    </Panel>
  );
}
