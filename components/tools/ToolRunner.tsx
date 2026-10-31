"use client";

import dynamic from "next/dynamic";

const loading = () => <div className="rounded-2xl h-64 animate-pulse" style={{ background: "#10142A", border: "1px solid #1C2245" }} />;
const MAP = {
  "compress-pdf": dynamic(() => import("./CompressPdf"), { ssr: false, loading }),
  "resize-image-kb": dynamic(() => import("./ResizeImageKb"), { ssr: false, loading }),
  "passport-photo-maker": dynamic(() => import("./PassportPhoto"), { ssr: false, loading }),
  "signature-resizer": dynamic(() => import("./SignatureResizer"), { ssr: false, loading }),
  "image-to-pdf": dynamic(() => import("./ImageToPdf"), { ssr: false, loading }),
  "image-compressor": dynamic(() => import("./ImageCompressor"), { ssr: false, loading }),
  "qr-code-generator": dynamic(() => import("./QrGenerator"), { ssr: false, loading }),
  "word-counter": dynamic(() => import("./WordCounter"), { ssr: false, loading }),
  "password-generator": dynamic(() => import("./PasswordGenerator"), { ssr: false, loading }),
  "json-formatter": dynamic(() => import("./JsonFormatter"), { ssr: false, loading }),
} as const;

export function ToolRunner({ slug }: { slug: string }) {
  const C = MAP[slug as keyof typeof MAP];
  return C ? <C /> : null;
}
