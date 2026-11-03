"use client";

import { useEffect, useState } from "react";
import { Panel, Field, Note, inputCls, inputStyle } from "../ui";

export function md5(bytes: Uint8Array): string {
  const K = new Uint32Array(64); for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0;
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const len = bytes.length, padLen = (((len + 8) >> 6) + 1) * 64;
  const buf = new Uint8Array(padLen); buf.set(bytes); buf[len] = 0x80;
  const v = new DataView(buf.buffer); v.setUint32(padLen - 8, (len * 8) >>> 0, true); v.setUint32(padLen - 4, Math.floor(len / 0x20000000), true);
  for (let off = 0; off < padLen; off += 64) {
    const M = Array.from({ length: 16 }, (_, j) => v.getUint32(off + j * 4, true));
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      const s = S[(i >> 4) * 4 + (i & 3)];
      B = (B + (((F << s) | (F >>> (32 - s))) >>> 0)) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const o = new DataView(new ArrayBuffer(16)); [a0, b0, c0, d0].forEach((x, i) => o.setUint32(i * 4, x, true));
  return [...new Uint8Array(o.buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export default function Hash() {
  const [t, setT] = useState("hello world");
  const [upper, setUpper] = useState(false);
  const [r, setR] = useState<Record<string, string>>({});
  useEffect(() => {
    let live = true;
    const bytes = new TextEncoder().encode(t);
    (async () => {
      const o: Record<string, string> = { MD5: md5(bytes) };
      for (const a of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) o[a] = hex(await crypto.subtle.digest(a, bytes));
      if (live) setR(o);
    })();
    return () => { live = false; };
  }, [t]);
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <Field label="Text to hash"><textarea aria-label="Text" rows={5} value={t} onChange={(e) => setT(e.target.value)} className={`${inputCls} w-full font-mono`} style={inputStyle} /></Field>
        <label className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase hex</label>
        {Object.entries(r).map(([k, v]) => (
          <div key={k} className="rounded-lg p-3" style={{ background: "#0C0D22", border: "1px solid #23264A" }}>
            <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "var(--font-mono)", color: "#7DD3FC" }}>{k}<button type="button" onClick={() => navigator.clipboard.writeText(upper ? v.toUpperCase() : v)} style={{ color: "#9CA1C9" }}>Copy</button></div>
            <p data-hash={k} className="font-mono text-sm break-all" style={{ color: "#E8EAF6" }}>{upper ? v.toUpperCase() : v}</p>
          </div>
        ))}
        <Note>MD5 and SHA-1 are fine for checksums but are broken for security. Do not use them to store passwords. The text is hashed as UTF-8.</Note>
      </div>
    </Panel>
  );
}
