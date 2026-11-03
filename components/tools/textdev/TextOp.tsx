"use client";

import { useMemo, useState } from "react";
import { download } from "@/lib/toolkit";
import { Button, Note, Panel, Segmented, Field, inputCls, inputStyle } from "../ui";
import { OPS, type OpName } from "./ops";

export default function TextOp({ op }: { op: OpName }) {
  const def = OPS[op];
  const [input, setInput] = useState(def.sample);
  const [mode, setMode] = useState(def.modes?.[0].id ?? "");
  const [f, setF] = useState<Record<string, string>>(() => Object.fromEntries((def.fields ?? []).map((x) => [x.id, x.value ?? ""])));
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(0);

  const res = useMemo(() => {
    void tick;
    try { return { out: def.run(input, mode, f), err: "" }; } catch (e) { return { out: "", err: (e as Error).message }; }
  }, [def, input, mode, f, tick]);

  const lines = (s: string) => (s ? s.split("\n").length : 0);
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        {def.modes && <Segmented options={def.modes.map((m) => m.id)} value={mode} onChange={setMode} format={(id) => def.modes!.find((m) => m.id === id)!.label} />}
        {def.fields && (
          <div className="grid gap-3 sm:grid-cols-2">
            {def.fields.map((x) => (
              <Field key={x.id} label={x.label}>
                <input value={f[x.id]} onChange={(e) => setF({ ...f, [x.id]: e.target.value })} placeholder={x.placeholder} className={inputCls} style={inputStyle} />
              </Field>
            ))}
          </div>
        )}
        <Field label={def.inLabel ?? "Input"}>
          <textarea aria-label="Input" rows={9} value={input} onChange={(e) => setInput(e.target.value)} placeholder={def.placeholder} spellCheck={false} className={`${inputCls} w-full font-mono`} style={inputStyle} />
        </Field>
        <div className="flex flex-wrap gap-3 items-center">
          <Button secondary onClick={() => setInput("")}>Clear</Button>
          {op === "sort-lines" && mode === "shuffle" && <Button secondary onClick={() => setTick(tick + 1)}>Shuffle again</Button>}
          <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#6E739C" }}>{input.length} chars · {lines(input)} lines</span>
        </div>
        {res.err ? <Note tone="error">{res.err}</Note> : (
          <>
            <Field label={def.outLabel ?? "Result"}>
              <textarea aria-label="Result" readOnly rows={9} value={res.out} className={`${inputCls} w-full font-mono`} style={inputStyle} />
            </Field>
            <div className="flex flex-wrap gap-3 items-center">
              <Button secondary disabled={!res.out} onClick={() => { navigator.clipboard.writeText(res.out).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}>{copied ? "Copied" : "Copy"}</Button>
              <Button secondary disabled={!res.out} onClick={() => download(new Blob([res.out], { type: "text/plain" }), def.file ?? "result.txt")}>Download</Button>
              <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#6E739C" }}>{res.out.length} chars · {lines(res.out)} lines</span>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
