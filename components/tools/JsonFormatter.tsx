"use client";

import { useState } from "react";
import { download } from "@/lib/toolkit";
import { Button, Note, Panel, inputCls, inputStyle } from "./ui";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Prompts & Tools","tools":["json","qr"],"free":true}');
  const [output, setOutput] = useState("");
  const [msg, setMsg] = useState<{ t: "ok" | "error"; m: string } | null>(null);
  const [indent, setIndent] = useState(2);

  function run(mode: "format" | "minify") {
    try {
      const v = JSON.parse(input);
      setOutput(mode === "format" ? JSON.stringify(v, null, indent) : JSON.stringify(v));
      setMsg({ t: "ok", m: "Valid JSON" });
    } catch (e) {
      const m = (e as Error).message, pos = Number(m.match(/position (\d+)/)?.[1]);
      const where = Number.isFinite(pos) ? ` (line ${input.slice(0, pos).split("\n").length})` : "";
      setOutput(""); setMsg({ t: "error", m: `Invalid JSON${where}: ${m}` });
    }
  }

  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} className={`${inputCls} w-full font-mono`} style={inputStyle} />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => run("format")}>Format / validate</Button>
          <Button secondary onClick={() => run("minify")}>Minify</Button>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className={inputCls} style={inputStyle}>
            <option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={1}>1 space</option>
          </select>
        </div>
        {msg && <Note tone={msg.t}>{msg.m}</Note>}
        {output && (
          <>
            <textarea readOnly rows={12} value={output} className={`${inputCls} w-full font-mono`} style={inputStyle} />
            <div className="flex gap-3">
              <Button secondary onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>
              <Button secondary onClick={() => download(new Blob([output], { type: "application/json" }), "formatted.json")}>Download</Button>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
