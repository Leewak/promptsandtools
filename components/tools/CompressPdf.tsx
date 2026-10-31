"use client";

import { useState } from "react";
import { baseName, canvasToBlob, download, formatBytes } from "@/lib/toolkit";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "./ui";

const PRESETS = [100, 200, 300, 500, 1024];

// Renders each page to an image and rebuilds the PDF, stepping quality and resolution down until it fits the target.
export default function CompressPdf({ defaultKb = 200 }: { defaultKb?: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [kb, setKb] = useState(defaultKb);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ blob: Blob; fits: boolean } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setResult(null);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const { PDFDocument } = await import("pdf-lib");
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const target = kb * 1024;
      const attempts: [number, number][] = [[1.6, 0.8], [1.4, 0.65], [1.2, 0.55], [1.0, 0.45], [0.85, 0.4], [0.7, 0.35], [0.6, 0.3], [0.5, 0.25], [0.42, 0.2]];
      let best: Blob | null = null;
      for (const [scale, q] of attempts) {
        setStatus(`Trying resolution ${Math.round(scale * 72)} dpi, quality ${Math.round(q * 100)}%…`);
        const out = await PDFDocument.create();
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const jpg = await out.embedJpg(await (await canvasToBlob(canvas, "image/jpeg", q)).arrayBuffer());
          const base = page.getViewport({ scale: 1 });
          out.addPage([base.width, base.height]).drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
        }
        const blob = new Blob([(await out.save()) as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
        best = blob;
        if (blob.size <= target) break;
      }
      setResult({ blob: best!, fits: best!.size <= target });
      setStatus("");
    } catch (e) {
      setError(/password/i.test(String(e)) ? "This PDF is password-protected. Remove the password first." : "This PDF could not be processed.");
    }
    setBusy(false);
  }

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="application/pdf" label={file ? `Selected: ${file.name} (${formatBytes(file.size)})` : "Choose a PDF"} onFiles={(f) => { setFile(f[0] ?? null); setResult(null); }} />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} type="button" onClick={() => setKb(p)} className="px-3 py-1.5 rounded-lg text-sm"
              style={{ border: "1px solid #2A3366", background: kb === p ? "#3B82F6" : "transparent", color: kb === p ? "#fff" : "#C7D2FE" }}>
              {p >= 1024 ? "1 MB" : `${p} KB`}
            </button>
          ))}
        </div>
        <div className="max-w-xs"><Field label="Target size (KB)"><input type="number" min={20} value={kb} onChange={(e) => setKb(Number(e.target.value) || 1)} className={inputCls} style={inputStyle} /></Field></div>
        <div><Button onClick={run} disabled={!file || busy}>{busy ? "Compressing…" : `Compress to under ${kb} KB`}</Button></div>
        {status && <Note>{status}</Note>}
        {error && <Note tone="error">{error}</Note>}
        {result && (
          <div className="flex flex-col gap-3">
            <Note tone={result.fits ? "ok" : "error"}>
              {result.fits ? `Done: ${formatBytes(result.blob.size)}` : `Smallest possible: ${formatBytes(result.blob.size)}. This file has too many pages for ${kb} KB while staying readable; try a higher target or split it.`}
            </Note>
            <div><Button onClick={() => download(result.blob, `${baseName(file!.name)}-compressed.pdf`)}>Download PDF</Button></div>
            <Note>Pages are converted to images to reach the size, so text in the new PDF can&apos;t be selected.</Note>
          </div>
        )}
      </div>
    </Panel>
  );
}
