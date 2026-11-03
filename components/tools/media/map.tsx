"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { MediaKind } from "@/lib/tools-media";

const loading = () => <div className="rounded-2xl h-64 animate-pulse" style={{ background: "#10122A", border: "1px solid #23264A" }} />;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = (loader: () => Promise<{ default: ComponentType<any> }>) => dynamic(loader, { ssr: false, loading });

// Component for each media tool kind; spread into the main map in ToolRunner.tsx.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MEDIA_MAP: Record<MediaKind, ComponentType<any>> = {
  "pdf-merge": d(() => import("./PdfMerge")),
  "pdf-split": d(() => import("./PdfSplit")),
  "pdf-extract": d(() => import("./PdfPageTool")),
  "pdf-delete": d(() => import("./PdfPageTool")),
  "pdf-rotate": d(() => import("./PdfPageTool")),
  "pdf-reorder": d(() => import("./PdfPageTool")),
  "pdf-to-image": d(() => import("./PdfToImage")),
  "pdf-numbers": d(() => import("./PdfNumbers")),
  "pdf-watermark": d(() => import("./PdfWatermark")),
  "pdf-sign": d(() => import("./PdfSign")),
  "pdf-meta": d(() => import("./PdfMeta")),
  "img-crop": d(() => import("./ImgCrop")),
  "img-resize": d(() => import("./ImgResize")),
  "img-rotate": d(() => import("./ImgRotate")),
  "img-convert": d(() => import("./ImgConvert")),
  "img-base64": d(() => import("./ImgBase64")),
  "favicon": d(() => import("./Favicon")),
  "img-round": d(() => import("./ImgLive")),
  "img-border": d(() => import("./ImgLive")),
  "img-grayscale": d(() => import("./ImgLive")),
  "img-pixelate": d(() => import("./ImgPixelate")),
  "color-picker": d(() => import("./ColorPicker")),
  "meme": d(() => import("./Meme")),
  "collage": d(() => import("./Collage")),
  "exif-remove": d(() => import("./ExifRemove")),
  "img-preset": d(() => import("./ImgPreset")),
};
