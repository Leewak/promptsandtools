"use client";

import { useState } from "react";
import { Button, Drop, Note, Panel, Segmented } from "../ui";
import { formatBytes, useBusy } from "./shared";

const FORMS = ["Data URI", "Base64 only", "HTML <img>", "CSS background"] as const;
type Form = (typeof FORMS)[number];

export default function ImgBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [uri, setUri] = useState("");
  const [form, setForm] = useState<Form>("Data URI");
  const [copied, setCopied] = useState(false);
  const { error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => {
    setFile(f[0]); setCopied(false);
    setUri(await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error("Could not read this file.")); r.readAsDataURL(f[0]); }));
  });

  const text = !uri ? "" : form === "Data URI" ? uri : form === "Base64 only" ? uri.split(",")[1] : form === "HTML <img>" ? `<img src="${uri}" alt="">` : `background-image: url("${uri}");`;
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="image/*" label="Drop an image to encode" onFiles={open} />
        {error && <Note tone="error">{error}</Note>}
        {uri && file && (
          <>
            <div className="flex items-center gap-4 flex-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uri} alt="Preview" className="h-20 w-20 object-contain rounded" style={{ background: "#0C0D22", border: "1px solid #23264A" }} />
              <Note>{file.name}: {formatBytes(file.size)} → {formatBytes(text.length)} of text (Base64 adds about 33%).</Note>
            </div>
            <Segmented options={[...FORMS]} value={form} onChange={setForm} />
            <textarea readOnly value={text} rows={7} data-testid="b64-out" className="w-full rounded-lg p-3 text-xs break-all" style={{ background: "#0C0D22", border: "1px solid #2A2E55", color: "#C9CCE8", fontFamily: "var(--font-mono)" }} />
            <div className="flex gap-3"><Button onClick={copy}>{copied ? "Copied" : "Copy to clipboard"}</Button></div>
          </>
        )}
      </div>
    </Panel>
  );
}
