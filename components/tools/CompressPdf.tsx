"use client";

import { useState } from "react";
import { baseName, canvasToBlob, download, formatBytes } from "@/lib/toolkit";
import { Button, Drop, Note, Panel, Segmented, inputCls, inputStyle } from "./ui";

type Target = "100 KB" | "200 KB" | "500 KB" | "Custom";
const ATTEMPTS: [number, number][] = [[1.6, 0.8], [1.4, 0.65], [1.2, 0.55], [1.0, 0.45], [0.85, 0.4], [0.7, 0.35], [0.6, 0.3], [0.5, 0.25], [0.42, 0.2]];

// Renders each page to an image and rebuilds the PDF, stepping quality and resolution down until it fits the target.
export default function CompressPdf({ defaultKb = 200 }: { defaultKb?: number }) {
  const preset = (`${defaultKb} KB` as Target);
  const [target, setTarget] = useState<Target>(["100 KB", "200 KB", "500 KB"].includes(preset) ? preset : "Custom");
  const [custom, setCustom] = useState(defaultKb);
  const [file, setFile] = useState<File | null>(null);
  const [pass, setPass] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "failed">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const kb = target === "Custom" ? custom : parseInt(target);

  async function run(f: File) {
    setFile(f); setStatus("processing"); setError(""); setResult(null); setPass(0);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const { PDFDocument } = await import("pdf-lib");
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
      let best: Blob | null = null;
      for (let a = 0; a < ATTEMPTS.length; a++) {
        const [scale, q] = ATTEMPTS[a];
        setPass(a + 1);
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
          const p1 = page.getViewport({ scale: 1 });
          out.addPage([p1.width, p1.height]).drawImage(jpg, { x: 0, y: 0, width: p1.width, height: p1.height });
        }
        best = new Blob([(await out.save()) as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
        if (best.size <= kb * 1024) break;
      }
      setResult(best); setStatus(best && best.size <= kb * 1024 ? "done" : "failed");
    } catch (e) {
      setStatus("idle"); setFile(null);
      setError(/password/i.test(String(e)) ? "This PDF is password-protected. Remove the password first." : "This PDF could not be read.");
    }
  }

  const ratio = result ? Math.min(100, Math.round((result.size / (kb * 1024)) * 100)) : 0;
  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold" style={{ color: "#C9CCE8" }}>Target size</span>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented options={["100 KB", "200 KB", "500 KB", "Custom"] as Target[]} value={target} onChange={setTarget} />
            {target === "Custom" && (
              <label className="flex items-center gap-2 text-sm" style={{ color: "#9CA1C9" }}>
                <input type="number" min={20} value={custom} onChange={(e) => setCustom(Number(e.target.value) || 1)} className={`${inputCls} w-28`} style={inputStyle} /> KB
              </label>
            )}
          </div>
        </div>

        {status === "idle" && <Drop accept="application/pdf" label="Drop a PDF here" button="Choose PDF" onFiles={(f) => f[0] && run(f[0])} />}
        {error && <Note tone="error">{error}</Note>}

        {status === "processing" && (
          <div className="rounded-xl p-6 flex flex-col gap-3" style={{ background: "#0C0D22", border: "1px solid #23264A" }}>
            <span className="text-[15px]" style={{ color: "#C9CCE8" }}>Compressing… pass {pass}</span>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1A1D3B" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(pass / ATTEMPTS.length) * 100}%`, background: "linear-gradient(90deg,#3B82F6,#22D3EE)" }} />
            </div>
          </div>
        )}

        {(status === "done" || status === "failed") && result && file && (
          <div className="rounded-xl p-5 flex flex-col gap-4" style={{ border: `1px solid ${status === "done" ? "#1E4A3C" : "#4A2A2A"}`, background: status === "done" ? "rgba(52,211,153,0.05)" : "rgba(248,113,113,0.05)" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[17px] font-semibold break-all" style={{ color: "#E8EAF6" }}>{file.name}</p>
                <p className="text-sm mt-1" style={{ fontFamily: "var(--font-mono)", color: "#9CA1C9" }}>
                  {formatBytes(file.size)} → <b style={{ color: status === "done" ? "#34D399" : "#F87171" }}>{formatBytes(result.size)}</b>
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg" style={{ fontFamily: "var(--font-mono)", color: status === "done" ? "#34D399" : "#F87171", border: `1px solid ${status === "done" ? "#1E4A3C" : "#4A2A2A"}` }}>
                {status === "done" ? `UNDER ${kb} KB` : `SMALLEST: ${formatBytes(result.size)}`}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1A1D3B" }}>
              <div className="h-full rounded-full" style={{ width: `${ratio}%`, background: "linear-gradient(90deg,#3B82F6,#22D3EE)" }} />
            </div>
            {status === "failed" && <Note tone="error">This PDF can&apos;t get under {kb} KB and stay readable. Try a higher target, or split it into parts if the form accepts several files.</Note>}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => download(result, `${baseName(file.name)}-${kb}kb.pdf`)}>Download PDF</Button>
              <Button secondary onClick={() => { setStatus("idle"); setFile(null); setResult(null); }}>Compress another</Button>
            </div>
            <Note>Pages are converted to images to reach the size, so text in the new PDF can&apos;t be selected.</Note>
          </div>
        )}
      </div>
    </Panel>
  );
}
