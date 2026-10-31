"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { download } from "@/lib/toolkit";
import { Button, Field, Panel, inputCls, inputStyle } from "./ui";

export default function QrGenerator() {
  const [text, setText] = useState("https://promptsandtools.online");
  const [size, setSize] = useState(512);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!text) return;
    QRCode.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: level, color: { dark: fg, light: bg } }).then(setUrl).catch(() => setUrl(""));
  }, [text, size, fg, bg, level]);

  const shown = text ? url : "";

  async function svg() {
    const s = await QRCode.toString(text, { type: "svg", margin: 2, errorCorrectionLevel: level, color: { dark: fg, light: bg } });
    download(new Blob([s], { type: "image/svg+xml" }), "qr-code.svg");
  }

  return (
    <Panel>
      <div className="grid md:grid-cols-[1fr_auto] gap-6">
        <div className="flex flex-col gap-4">
          <Field label="Link or text"><textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} className={inputCls} style={inputStyle} /></Field>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Size (px)"><input type="number" min={128} max={2048} value={size} onChange={(e) => setSize(Math.min(2048, Number(e.target.value) || 128))} className={inputCls} style={inputStyle} /></Field>
            <Field label="Error correction">
              <select value={level} onChange={(e) => setLevel(e.target.value as "L")} className={inputCls} style={inputStyle}>
                <option value="L">Low</option><option value="M">Medium</option><option value="Q">High</option><option value="H">Highest</option>
              </select>
            </Field>
            <Field label="Colour"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-full rounded" /></Field>
            <Field label="Background"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded" /></Field>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={!shown} onClick={async () => download(await (await fetch(shown)).blob(), "qr-code.png")}>Download PNG</Button>
            <Button secondary disabled={!shown} onClick={svg}>Download SVG</Button>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {shown && <img src={shown} alt="QR code preview" className="w-56 h-56 rounded-lg bg-white p-2 justify-self-center" />}
      </div>
    </Panel>
  );
}
