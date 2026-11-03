"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ToolKind } from "@/lib/tools";
import { MEDIA_MAP } from "./media/map";
import { TEXTDEV_MAP } from "./textdev/map";

const loading = () => <div className="rounded-2xl h-64 animate-pulse" style={{ background: "#10122A", border: "1px solid #23264A" }} />;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MAP: Record<ToolKind, ComponentType<any>> = {
  "compress-pdf": dynamic(() => import("./CompressPdf"), { ssr: false, loading }),
  "resize-image-kb": dynamic(() => import("./ResizeImageKb"), { ssr: false, loading }),
  "passport-photo": dynamic(() => import("./PassportPhoto"), { ssr: false, loading }),
  "signature-resizer": dynamic(() => import("./SignatureResizer"), { ssr: false, loading }),
  "image-to-pdf": dynamic(() => import("./ImageToPdf"), { ssr: false, loading }),
  "image-compressor": dynamic(() => import("./ImageCompressor"), { ssr: false, loading }),
  "qr-code-generator": dynamic(() => import("./QrGenerator"), { ssr: false, loading }),
  "word-counter": dynamic(() => import("./WordCounter"), { ssr: false, loading }),
  "password-generator": dynamic(() => import("./PasswordGenerator"), { ssr: false, loading }),
  "json-formatter": dynamic(() => import("./JsonFormatter"), { ssr: false, loading }),
  ...MEDIA_MAP,
  ...TEXTDEV_MAP,
};

export function ToolRunner({ kind, props }: { kind: ToolKind; props?: Record<string, string | number> }) {
  const C = MAP[kind];
  return <C {...props} />;
}
