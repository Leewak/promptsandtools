"use client";

import { useMemo, useState } from "react";
import { Button, Panel, Segmented, Field, inputCls, inputStyle } from "../ui";

const W = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
const rnd = (n: number) => Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * n);

function sentence(first: boolean) {
  const n = 8 + rnd(10); const w: string[] = [];
  if (first) w.push("lorem", "ipsum", "dolor", "sit", "amet");
  while (w.length < n) w.push(W[rnd(W.length)]);
  const s = w.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
export default function Lorem() {
  const [unit, setUnit] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [seed, setSeed] = useState(0);
  const out = useMemo(() => {
    void seed;
    const n = Math.max(1, Math.min(count || 1, unit === "words" ? 5000 : 200));
    if (unit === "words") {
      const w: string[] = classic ? ["lorem", "ipsum"] : [];
      while (w.length < n) w.push(W[rnd(W.length)]);
      const s = w.slice(0, n).join(" "); return s.charAt(0).toUpperCase() + s.slice(1) + ".";
    }
    if (unit === "sentences") return Array.from({ length: n }, (_, i) => sentence(classic && i === 0)).join(" ");
    return Array.from({ length: n }, (_, p) => Array.from({ length: 4 + rnd(4) }, (_, i) => sentence(classic && p === 0 && i === 0)).join(" ")).join("\n\n");
  }, [unit, count, classic, seed]);
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <Segmented options={["paragraphs", "sentences", "words"]} value={unit} onChange={setUnit} />
        <div className="flex flex-wrap gap-4 items-end">
          <Field label="How many"><input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputCls} style={{ ...inputStyle, width: 110 }} /></Field>
          <label className="text-sm flex gap-2 items-center pb-2.5" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} /> Start with &ldquo;Lorem ipsum dolor sit amet&rdquo;</label>
          <Button secondary onClick={() => setSeed(seed + 1)}>Regenerate</Button>
        </div>
        <textarea aria-label="Generated text" readOnly rows={12} value={out} className={`${inputCls} w-full`} style={inputStyle} />
        <div><Button secondary onClick={() => navigator.clipboard.writeText(out)}>Copy</Button></div>
      </div>
    </Panel>
  );
}
