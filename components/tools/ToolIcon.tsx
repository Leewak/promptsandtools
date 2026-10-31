import { Braces, FileDown, FileImage, ImageDown, KeyRound, PenLine, QrCode, Scaling, Type, UserSquare2, type LucideIcon } from "lucide-react";
import type { ToolKind } from "@/lib/tools";

const ICONS: Record<ToolKind, LucideIcon> = {
  "compress-pdf": FileDown,
  "resize-image-kb": Scaling,
  "passport-photo": UserSquare2,
  "signature-resizer": PenLine,
  "image-to-pdf": FileImage,
  "image-compressor": ImageDown,
  "qr-code-generator": QrCode,
  "word-counter": Type,
  "password-generator": KeyRound,
  "json-formatter": Braces,
};

/** Tinted icon tile in the tool's category colour. */
export function ToolIcon({ kind, color, size = 44 }: { kind: ToolKind; color: string; size?: number }) {
  const Icon = ICONS[kind];
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, borderRadius: 12, background: `${color}1A`, border: `1px solid ${color}40`, color }}>
      <Icon size={size * 0.5} strokeWidth={1.75} />
    </span>
  );
}
