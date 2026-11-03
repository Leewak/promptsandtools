// Pure text/dev transformations used by the generic TextOp component. Everything runs in the browser.

export type OpName =
  | "case-converter" | "dedupe-lines" | "sort-lines" | "remove-line-breaks" | "find-replace" | "slug" | "text-binary" | "text-hex" | "morse"
  | "reverse-text" | "clean-spaces" | "base64" | "url-codec" | "html-entities" | "csv-json" | "json-csv" | "json-yaml" | "xml-format" | "sql-format"
  | "jwt" | "cron" | "timestamp";

export interface OpDef {
  sample: string;
  placeholder?: string;
  inLabel?: string;
  outLabel?: string;
  modes?: { id: string; label: string }[];
  fields?: { id: string; label: string; placeholder: string; value?: string }[];
  file?: string; // download filename
  run: (input: string, mode: string, f: Record<string, string>) => string;
}

const words = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const utf8 = (s: string) => new TextEncoder().encode(s);
const fromUtf8 = (b: Uint8Array) => new TextDecoder("utf-8", { fatal: true }).decode(b);

export function b64encode(s: string, urlSafe = false) {
  let bin = ""; utf8(s).forEach((b) => (bin += String.fromCharCode(b)));
  const r = btoa(bin);
  return urlSafe ? r.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : r;
}
export function b64decode(s: string) {
  let t = s.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  let bin: string;
  try { bin = atob(t); } catch { throw new Error("That is not valid Base64."); }
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  try { return fromUtf8(bytes); } catch { throw new Error("The decoded bytes are not valid UTF-8 text (it may be a binary file)."); }
}

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// ---------- CSV ----------
export function parseCsv(text: string, delim: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; rows.push(row); row = []; }
    else cur += c;
  }
  if (q) throw new Error("A quoted field is never closed.");
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => c !== ""));
}
const DELIMS: Record<string, string> = { comma: ",", semicolon: ";", tab: "\t", pipe: "|" };
function csvToJson(input: string, mode: string) {
  const rows = parseCsv(input, DELIMS[mode] ?? ",");
  if (!rows.length) return "";
  const head = rows[0].map((h, i) => h.trim() || `column${i + 1}`);
  const out = rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
  return JSON.stringify(out, null, 2);
}
function jsonToCsv(input: string, mode: string) {
  const d = DELIMS[mode] ?? ",";
  const data = JSON.parse(input);
  const arr: unknown[] = Array.isArray(data) ? data : [data];
  if (!arr.length) return "";
  const keys: string[] = [];
  for (const o of arr) if (o && typeof o === "object") for (const k of Object.keys(o)) if (!keys.includes(k)) keys.push(k);
  if (!keys.length) throw new Error("Expected an array of objects, for example [{\"a\":1}].");
  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return s.includes(d) || /["\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.map(esc).join(d), ...arr.map((o) => keys.map((k) => esc((o as Record<string, unknown>)?.[k])).join(d))].join("\n");
}

// ---------- YAML ----------
function yamlScalar(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  const s = String(v);
  if (s === "") return '""';
  if (/^[\s]|[\s]$|^[-?:,[\]{}#&*!|>'"%@`]|: | #|^(true|false|null|yes|no|on|off|~)$/i.test(s) || /^[-+]?(\d|\.\d)/.test(s) && !isNaN(Number(s)) || s.includes("\n")) return JSON.stringify(s);
  return s;
}
export function toYaml(v: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    return v.map((x) => {
      if (x && typeof x === "object" && !(Array.isArray(x) && !x.length) && !(!Array.isArray(x) && !Object.keys(x).length)) {
        const inner = toYaml(x, indent + 1).split("\n");
        return `${pad}- ${inner[0].trimStart()}` + (inner.length > 1 ? "\n" + inner.slice(1).join("\n") : "");
      }
      return `${pad}- ${x && typeof x === "object" ? (Array.isArray(x) ? "[]" : "{}") : yamlScalar(x)}`;
    }).join("\n");
  }
  if (v && typeof v === "object") {
    const e = Object.entries(v as Record<string, unknown>);
    if (!e.length) return "{}";
    return e.map(([k, x]) => {
      const key = /^[A-Za-z_][\w.-]*$/.test(k) ? k : JSON.stringify(k);
      if (x && typeof x === "object") {
        const empty = Array.isArray(x) ? !x.length : !Object.keys(x).length;
        return empty ? `${pad}${key}: ${Array.isArray(x) ? "[]" : "{}"}` : `${pad}${key}:\n${toYaml(x, indent + 1)}`;
      }
      return `${pad}${key}: ${yamlScalar(x)}`;
    }).join("\n");
  }
  return pad + yamlScalar(v);
}

// ---------- XML ----------
function xmlFormat(input: string, mode: string) {
  const doc = new DOMParser().parseFromString(input, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML: " + (err.textContent || "").split("\n").find((l) => l.trim() && !/^This page/i.test(l))?.trim());
  const tokens = input.replace(/>\s+</g, "><").trim().split(/(?=<)|(?<=>)/).filter((t) => t !== "");
  if (mode === "minify") return tokens.join("");
  let depth = 0; const lines: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (/^<\//.test(t)) { depth = Math.max(0, depth - 1); lines.push("  ".repeat(depth) + t); }
    else if (/^<[^!?][^>]*[^/]>$/.test(t) || /^<[^!?/>]>$/.test(t)) {
      // opening tag: keep short text-only elements on one line
      if (tokens[i + 1] && !tokens[i + 1].startsWith("<") && tokens[i + 2] && new RegExp("^</").test(tokens[i + 2])) {
        lines.push("  ".repeat(depth) + t + tokens[i + 1].trim() + tokens[i + 2]); i += 2;
      } else { lines.push("  ".repeat(depth) + t); depth++; }
    } else lines.push("  ".repeat(depth) + t.trim());
  }
  return lines.join("\n");
}

// ---------- SQL ----------
const SQL_KW = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN", "ON", "UNION ALL", "UNION", "AND", "OR", "AS", "IN", "NOT", "NULL", "IS", "LIKE", "BETWEEN", "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "DESC", "ASC", "EXISTS", "COUNT", "SUM", "AVG", "MIN", "MAX", "WITH", "OUTER", "RETURNING"];
function sqlFormat(input: string, mode: string) {
  // protect string literals and quoted identifiers
  const keep: string[] = [];
  let s = input.replace(/'(?:[^']|'')*'|"[^"]*"|`[^`]*`|--[^\n]*|\/\*[\s\S]*?\*\//g, (m) => { keep.push(m); return `\u0001${keep.length - 1}\u0001`; });
  s = s.replace(/\s+/g, " ").trim();
  if (mode === "minify") return s.replace(/\u0001(\d+)\u0001/g, (_, i) => keep[Number(i)]).replace(/\s*([(),=])\s*/g, "$1 ").replace(/ +/g, " ").trim();
  const upper = mode !== "format-keep";
  const kw = [...SQL_KW].sort((a, b) => b.length - a.length).map((k) => k.replace(" ", "\\s+")).join("|");
  if (upper) s = s.replace(new RegExp(`\\b(${kw})\\b`, "gi"), (m) => m.replace(/\s+/g, " ").toUpperCase());
  const breakBefore = /\b(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|VALUES|SET|UNION ALL|UNION|LEFT JOIN|RIGHT JOIN|INNER JOIN|FULL JOIN|CROSS JOIN|JOIN|RETURNING)\b/gi;
  s = s.replace(breakBefore, "\n$1").replace(/\b(AND|OR)\b/gi, "\n  $1");
  // split select list on top-level commas
  let depth = 0, out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(") depth++; else if (c === ")") depth = Math.max(0, depth - 1);
    out += c === "," && depth === 0 ? ",\n  " : c;
  }
  return out.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\u0001(\d+)\u0001/g, (_, i) => keep[Number(i)]).replace(/\n  (AND|OR)\b/gi, "\n  $1");
}

// ---------- JWT ----------
function jwtDecode(input: string) {
  const parts = input.trim().replace(/^Bearer\s+/i, "").split(".");
  if (parts.length < 2 || parts.length > 3) throw new Error("A JWT has three parts separated by dots (header.payload.signature).");
  const dec = (p: string, n: string) => { try { return JSON.parse(b64decode(p)); } catch { throw new Error(`The ${n} is not valid Base64URL-encoded JSON.`); } };
  const header = dec(parts[0], "header"), payload = dec(parts[1], "payload");
  const lines = ["// HEADER", JSON.stringify(header, null, 2), "", "// PAYLOAD", JSON.stringify(payload, null, 2), ""];
  const times: string[] = [];
  for (const [k, label] of [["iat", "Issued at"], ["nbf", "Not before"], ["exp", "Expires"]] as const)
    if (typeof payload[k] === "number") times.push(`${label} (${k}): ${new Date(payload[k] * 1000).toISOString()}`);
  if (typeof payload.exp === "number") times.push(payload.exp * 1000 < Date.now() ? "Status: EXPIRED" : "Status: not expired");
  if (times.length) lines.push("// TIMES", ...times, "");
  lines.push(`// SIGNATURE (not verified)`, parts[2] ?? "(none)");
  return lines.join("\n");
}

// ---------- cron ----------
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function cronField(raw: string, min: number, max: number, names?: string[], nameBase = 0): Set<number> {
  let f = raw.toUpperCase().replace(/\?/g, "*");
  if (names) names.forEach((n, i) => (f = f.replace(new RegExp(n, "g"), String(i + nameBase))));
  const out = new Set<number>();
  for (const part of f.split(",")) {
    const m = part.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);
    if (!m) throw new Error(`Cannot read "${raw}".`);
    let a = min, b = max; const step = m[2] ? Number(m[2]) : 1;
    if (!step) throw new Error("A step of 0 is not allowed.");
    if (m[1] !== "*") { const [x, y] = m[1].split("-").map(Number); a = x; b = y ?? (m[2] ? max : x); }
    if (a < min || b > max || a > b) throw new Error(`"${raw}" is outside ${min}-${max}.`);
    for (let i = a; i <= b; i += step) out.add(i);
  }
  return out;
}
const pad2 = (n: number) => String(n).padStart(2, "0");
function list(vals: number[], fmt: (n: number) => string) {
  const s = vals.map(fmt);
  return s.length <= 2 ? s.join(" and ") : s.slice(0, -1).join(", ") + " and " + s[s.length - 1];
}
function describeField(raw: string, unit: string, set: Set<number>, min: number, max: number, fmt: (n: number) => string = String) {
  const f = raw.toUpperCase();
  if (f === "*" || f === "?") return "";
  const step = f.match(/^\*\/(\d+)$/);
  if (step) return `every ${step[1]} ${unit}s`;
  return `${unit} ${list([...set].sort((a, b) => a - b), fmt)}`;
}
function cronExplain(input: string) {
  const p = input.trim().replace(/\s+/g, " ").split(" ");
  const special: Record<string, string> = { "@yearly": "0 0 1 1 *", "@annually": "0 0 1 1 *", "@monthly": "0 0 1 * *", "@weekly": "0 0 * * 0", "@daily": "0 0 * * *", "@midnight": "0 0 * * *", "@hourly": "0 * * * *" };
  const parts = special[p[0]?.toLowerCase()] ? special[p[0].toLowerCase()].split(" ") : p;
  if (parts.length !== 5) throw new Error("Enter five fields: minute hour day-of-month month day-of-week (for example 30 9 * * 1-5).");
  const [mi, ho, dom, mon, dow] = parts;
  const sMi = cronField(mi, 0, 59), sHo = cronField(ho, 0, 23), sDom = cronField(dom, 1, 31), sMon = cronField(mon, 1, 12, MONTHS, 1);
  const sDow = cronField(dow.toUpperCase().replace(/\b7\b/g, "0"), 0, 6, DAYS, 0);
  // description
  let time: string;
  if (mi === "*" && ho === "*") time = "Every minute";
  else if (/^\d+$/.test(mi) && /^\d+$/.test(ho)) time = `At ${pad2(+ho)}:${pad2(+mi)}`;
  else if (/^\d+$/.test(mi) && ho === "*") time = mi === "0" ? "At the start of every hour" : `At minute ${mi} of every hour`;
  else {
    const a = describeField(mi, "minute", sMi, 0, 59) || "every minute", b = describeField(ho, "hour", sHo, 0, 23);
    time = `At ${a}${b ? `, ${b}` : ""}`.replace("At every", "Every");
  }
  const bits = [time];
  const d = describeField(dom, "day", sDom, 1, 31); if (d) bits.push(d.startsWith("every") ? d.replace("days", "days of the month") : `on ${d} of the month`);
  const w = describeField(dow.replace(/\b7\b/g, "0"), "day", sDow, 0, 6, (n) => DAY_NAMES[n]);
  if (w) bits.push(/^day /.test(w) ? `on ${w.replace(/^day /, "")}` : w);
  const mo = describeField(mon, "month", sMon, 1, 12, (n) => MONTH_NAMES[n - 1]); if (mo) bits.push(/^month /.test(mo) ? `in ${mo.replace(/^month /, "")}` : mo);
  if (dom !== "*" && dow !== "*" && dom !== "?" && dow !== "?") bits.push("(runs when either the day of month or the weekday matches)");
  // next runs
  const next: string[] = []; const t = new Date(); t.setSeconds(0, 0); t.setMinutes(t.getMinutes() + 1);
  const domR = dom !== "*" && dom !== "?", dowR = dow !== "*" && dow !== "?";
  for (let i = 0; i < 366 * 24 * 60 && next.length < 5; i++, t.setMinutes(t.getMinutes() + 1)) {
    if (!sMi.has(t.getMinutes()) || !sHo.has(t.getHours()) || !sMon.has(t.getMonth() + 1)) continue;
    const dm = sDom.has(t.getDate()), dw = sDow.has(t.getDay());
    if (domR && dowR ? !(dm || dw) : !(dm && dw)) continue;
    next.push(t.toString().replace(/ GMT.*/, ""));
  }
  return `${bits.join(", ")}.\n\nNext runs (your local time):\n${next.length ? next.map((n) => "  " + n).join("\n") : "  none within the next year"}`;
}

// ---------- timestamp ----------
function tsLine(line: string) {
  const t = line.trim(); if (!t) return "";
  let d: Date;
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const n = Number(t); d = new Date(Math.abs(n) < 1e11 ? n * 1000 : n);
  } else d = new Date(t);
  if (isNaN(d.getTime())) return `${t}\n  Could not read this as a Unix timestamp or a date.`;
  const diff = Math.round((d.getTime() - Date.now()) / 1000), a = Math.abs(diff);
  const rel = a < 60 ? "just now" : a < 3600 ? `${Math.round(a / 60)} minutes` : a < 86400 ? `${Math.round(a / 3600)} hours` : `${Math.round(a / 86400)} days`;
  return [`${t}`, `  Seconds:  ${Math.floor(d.getTime() / 1000)}`, `  Millis:   ${d.getTime()}`, `  UTC:      ${d.toISOString()}`, `  Local:    ${d.toString()}`, `  Relative: ${rel === "just now" ? rel : diff < 0 ? rel + " ago" : "in " + rel}`].join("\n");
}

export const OPS: Record<OpName, OpDef> = {
  "case-converter": {
    sample: "the quick brown fox jumps over the lazy dog. it was a sunny day!", placeholder: "Type or paste your text",
    modes: [{ id: "upper", label: "UPPER CASE" }, { id: "lower", label: "lower case" }, { id: "title", label: "Title Case" }, { id: "sentence", label: "Sentence case" }, { id: "camel", label: "camelCase" }, { id: "pascal", label: "PascalCase" }, { id: "snake", label: "snake_case" }, { id: "kebab", label: "kebab-case" }, { id: "constant", label: "CONSTANT_CASE" }],
    run: (s, m) => {
      switch (m) {
        case "upper": return s.toUpperCase();
        case "lower": return s.toLowerCase();
        case "title": return s.toLowerCase().replace(/(^|[\s(["'\-—])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
        case "sentence": return s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
        case "camel": return words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join("");
        case "pascal": return words(s).map(cap).join("");
        case "snake": return words(s).map((w) => w.toLowerCase()).join("_");
        case "kebab": return words(s).map((w) => w.toLowerCase()).join("-");
        default: return words(s).map((w) => w.toUpperCase()).join("_");
      }
    },
  },
  "dedupe-lines": {
    sample: "apple\nbanana\nApple\ncherry\nbanana\n\ncherry", placeholder: "One item per line",
    modes: [{ id: "exact", label: "Case-sensitive" }, { id: "ignore", label: "Ignore case" }, { id: "trim", label: "Ignore case + spaces" }],
    run: (s, m) => {
      const seen = new Set<string>();
      return s.split(/\r?\n/).filter((l) => {
        const k = m === "exact" ? l : m === "ignore" ? l.toLowerCase() : l.trim().replace(/\s+/g, " ").toLowerCase();
        if (k === "" ) return true;
        if (seen.has(k)) return false; seen.add(k); return true;
      }).join("\n");
    },
  },
  "sort-lines": {
    sample: "pear\nApple\nbanana\n10\n2\ncherry", placeholder: "One item per line",
    modes: [{ id: "az", label: "A → Z" }, { id: "za", label: "Z → A" }, { id: "num", label: "Numeric" }, { id: "len", label: "By length" }, { id: "rev", label: "Reverse order" }, { id: "shuffle", label: "Shuffle" }],
    run: (s, m) => {
      const l = s.split(/\r?\n/);
      const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base", numeric: false });
      if (m === "az") return l.sort(cmp).join("\n");
      if (m === "za") return l.sort((a, b) => cmp(b, a)).join("\n");
      if (m === "num") return l.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join("\n");
      if (m === "len") return l.sort((a, b) => a.length - b.length).join("\n");
      if (m === "rev") return l.reverse().join("\n");
      for (let i = l.length - 1; i > 0; i--) { const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; }
      return l.join("\n");
    },
  },
  "remove-line-breaks": {
    sample: "This sentence was copied\nfrom a PDF and is broken\nacross several lines.\n\nThis is a second paragraph\nthat also wraps.", placeholder: "Paste text with unwanted line breaks",
    modes: [{ id: "space", label: "Replace with space" }, { id: "para", label: "Keep paragraphs" }, { id: "none", label: "Remove completely" }, { id: "comma", label: "Join with comma" }],
    run: (s, m) => {
      const t = s.replace(/\r\n?/g, "\n");
      if (m === "para") return t.split(/\n{2,}/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).join("\n\n");
      if (m === "none") return t.replace(/\n+/g, "");
      if (m === "comma") return t.split("\n").map((x) => x.trim()).filter(Boolean).join(", ");
      return t.replace(/\s*\n+\s*/g, " ").trim();
    },
  },
  "find-replace": {
    sample: "Hello world, hello everyone.\nHello again!", placeholder: "Text to search in",
    modes: [{ id: "ci", label: "Ignore case" }, { id: "text", label: "Match case" }, { id: "regex", label: "Regular expression" }],
    fields: [{ id: "find", label: "Find", placeholder: "hello", value: "hello" }, { id: "rep", label: "Replace with", placeholder: "hi", value: "hi" }],
    run: (s, m, f) => {
      const find = f.find ?? "", rep = f.rep ?? "";
      if (!find) return s;
      const src = m === "regex" ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let re: RegExp;
      try { re = new RegExp(src, m === "text" ? "g" : "gi"); } catch (e) { throw new Error("Invalid regular expression: " + (e as Error).message); }
      return m === "regex" ? s.replace(re, rep) : s.replace(re, () => rep);
    },
  },
  slug: {
    sample: "How to Make the Best Café Latte (2026 Guide)!", placeholder: "Title or phrase",
    modes: [{ id: "-", label: "hyphens-like-this" }, { id: "_", label: "underscores_like_this" }],
    run: (s, m) => s.split(/\r?\n/).map((l) => l.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, m).replace(new RegExp(`^\\${m}+|\\${m}+$`, "g"), "")).join("\n"),
  },
  "text-binary": {
    sample: "Hello", placeholder: "Text, or 8-bit binary groups to decode",
    modes: [{ id: "enc", label: "Text → binary" }, { id: "dec", label: "Binary → text" }],
    run: (s, m) => {
      if (m === "enc") return [...utf8(s)].map((b) => b.toString(2).padStart(8, "0")).join(" ");
      const bits = s.replace(/[^01]/g, "");
      if (!bits) return "";
      if (bits.length % 8) throw new Error("Binary must come in groups of 8 bits (one byte each).");
      try { return fromUtf8(Uint8Array.from(bits.match(/.{8}/g)!, (b) => parseInt(b, 2))); } catch { throw new Error("Those bytes are not valid UTF-8 text."); }
    },
  },
  "text-hex": {
    sample: "Hello, World!", placeholder: "Text, or hex bytes to decode",
    modes: [{ id: "enc", label: "Text → hex" }, { id: "encu", label: "Text → HEX (upper)" }, { id: "dec", label: "Hex → text" }],
    run: (s, m) => {
      if (m !== "dec") { const h = [...utf8(s)].map((b) => b.toString(16).padStart(2, "0")).join(" "); return m === "encu" ? h.toUpperCase() : h; }
      const h = s.replace(/0x/gi, "").replace(/[\s,:]+/g, "");
      if (!h) return "";
      if (!/^[0-9a-f]+$/i.test(h) || h.length % 2) throw new Error("Hex must be pairs of 0-9 and a-f characters.");
      try { return fromUtf8(Uint8Array.from(h.match(/../g)!, (x) => parseInt(x, 16))); } catch { throw new Error("Those bytes are not valid UTF-8 text."); }
    },
  },
  morse: {
    sample: "SOS help is on the way", placeholder: "Text, or Morse using . and - (letters spaced, words separated by /)",
    modes: [{ id: "enc", label: "Text → Morse" }, { id: "dec", label: "Morse → text" }],
    run: (s, m) => {
      if (m === "enc") return s.toLowerCase().split(/\r?\n/).map((l) => l.split(/\s+/).filter(Boolean).map((w) => [...w].map((c) => MORSE[c] ?? "").filter(Boolean).join(" ")).join(" / ")).join("\n");
      return s.split(/\r?\n/).map((l) => l.trim().split(/\s*\/\s*|\s{3,}/).map((w) => w.split(/\s+/).filter(Boolean).map((c) => MORSE_REV[c.replace(/[·•]/g, ".").replace(/[–—−]/g, "-")] ?? "?").join("")).join(" ")).join("\n").toUpperCase();
    },
  },
  "reverse-text": {
    sample: "Hello world\nSecond line", placeholder: "Text to reverse",
    modes: [{ id: "chars", label: "Reverse characters" }, { id: "words", label: "Reverse word order" }, { id: "wordchars", label: "Reverse each word" }, { id: "lines", label: "Reverse line order" }],
    run: (s, m) => {
      const rc = (t: string) => Array.from(t).reverse().join("");
      if (m === "chars") return rc(s);
      if (m === "lines") return s.split(/\r?\n/).reverse().join("\n");
      if (m === "words") return s.split(/\r?\n/).map((l) => l.split(/\s+/).filter(Boolean).reverse().join(" ")).join("\n");
      return s.replace(/\S+/g, rc);
    },
  },
  "clean-spaces": {
    sample: "  Too   many    spaces   here  \n\n\n\n  and   blank  lines.​  ", placeholder: "Paste messy text",
    modes: [{ id: "extra", label: "Collapse extra spaces" }, { id: "trim", label: "Trim each line" }, { id: "blank", label: "Remove blank lines" }, { id: "invisible", label: "Strip invisible chars" }, { id: "all", label: "Remove all whitespace" }, { id: "full", label: "Full clean-up" }],
    run: (s, m) => {
      const inv = (t: string) => t.replace(/[​-‍⁠﻿­]/g, "").replace(/[  -   　]/g, " ");
      const extra = (t: string) => t.split("\n").map((l) => l.replace(/[ \t]{2,}/g, " ")).join("\n");
      const trim = (t: string) => t.split("\n").map((l) => l.trim()).join("\n");
      const blank = (t: string) => t.split("\n").filter((l) => l.trim()).join("\n");
      const t = s.replace(/\r\n?/g, "\n");
      switch (m) {
        case "extra": return extra(t);
        case "trim": return trim(t);
        case "blank": return blank(t);
        case "invisible": return inv(t);
        case "all": return inv(t).replace(/\s+/g, "");
        default: return blank(trim(extra(inv(t))));
      }
    },
  },
  base64: {
    sample: "Hello, Prompts & Tools! ✓", placeholder: "Text to encode, or Base64 to decode",
    modes: [{ id: "enc", label: "Encode" }, { id: "encu", label: "Encode (URL-safe)" }, { id: "dec", label: "Decode" }],
    run: (s, m) => (m === "dec" ? b64decode(s) : b64encode(s, m === "encu")),
  },
  "url-codec": {
    sample: "https://example.com/search?q=cafés & tea&lang=en", placeholder: "Text or URL",
    modes: [{ id: "encc", label: "Encode component" }, { id: "encu", label: "Encode full URL" }, { id: "dec", label: "Decode" }],
    run: (s, m) => {
      try { return m === "encc" ? encodeURIComponent(s) : m === "encu" ? encodeURI(s) : decodeURIComponent(s.replace(/\+/g, " ")); }
      catch { throw new Error("The input contains an invalid percent-encoded sequence."); }
    },
  },
  "html-entities": {
    sample: '<a href="/pricing?plan=pro&ref=blog">Tom & Jerry\'s "Deal"</a>', placeholder: "HTML or text",
    modes: [{ id: "enc", label: "Encode" }, { id: "encall", label: "Encode (+ non-ASCII)" }, { id: "dec", label: "Decode" }],
    run: (s, m) => {
      if (m === "dec") return new DOMParser().parseFromString(s, "text/html").documentElement.textContent ?? "";
      let r = s.replace(/[&<>"']/g, (c) => ENTITIES[c]);
      if (m === "encall") r = Array.from(r).map((c) => (c.codePointAt(0)! > 126 ? `&#${c.codePointAt(0)};` : c)).join("");
      return r;
    },
  },
  "csv-json": {
    sample: "name,age,city\nAnna,31,Berlin\n\"Smith, John\",45,\"New York\"", placeholder: "Paste CSV with a header row", outLabel: "JSON", file: "data.json",
    modes: [{ id: "comma", label: "Comma" }, { id: "semicolon", label: "Semicolon" }, { id: "tab", label: "Tab" }, { id: "pipe", label: "Pipe" }],
    run: csvToJson,
  },
  "json-csv": {
    sample: '[{"name":"Anna","age":31,"city":"Berlin"},{"name":"Smith, John","age":45,"city":"New York"}]', placeholder: "Paste a JSON array of objects", outLabel: "CSV", file: "data.csv",
    modes: [{ id: "comma", label: "Comma" }, { id: "semicolon", label: "Semicolon" }, { id: "tab", label: "Tab" }],
    run: (s, m) => { try { return jsonToCsv(s, m); } catch (e) { throw e instanceof SyntaxError ? new Error("Invalid JSON: " + e.message) : e; } },
  },
  "json-yaml": {
    sample: '{"name":"app","version":"1.2.0","ports":[80,443],"db":{"host":"localhost","ssl":true},"tags":[]}', placeholder: "Paste JSON", outLabel: "YAML", file: "data.yaml",
    run: (s) => { try { return toYaml(JSON.parse(s)); } catch (e) { throw e instanceof SyntaxError ? new Error("Invalid JSON: " + e.message) : e; } },
  },
  "xml-format": {
    sample: '<?xml version="1.0"?><catalog><book id="1"><title>Intro</title><price>9.99</price></book><book id="2"><title>Advanced</title></book></catalog>', placeholder: "Paste XML", file: "formatted.xml",
    modes: [{ id: "format", label: "Format" }, { id: "minify", label: "Minify" }],
    run: xmlFormat,
  },
  "sql-format": {
    sample: "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = 1 and u.created_at > '2025-01-01' group by u.id, u.name order by orders desc limit 10", placeholder: "Paste a SQL query", file: "query.sql",
    modes: [{ id: "format", label: "Format + UPPERCASE keywords" }, { id: "format-keep", label: "Format, keep case" }, { id: "minify", label: "Minify" }],
    run: sqlFormat,
  },
  jwt: {
    sample: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature_not_checked", placeholder: "Paste a JWT", outLabel: "Decoded token",
    run: jwtDecode,
  },
  cron: {
    sample: "*/15 9-17 * * 1-5", placeholder: "e.g. 0 2 * * *", inLabel: "Cron expression (5 fields)", outLabel: "Meaning",
    run: cronExplain,
  },
  timestamp: {
    sample: "1700000000\n1700000000000\n2026-01-01T12:00:00Z", placeholder: "Unix timestamps (seconds or milliseconds) or dates, one per line", outLabel: "Converted",
    run: (s) => s.split(/\r?\n/).map(tsLine).filter(Boolean).join("\n\n"),
  },
};

export const OP_NAMES = Object.keys(OPS) as OpName[];
