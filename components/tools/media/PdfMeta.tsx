"use client";

import { useState } from "react";
import { Button, Drop, Field, Note, Panel, inputCls, inputStyle } from "../ui";
import { baseName, download, formatBytes, loadPdfLib, pdfBlob, useBusy } from "./shared";

const FIELDS = ["title", "author", "subject", "keywords", "creator", "producer"] as const;
type F = (typeof FIELDS)[number];

export default function PdfMeta() {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<Record<F, string>>({ title: "", author: "", subject: "", keywords: "", creator: "", producer: "" });
  const [dates, setDates] = useState({ created: "", modified: "" });
  const [pages, setPages] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; label: string } | null>(null);
  const { busy, error, wrap } = useBusy();

  const open = (f: File[]) => wrap(async () => {
    setFile(f[0]); setResult(null);
    const d = await loadPdfLib(f[0]);
    setMeta({ title: d.getTitle() ?? "", author: d.getAuthor() ?? "", subject: d.getSubject() ?? "", keywords: d.getKeywords() ?? "", creator: d.getCreator() ?? "", producer: d.getProducer() ?? "" });
    setDates({ created: d.getCreationDate()?.toLocaleString() ?? "", modified: d.getModificationDate()?.toLocaleString() ?? "" });
    setPages(d.getPageCount());
  });

  const save = (clear: boolean) => wrap(async () => {
    if (!file) return;
    const { PDFName } = await import("pdf-lib");
    const d = await loadPdfLib(file);
    const v = (k: F) => (clear ? "" : meta[k]);
    d.setTitle(v("title")); d.setAuthor(v("author")); d.setSubject(v("subject"));
    d.setKeywords(clear || !meta.keywords ? [] : [meta.keywords]);
    d.setCreator(v("creator")); d.setProducer(v("producer"));
    if (clear) {
      const info = d.context.lookup(d.context.trailerInfo.Info);
      if (info && "delete" in info) { (info as unknown as { delete(k: unknown): void }).delete(PDFName.of("CreationDate")); (info as unknown as { delete(k: unknown): void }).delete(PDFName.of("ModDate")); }
      d.catalog.delete(PDFName.of("Metadata")); // embedded XMP packet
    }
    setResult({ blob: pdfBlob(await d.save({ useObjectStreams: false })), label: clear ? "cleaned" : "edited" });
  });

  return (
    <Panel>
      <div className="flex flex-col gap-5">
        <Drop accept="application/pdf,.pdf" label="Drop a PDF here" onFiles={open} />
        {file && !error && (
          <>
            <Note>{file.name}: {pages} page{pages === 1 ? "" : "s"}. Created: {dates.created || "not set"}. Modified: {dates.modified || "not set"}.</Note>
            <div className="grid sm:grid-cols-2 gap-4">
              {FIELDS.map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}><input value={meta[k]} onChange={(e) => { setMeta({ ...meta, [k]: e.target.value }); setResult(null); }} className={inputCls} style={inputStyle} /></Field>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => save(true)} disabled={busy}>Remove all metadata</Button>
              <Button secondary onClick={() => save(false)} disabled={busy}>Save edited fields</Button>
              {result && <Button secondary onClick={() => download(result.blob, `${baseName(file.name)}-${result.label}.pdf`)}>Download {result.label} PDF ({formatBytes(result.blob.size)})</Button>}
            </div>
            <Note>This clears the document properties and the embedded XMP block. Text inside pages, such as an author name typed in the body, is not touched.</Note>
          </>
        )}
        {error && <Note tone="error">{error}</Note>}
      </div>
    </Panel>
  );
}
