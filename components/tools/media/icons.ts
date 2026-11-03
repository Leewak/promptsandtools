import { Binary, BookImage, Combine, Contrast, Crop, FileImage, FileMinus, FileOutput, FileSearch, FileSignature, FlipHorizontal2, Hash, ImageDown, Images, LayoutGrid, MapPin, Pipette, RotateCw, Scaling, Scissors, SmilePlus, Stamp, Star, ArrowUpDown, SquareDashed, EyeOff, type LucideIcon } from "lucide-react";
import type { MediaKind } from "@/lib/tools-media";

// Icons for the media tools; spread into the main icon map in ToolIcon.tsx.
export const MEDIA_ICONS: Record<MediaKind, LucideIcon> = {
  "pdf-merge": Combine,
  "pdf-split": Scissors,
  "pdf-extract": FileOutput,
  "pdf-delete": FileMinus,
  "pdf-rotate": RotateCw,
  "pdf-reorder": ArrowUpDown,
  "pdf-to-image": FileImage,
  "pdf-numbers": Hash,
  "pdf-watermark": Stamp,
  "pdf-sign": FileSignature,
  "pdf-meta": FileSearch,
  "img-crop": Crop,
  "img-resize": Scaling,
  "img-rotate": FlipHorizontal2,
  "img-convert": ImageDown,
  "img-base64": Binary,
  "favicon": Star,
  "img-round": SquareDashed,
  "img-border": BookImage,
  "img-grayscale": Contrast,
  "img-pixelate": EyeOff,
  "color-picker": Pipette,
  "meme": SmilePlus,
  "collage": LayoutGrid,
  "exif-remove": MapPin,
  "img-preset": Images,
};
