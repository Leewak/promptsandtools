"use client";

import { useState } from "react";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "../ui";
import { Slider, baseName, download, formatBytes, loadPdfLib, pdfBlob, useBusy } from "./shared";

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [size, setSize] = useState(64);
  const [opacity, setOpacity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [color, setColor] = useState("#888888");
  const [result, setResult] = useState<Blob | null>(null);
  const { busy, error, wrap } = useBusy();

  const run = () => wrap(async () => {
    if (!file) return;
    setResult(null);
    const { StandardFonts, rgb, degrees } = await import("pdf-lib");
    const doc = await loadPdfLib(file);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    // the standard fonts only cover Latin characters
    const clean = text.replace(/[^\x20-\x7E\xA0-\xFF]/g, "").trim();
    if (!clean) throw new Error("Use letters, numbers or common symbols. Characters outside Latin-1 (for example Arabic or Chinese) are not supported in the watermark.");
    const hex = color.replace("#", ""), c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const w = font.widthOfTextAtSize(clean, size), h = font.heightAtSize(size) * 0.7, a = (angle * Math.PI) / 180;
    for (const pg of doc.getPages()) {
      const { width, height } = pg.getSize();
      // rotate around the text centre so it stays centred on the page
      const x = width / 2 - (Math.cos(a) * w - Math.sin(a) * h) / 2, y = height / 2 - (Math.sin(a) * w + Math.cos(a) * h) / 2;
      pg.drawText(clean, { x, y, size, font, color: rgb(c[0], c[1], c[2]), opacity: opacity / 100, rotate: degrees(angle) });
    }
    setResult(pdfBlob(await doc.save()));
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="application/pdf,.pdf" label="Drop a PDF here" onFiles={(f) => { setFile(f[0]); setResult(null); }} />
        {file && (
          <>
            <Note>{file.name}</Note>
            <div className="flex flex-wrap gap-5 items-end">
              <div className="min-w-[220px] flex-1"><Field label="Watermark text"><input value={text} onChange={(e) => setText(e.target.value)} maxLength={60} className={inputCls} style={inputStyle} /></Field></div>
              <Field label="Colour"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 rounded" /></Field>
            </div>
            <div className="flex flex-wrap gap-5">
              <Slider label="Size" value={size} min={16} max={160} onChange={setSize} suffix=" pt" />
              <Slider label="Opacity" value={opacity} min={5} max={100} onChange={setOpacity} suffix="%" />
              <Slider label="Angle" value={angle} min={0} max={90} onChange={setAngle} suffix="°" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={run} disabled={busy || !text.trim()}>{busy ? "Adding watermark…" : "Add watermark"}</Button>
              {result && <Button secondary onClick={() => download(result, `${baseName(file.name)}-watermarked.pdf`)}>Download PDF ({formatBytes(result.size)})</Button>}
            </div>
            <Note>The watermark is drawn on top of every page. Anyone with a PDF editor could remove it, so don&apos;t rely on it as security.</Note>
          </>
        )}
        {error && <Note tone="error">{error}</Note>}
      </div>
    </Panel>
  );
}
