"use client";

import { useMemo, useState } from "react";
import { Button, Panel, inputCls, inputStyle } from "../ui";
import { download } from "@/lib/toolkit";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function inline(s: string) {
  const codes: string[] = [];
  let t = esc(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0001${codes.length - 1}\u0001`; });
  t = t.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/|#)[^)\s]*)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_, a, b) => `<strong>${a ?? b}</strong>`)
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)|(^|[^_\w])_([^_\n]+)_(?!\w)/g, (_, p1, a, p2, b) => `${p1 ?? p2}<em>${a ?? b}</em>`)
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return t.replace(/\u0001(\d+)\u0001/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
}
export function mdToHtml(src: string) {
  const lines = src.replace(/\r\n?/g, "\n").split("\n"); const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { const buf: string[] = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`); continue; }
    const h = l.match(/^(#{1,6})\s+(.*)$/); if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push("<hr>"); i++; continue; }
    if (/^>\s?/.test(l)) { const buf: string[] = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`); continue; }
    if (/^\s*[-*+]\s+/.test(l)) { const b: string[] = []; while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) b.push(`<li>${inline(lines[i++].replace(/^\s*[-*+]\s+/, ""))}</li>`); out.push(`<ul>${b.join("")}</ul>`); continue; }
    if (/^\s*\d+[.)]\s+/.test(l)) { const b: string[] = []; while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) b.push(`<li>${inline(lines[i++].replace(/^\s*\d+[.)]\s+/, ""))}</li>`); out.push(`<ol>${b.join("")}</ol>`); continue; }
    if (!l.trim()) { i++; continue; }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*[-*+]\s|\s*\d+[.)]\s|-{3,}\s*$)/.test(lines[i])) buf.push(lines[i++]);
    if (!buf.length) { buf.push(lines[i++]); }
    out.push(`<p>${inline(buf.join("\n")).replace(/\n/g, "<br>")}</p>`);
  }
  return out.join("\n");
}

const SAMPLE = "# Hello Markdown\n\nWrite on the left, see the preview on the right.\n\n- **Bold**, *italic* and `code`\n- A [link](https://example.com)\n\n1. First\n2. Second\n\n> A quote\n\n```\nconst x = 1;\n```\n";
export default function Markdown() {
  const [md, setMd] = useState(SAMPLE);
  const html = useMemo(() => mdToHtml(md), [md]);
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <textarea aria-label="Markdown" rows={18} value={md} onChange={(e) => setMd(e.target.value)} spellCheck={false} className={`${inputCls} w-full font-mono`} style={inputStyle} />
          <div id="md-preview" className="md-preview rounded-lg p-4 overflow-auto max-h-[460px]" style={{ ...inputStyle, color: "#C9CCE8" }} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button secondary onClick={() => navigator.clipboard.writeText(html)}>Copy HTML</Button>
          <Button secondary onClick={() => download(new Blob([md], { type: "text/markdown" }), "document.md")}>Download .md</Button>
          <Button secondary onClick={() => download(new Blob([html], { type: "text/html" }), "document.html")}>Download .html</Button>
        </div>
        <p className="text-xs" style={{ color: "#6E739C" }}>Supports headings, bold, italic, strikethrough, inline code, code blocks, links, lists, quotes and rules. Tables and raw HTML are not rendered.</p>
        <style>{`.md-preview h1{font-size:1.7rem;font-weight:700;margin:.4em 0;color:#E8EAF6}.md-preview h2{font-size:1.4rem;font-weight:700;margin:.8em 0 .3em;color:#E8EAF6}.md-preview h3,.md-preview h4,.md-preview h5,.md-preview h6{font-size:1.1rem;font-weight:600;margin:.8em 0 .3em;color:#E8EAF6}.md-preview p,.md-preview ul,.md-preview ol,.md-preview blockquote,.md-preview pre{margin:.6em 0}.md-preview ul{list-style:disc;padding-left:1.4em}.md-preview ol{list-style:decimal;padding-left:1.4em}.md-preview a{color:#60A5FA;text-decoration:underline}.md-preview code{font-family:var(--font-mono);background:#181B3A;padding:1px 5px;border-radius:4px}.md-preview pre{background:#0A0B1E;padding:12px;border-radius:8px;overflow:auto}.md-preview pre code{background:none;padding:0}.md-preview blockquote{border-left:3px solid #3B82F6;padding-left:12px;color:#9CA1C9}.md-preview hr{border-color:#23264A;margin:1em 0}`}</style>
      </div>
    </Panel>
  );
}
