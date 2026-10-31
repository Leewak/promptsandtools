// Browser-side helpers shared by the free tools. Nothing here uploads files: everything runs on the visitor's device.

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file could not be read as an image."));
    img.src = url;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), type, quality),
  );
}

export function drawToCanvas(img: CanvasImageSource, w: number, h: number, background = "#ffffff") {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = background; // JPEG has no transparency: fill white instead of black
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/** Re-encode a canvas as JPEG, lowering quality then dimensions until it fits targetBytes. */
export async function jpegUnder(canvas: HTMLCanvasElement, targetBytes: number) {
  let src = canvas;
  for (let round = 0; round < 8; round++) {
    let lo = 0.05, hi = 0.95, best: Blob | null = null;
    for (let i = 0; i < 8; i++) {
      const q = (lo + hi) / 2;
      const b = await canvasToBlob(src, "image/jpeg", q);
      if (b.size <= targetBytes) { best = b; lo = q; } else hi = q;
    }
    if (best) return { blob: best, width: src.width, height: src.height };
    src = drawToCanvas(src, src.width * 0.85, src.height * 0.85);
  }
  const blob = await canvasToBlob(src, "image/jpeg", 0.05);
  return { blob, width: src.width, height: src.height };
}

export function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

export function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "") || "file";
}
