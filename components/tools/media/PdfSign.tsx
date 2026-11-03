"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { Slider, baseName, download, formatBytes, loadPdfLib, openPdfjs, pdfBlob, renderPageCanvas, useBusy } from "./shared";

type Apply = "This page" | "All pages";

export default function PdfSign() {
  const pad = useRef<HTMLCanvasElement>(null);
  const prev = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [inked, setInked] = useState(false);
  const [color, setColor] = useState("#0b2a6f");
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<Awaited<ReturnType<typeof openPdfjs>> | null>(null);
  const [page, setPage] = useState(1);
  const [pos, setPos] = useState({ x: 0.7, y: 0.85 }); // centre of signature, fractions of the page
  const [width, setWidth] = useState(28); // % of page width
  const [apply, setApply] = useState<Apply>("This page");
  const [result, setResult] = useState<Blob | null>(null);
  const [sigUrl, setSigUrl] = useState("");
  const [ratio, setRatio] = useState(0.3);
  const { busy, error, wrap } = useBusy();

  useEffect(() => { const c = pad.current!; const x = c.getContext("2d")!; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round"; }, []);
  useEffect(() => { const c = pad.current!; c.getContext("2d")!.strokeStyle = color; }, [color]);
  useEffect(() => {
    if (!doc || !prev.current) return;
    (async () => {
      const src = await renderPageCanvas(doc, page, 1);
      const c = prev.current!; c.width = src.width; c.height = src.height;
      c.getContext("2d")!.drawImage(src, 0, 0);
    })();
  }, [doc, page]);

  const pt = (e: React.PointerEvent) => { const c = pad.current!, r = c.getBoundingClientRect(); return [((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height]; };
  const down = (e: React.PointerEvent) => { drawing.current = true; pad.current!.setPointerCapture(e.pointerId); const [x, y] = pt(e); const ctx = pad.current!.getContext("2d")!; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.01, y); ctx.stroke(); setInked(true); setResult(null); };
  const move = (e: React.PointerEvent) => { if (!drawing.current) return; const [x, y] = pt(e); const ctx = pad.current!.getContext("2d")!; ctx.lineTo(x, y); ctx.stroke(); };
  const up = () => { drawing.current = false; refreshSig(); };
  const clear = () => { const c = pad.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setInked(false); setSigUrl(""); setResult(null); };

  function refreshSig() {
    // crop the signature to the inked area so size and position are predictable
    const c = pad.current!, d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0) { setSigUrl(""); return; }
    const o = document.createElement("canvas"); o.width = x1 - x0 + 8; o.height = y1 - y0 + 8;
    o.getContext("2d")!.drawImage(c, x0 - 4, y0 - 4, o.width, o.height, 0, 0, o.width, o.height);
    setSigUrl(o.toDataURL("image/png")); setRatio(o.height / o.width);
  }

  const open = (f: File[]) => wrap(async () => { setFile(f[0]); setResult(null); await loadPdfLib(f[0]); setDoc(await openPdfjs(f[0])); setPage(1); });

  const place = (e: React.MouseEvent) => { const r = prev.current!.getBoundingClientRect(); setPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }); setResult(null); };

  const run = () => wrap(async () => {
    if (!file || !sigUrl) return;
    const pdf = await loadPdfLib(file);
    const png = await pdf.embedPng(await (await fetch(sigUrl)).arrayBuffer());
    const targets = apply === "All pages" ? pdf.getPages() : [pdf.getPage(page - 1)];
    for (const pg of targets) {
      const { width: pw, height: ph } = pg.getSize();
      const w = (pw * width) / 100, h = w * (png.height / png.width);
      pg.drawImage(png, { x: pos.x * pw - w / 2, y: ph - pos.y * ph - h / 2, width: w, height: h });
    }
    setResult(pdfBlob(await pdf.save()));
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm" style={{ color: "#C9CCE8" }}>1. Draw your signature with a mouse, finger or stylus</p>
          <canvas ref={pad} width={700} height={220} data-testid="sig-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className="w-full rounded-lg touch-none" style={{ background: "#fff", border: "1px solid #2A2E55", cursor: "crosshair", aspectRatio: "700/220" }} />
          <div className="flex gap-3 items-center flex-wrap">
            <Button secondary onClick={clear}>Clear</Button>
            <label className="flex items-center gap-2 text-sm" style={{ color: "#C9CCE8" }}>Ink <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
          </div>
        </div>
        <p className="text-sm" style={{ color: "#C9CCE8" }}>2. Add the PDF to sign</p>
        <Drop accept="application/pdf,.pdf" label="Drop a PDF here" onFiles={open} />
        {doc && (
          <>
            <div className="flex items-center gap-3 flex-wrap text-sm" style={{ color: "#C9CCE8" }}>
              <Button secondary disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
              <span>Page {page} of {doc.numPages}</span>
              <Button secondary disabled={page >= doc.numPages} onClick={() => setPage(page + 1)}>→</Button>
            </div>
            <p className="text-sm" style={{ color: "#C9CCE8" }}>3. Click on the page where the signature should go</p>
            <div className="relative inline-block max-w-full self-start" style={{ border: "1px solid #2A2E55" }}>
              <canvas ref={prev} data-testid="page-preview" onClick={place} className="max-w-full h-auto block cursor-crosshair" />
              {sigUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sigUrl} alt="Signature position" className="absolute pointer-events-none" style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, width: `${width}%`, transform: "translate(-50%,-50%)", aspectRatio: `1/${ratio}` }} />
              )}
            </div>
            <div className="flex flex-wrap gap-5 items-end">
              <Slider label="Signature width" value={width} min={8} max={60} onChange={(v) => { setWidth(v); setResult(null); }} suffix="% of page" />
              <Segmented options={["This page", "All pages"] as Apply[]} value={apply} onChange={(a) => { setApply(a); setResult(null); }} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={run} disabled={busy || !inked || !sigUrl}>{busy ? "Signing…" : "Sign PDF"}</Button>
              {result && file && <Button secondary onClick={() => download(result, `${baseName(file.name)}-signed.pdf`)}>Download signed PDF ({formatBytes(result.size)})</Button>}
            </div>
            {!inked && <Note>Draw your signature first.</Note>}
          </>
        )}
        {error && <Note tone="error">{error}</Note>}
        <Note>This adds an image of your handwritten signature. It is not a digital certificate signature, so it has no cryptographic proof of who signed.</Note>
      </div>
    </Panel>
  );
}
