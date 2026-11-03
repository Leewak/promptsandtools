"use client";

import { useState } from "react";
import { Button, Panel, Segmented, Field, Note, inputCls, inputStyle } from "../ui";
import { download } from "@/lib/toolkit";

const Out = ({ text, file }: { text: string; file: string }) => (
  <div className="flex flex-col gap-3">
    <textarea id="gen-out" aria-label="Generated output" readOnly rows={12} value={text} className={`${inputCls} w-full font-mono`} style={inputStyle} />
    <div className="flex gap-3"><Button secondary onClick={() => navigator.clipboard.writeText(text)}>Copy</Button><Button secondary onClick={() => download(new Blob([text], { type: "text/plain" }), file)}>Download</Button></div>
  </div>
);
const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
type S = [string, (v: string) => void];
const In = ({ label, st, ph }: { label: string; st: S; ph?: string }) => <Field label={label}><input aria-label={label} value={st[0]} onChange={(e) => st[1](e.target.value)} placeholder={ph} className={inputCls} style={inputStyle} /></Field>;

export function MetaTags() {
  const [title, setTitle] = useState("Free PDF Tools Online"), [desc, setDesc] = useState("Merge, split and compress PDFs in your browser. Free, no sign-up.");
  const [url, setUrl] = useState("https://example.com/"), [img, setImg] = useState("https://example.com/og.jpg"), [site, setSite] = useState("Example"), [tw, setTw] = useState("summary_large_image");
  const [robots, setRobots] = useState("index, follow");
  const L: string[] = ["<meta charset=\"utf-8\">", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"];
  if (title) L.push(`<title>${attr(title)}</title>`);
  if (desc) L.push(`<meta name="description" content="${attr(desc)}">`);
  L.push(`<meta name="robots" content="${robots}">`);
  if (url) L.push(`<link rel="canonical" href="${attr(url)}">`);
  if (title) L.push(`<meta property="og:title" content="${attr(title)}">`);
  if (desc) L.push(`<meta property="og:description" content="${attr(desc)}">`);
  L.push('<meta property="og:type" content="website">');
  if (url) L.push(`<meta property="og:url" content="${attr(url)}">`);
  if (site) L.push(`<meta property="og:site_name" content="${attr(site)}">`);
  if (img) L.push(`<meta property="og:image" content="${attr(img)}">`);
  L.push(`<meta name="twitter:card" content="${tw}">`);
  if (title) L.push(`<meta name="twitter:title" content="${attr(title)}">`);
  if (desc) L.push(`<meta name="twitter:description" content="${attr(desc)}">`);
  if (img) L.push(`<meta name="twitter:image" content="${attr(img)}">`);
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <In label="Page title" st={[title, setTitle]} /><p className="text-xs -mt-2" style={{ color: title.length > 60 ? "#FBBF24" : "#6E739C" }}>{title.length} characters (around 60 is safe)</p>
        <Field label="Description"><textarea aria-label="Description" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className={inputCls} style={inputStyle} /></Field><p className="text-xs -mt-2" style={{ color: desc.length > 155 ? "#FBBF24" : "#6E739C" }}>{desc.length} characters (around 155 is safe)</p>
        <div className="grid gap-3 sm:grid-cols-2"><In label="Page URL (canonical)" st={[url, setUrl]} /><In label="Image URL (social preview)" st={[img, setImg]} /><In label="Site name" st={[site, setSite]} /></div>
        <Segmented options={["index, follow", "noindex, follow", "noindex, nofollow"]} value={robots} onChange={setRobots} />
        <Segmented options={["summary_large_image", "summary"]} value={tw} onChange={setTw} />
        <Out text={L.join("\n")} file="meta-tags.html" />
      </div>
    </Panel>
  );
}

const PRESETS: Record<string, { ua: string; allow: string; dis: string }> = {
  all: { ua: "*", allow: "", dis: "" }, none: { ua: "*", allow: "", dis: "/" },
  wp: { ua: "*", allow: "/wp-admin/admin-ajax.php", dis: "/wp-admin/\n/wp-login.php" },
  next: { ua: "*", allow: "", dis: "/api/\n/admin/" },
};
export function Robots() {
  const [p, setP] = useState("all");
  const [ua, setUa] = useState("*"), [allow, setAllow] = useState(""), [dis, setDis] = useState(""), [sm, setSm] = useState("https://example.com/sitemap.xml"), [delay, setDelay] = useState("");
  const pick = (id: string) => { setP(id); setUa(PRESETS[id].ua); setAllow(PRESETS[id].allow); setDis(PRESETS[id].dis); };
  const ls = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const out = [`User-agent: ${ua || "*"}`, ...ls(dis).map((x) => `Disallow: ${x}`), ...ls(allow).map((x) => `Allow: ${x}`), ...(!ls(dis).length && !ls(allow).length ? ["Disallow:"] : []), ...(delay ? [`Crawl-delay: ${delay}`] : []), ...(sm ? ["", ...ls(sm).map((x) => `Sitemap: ${x}`)] : [])].join("\n") + "\n";
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <Segmented options={["all", "none", "wp", "next"]} value={p} onChange={pick} format={(v) => ({ all: "Allow everything", none: "Block everything", wp: "WordPress", next: "Block /api/ & /admin/" })[v]!} />
        <div className="grid gap-3 sm:grid-cols-2">
          <In label="User-agent" st={[ua, setUa]} /><In label="Crawl-delay (seconds, optional)" st={[delay, setDelay]} />
          <Field label="Disallow paths (one per line)"><textarea aria-label="Disallow paths" rows={4} value={dis} onChange={(e) => setDis(e.target.value)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Allow paths (one per line)"><textarea aria-label="Allow paths" rows={4} value={allow} onChange={(e) => setAllow(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        </div>
        <In label="Sitemap URL(s), one per line works too" st={[sm, setSm]} />
        <Note>Upload the file as robots.txt in your site&rsquo;s root. Google ignores Crawl-delay. robots.txt is not a security tool: blocked URLs can still be linked and found.</Note>
        <Out text={out} file="robots.txt" />
      </div>
    </Panel>
  );
}

export function Utm() {
  const [url, setUrl] = useState("https://example.com/landing"), [src, setSrc] = useState("newsletter"), [med, setMed] = useState("email"), [camp, setCamp] = useState("spring_sale"), [term, setTerm] = useState(""), [cont, setCont] = useState("");
  let out = "", err = "";
  try {
    const u = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : "https://" + url.trim());
    if (!url.trim()) throw new Error("x");
    for (const [k, v] of [["utm_source", src], ["utm_medium", med], ["utm_campaign", camp], ["utm_term", term], ["utm_content", cont]]) { u.searchParams.delete(k); if (v.trim()) u.searchParams.set(k, v.trim()); }
    out = u.toString();
  } catch { err = url.trim() ? "That does not look like a valid URL." : "Enter the page URL."; }
  const missing = !src.trim() || !med.trim() || !camp.trim();
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <In label="Website URL" st={[url, setUrl]} />
        <div className="grid gap-3 sm:grid-cols-2">
          <In label="Campaign source (utm_source)" st={[src, setSrc]} ph="google, newsletter" /><In label="Campaign medium (utm_medium)" st={[med, setMed]} ph="cpc, email, social" />
          <In label="Campaign name (utm_campaign)" st={[camp, setCamp]} ph="spring_sale" /><In label="Campaign term (optional)" st={[term, setTerm]} ph="paid keyword" />
          <In label="Campaign content (optional)" st={[cont, setCont]} ph="banner_a" />
        </div>
        {err ? <Note tone="error">{err}</Note> : <>
          {missing && <Note>Google Analytics expects source, medium and campaign name to all be filled in.</Note>}
          <textarea id="utm-out" aria-label="Campaign URL" readOnly rows={4} value={out} className={`${inputCls} w-full font-mono`} style={inputStyle} />
          <div><Button secondary onClick={() => navigator.clipboard.writeText(out)}>Copy URL</Button></div></>}
        <p className="text-xs" style={{ color: "#6E739C" }}>Parameters are case-sensitive in reports, so use consistent lowercase names. Never put personal data in UTM values.</p>
      </div>
    </Panel>
  );
}
