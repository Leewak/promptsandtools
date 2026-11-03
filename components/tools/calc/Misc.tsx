"use client";

import { useState } from "react";
import { Button, Panel, Segmented } from "../ui";
import { evalExpr, fromRoman, gcd, intToWords, toRoman } from "./math";
import { Disclaimer, Formula, Grid, Num, Out, Sel, Stack, Txt, plain, toNum } from "./shared";

export function Percent() {
  const [a1, setA1] = useState("20"), [b1, setB1] = useState("150");
  const [a2, setA2] = useState("30"), [b2, setB2] = useState("150");
  const [a3, setA3] = useState("80"), [b3, setB3] = useState("100");
  const [a4, setA4] = useState("200"), [b4, setB4] = useState("15"), [dir, setDir] = useState<"Increase" | "Decrease">("Increase");
  const r1 = (toNum(a1) / 100) * toNum(b1), r2 = (toNum(a2) / toNum(b2)) * 100, r3 = ((toNum(b3) - toNum(a3)) / Math.abs(toNum(a3))) * 100;
  const r4 = toNum(a4) * (1 + ((dir === "Increase" ? 1 : -1) * toNum(b4)) / 100);
  const H = ({ children }: { children: string }) => <p className="text-sm font-semibold" style={{ color: "#E8EAF6" }}>{children}</p>;
  return (
    <Panel><Stack>
      <H>1. What is X% of Y?</H>
      <Grid><Num label="Percentage (X)" value={a1} onChange={setA1} /><Num label="Of the number (Y)" value={b1} onChange={setB1} /></Grid>
      <Out rows={Number.isFinite(r1) ? [[`${plain(toNum(a1))}% of ${plain(toNum(b1))}`, plain(r1, 6)]] : []} />
      <H>2. X is what percent of Y?</H>
      <Grid><Num label="Number (X)" value={a2} onChange={setA2} /><Num label="Total (Y)" value={b2} onChange={setB2} /></Grid>
      <Out rows={Number.isFinite(r2) && toNum(b2) !== 0 ? [[`${plain(toNum(a2))} is`, `${plain(r2, 6)}% of ${plain(toNum(b2))}`]] : []} />
      <H>3. Percentage change from X to Y</H>
      <Grid><Num label="From (old value)" value={a3} onChange={setA3} /><Num label="To (new value)" value={b3} onChange={setB3} /></Grid>
      <Out rows={Number.isFinite(r3) && toNum(a3) !== 0 ? [[r3 >= 0 ? "Increase of" : "Decrease of", `${plain(Math.abs(r3), 6)}%`]] : []} />
      <H>4. Increase or decrease a number by a percentage</H>
      <Segmented options={["Increase", "Decrease"] as const} value={dir} onChange={setDir} />
      <Grid><Num label="Number" value={a4} onChange={setA4} /><Num label="By (%)" value={b4} onChange={setB4} /></Grid>
      <Out rows={Number.isFinite(r4) ? [["Result", plain(r4, 6)]] : []} />
      <Formula>X% of Y = X ÷ 100 × Y · X is ?% of Y = X ÷ Y × 100 · Change = (new − old) ÷ |old| × 100 · Result = number × (1 ± %/100)</Formula>
    </Stack></Panel>
  );
}

export function Average() {
  const [txt, setTxt] = useState("4, 8, 15, 16, 23, 42, 8");
  const nums = (txt.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? []).map(Number).filter(Number.isFinite);
  let rows: [string, string][] = [];
  if (nums.length) {
    const s = [...nums].sort((a, b) => a - b), sum = nums.reduce((a, b) => a + b, 0), n = s.length;
    const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    const cnt = new Map<number, number>(); nums.forEach((x) => cnt.set(x, (cnt.get(x) ?? 0) + 1));
    const mx = Math.max(...cnt.values());
    const mode = mx === 1 ? "No mode (all values appear once)" : [...cnt].filter(([, c]) => c === mx).map(([v]) => v).sort((a, b) => a - b).join(", ");
    rows = [["Mean (average)", plain(sum / n, 6)], ["Median", plain(median, 6)], ["Mode", mode], ["Sum", plain(sum, 6)], ["Count", String(n)], ["Smallest / largest", `${plain(s[0], 6)} / ${plain(s[n - 1], 6)}`], ["Range", plain(s[n - 1] - s[0], 6)]];
  }
  return (
    <Panel><Stack>
      <label className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>Numbers (separated by commas, spaces or new lines)
        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={4} className="rounded-lg px-3 py-2.5 text-sm text-[#E8EAF6] font-mono" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }} /></label>
      <Out rows={rows} />
      <Formula>Mean = sum ÷ count · Median = middle value of the sorted list (average of the two middle values if the count is even) · Mode = most frequent value(s).</Formula>
    </Stack></Panel>
  );
}

const randInt = (min: number, max: number) => { // unbiased integer in [min, max]
  const range = max - min + 1, lim = Math.floor(0x100000000 / range) * range, buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return min + (buf[0] % range);
};
export function Random() {
  const [min, setMin] = useState("1"), [max, setMax] = useState("100"), [count, setCount] = useState("1"), [uniq, setUniq] = useState(false), [dec, setDec] = useState(false);
  const [res, setRes] = useState<string[]>([]), [err, setErr] = useState("");
  const go = () => {
    const a = toNum(min), b = toNum(max), c = Math.round(toNum(count));
    setErr("");
    if (!Number.isFinite(a) || !Number.isFinite(b) || a > b) return setErr("Enter a minimum that is not larger than the maximum.");
    if (!(c >= 1 && c <= 1000)) return setErr("Choose between 1 and 1000 numbers.");
    if (dec) { const buf = new Uint32Array(c); crypto.getRandomValues(buf); return setRes([...buf].map((u) => (a + (u / 0x100000000) * (b - a)).toFixed(2))); }
    const lo = Math.ceil(a), hi = Math.floor(b);
    if (hi < lo) return setErr("There is no whole number in that range.");
    if (uniq && c > hi - lo + 1) return setErr(`Only ${hi - lo + 1} different whole numbers exist in that range.`);
    const out: number[] = [], seen = new Set<number>();
    while (out.length < c) { const x = randInt(lo, hi); if (uniq && seen.has(x)) continue; seen.add(x); out.push(x); }
    setRes(out.map(String));
  };
  return (
    <Panel><Stack>
      <Grid cols={3}><Num label="Minimum" value={min} onChange={setMin} /><Num label="Maximum" value={max} onChange={setMax} /><Num label="How many numbers" value={count} onChange={setCount} step="1" min={1} /></Grid>
      <div className="flex flex-wrap gap-5">
        <label className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={uniq} onChange={(e) => setUniq(e.target.checked)} /> No repeats</label>
        <label className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={dec} onChange={(e) => setDec(e.target.checked)} /> Decimals (2 places)</label>
      </div>
      <div><Button onClick={go}>Generate</Button></div>
      {err && <p className="text-sm" style={{ color: "#F87171" }}>{err}</p>}
      {res.length > 0 && <div className="rounded-xl p-4 break-words" style={{ background: "#0C0D22", border: "1px solid #23264A" }}><p data-result="numbers" className={res.length === 1 ? "text-4xl font-bold" : "text-lg"} style={{ color: "#34D399", fontFamily: "var(--font-mono)" }}>{res.join(", ")}</p></div>}
      <Disclaimer>Uses your browser&apos;s secure random generator (Web Crypto) without modulo bias. Not for gambling or lotteries run for money.</Disclaimer>
    </Stack></Panel>
  );
}

export function Dice() {
  const [n, setN] = useState("2"), [sides, setSides] = useState("6");
  const [rolls, setRolls] = useState<number[]>([]);
  const roll = () => { const c = Math.min(20, Math.max(1, Math.round(toNum(n) || 1))); setRolls(Array.from({ length: c }, () => randInt(1, +sides))); };
  return (
    <Panel><Stack>
      <Grid><Num label="Number of dice (1-20)" value={n} onChange={setN} step="1" min={1} /><Sel label="Sides per die" value={sides} onChange={setSides} options={["4", "6", "8", "10", "12", "20", "100"].map((s): [string, string] => [s, `d${s}`])} /></Grid>
      <div><Button onClick={roll}>Roll the dice</Button></div>
      {rolls.length > 0 && (
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#0C0D22", border: "1px solid #23264A" }}>
          <div className="flex flex-wrap gap-2">{rolls.map((r, i) => <span key={i} data-die className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-lg font-bold" style={{ background: "#181B3A", color: "#E8EAF6", border: "1px solid #34396B", fontFamily: "var(--font-mono)" }}>{r}</span>)}</div>
          <p className="text-sm" style={{ color: "#9CA1C9" }}>Total <span data-result="Total" className="text-2xl font-bold" style={{ color: "#34D399", fontFamily: "var(--font-mono)" }}>{rolls.reduce((a, b) => a + b, 0)}</span></p>
        </div>
      )}
      <Disclaimer>Each roll is independent and fair, using your browser&apos;s secure random generator.</Disclaimer>
    </Stack></Panel>
  );
}

const frac = (s: string): [number, number] | null => {
  const m = /^\s*(-?\d+)(?:\s*\/\s*(\d+))?\s*$/.exec(s);
  if (!m) return null;
  const d = m[2] ? +m[2] : 1;
  return d === 0 ? null : [+m[1], d];
};
export function Fraction() {
  const [a, setA] = useState("1/2"), [b, setB] = useState("1/3"), [op, setOp] = useState("+");
  const x = frac(a), y = frac(b);
  let rows: [string, string][] = [], err = "";
  if (x && y) {
    let n: number, d: number;
    if (op === "+") { n = x[0] * y[1] + y[0] * x[1]; d = x[1] * y[1]; }
    else if (op === "-") { n = x[0] * y[1] - y[0] * x[1]; d = x[1] * y[1]; }
    else if (op === "×") { n = x[0] * y[0]; d = x[1] * y[1]; }
    else { n = x[0] * y[1]; d = x[1] * y[0]; }
    if (d === 0) err = "Cannot divide by zero.";
    else {
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d) || 1, sn = n / g, sd = d / g, whole = Math.trunc(sn / sd), rem = Math.abs(sn) % sd;
      rows = [["Result (simplified)", sd === 1 ? String(sn) : `${sn}/${sd}`], ["Mixed number", rem === 0 ? String(whole) : whole === 0 ? `${sn}/${sd}` : `${whole} ${rem}/${sd}`], ["Decimal", plain(sn / sd, 8)], ["Before simplifying", `${n}/${d}`]];
    }
  } else err = a.trim() && b.trim() ? "Enter whole numbers or fractions like 3/4." : "";
  return (
    <Panel><Stack>
      <Grid cols={3}><Txt label="First fraction" value={a} onChange={setA} placeholder="1/2" /><Sel label="Operation" value={op} onChange={setOp} options={[["+", "+ add"], ["-", "− subtract"], ["×", "× multiply"], ["÷", "÷ divide"]]} /><Txt label="Second fraction" value={b} onChange={setB} placeholder="1/3" /></Grid>
      {err && <p className="text-sm" style={{ color: "#F87171" }}>{err}</p>}
      <Out rows={rows} />
      <Formula>a/b + c/d = (ad + cb) ÷ bd · a/b × c/d = ac ÷ bd · a/b ÷ c/d = ad ÷ bc. The result is divided by the greatest common divisor to simplify it.</Formula>
    </Stack></Panel>
  );
}

const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "%", "+", "(", ")", "^", "√("];
export function Calculator() {
  const [ex, setEx] = useState("");
  let res = "", err = "";
  if (ex.trim()) { try { const v = evalExpr(ex); res = Number.isFinite(v) ? String(+v.toPrecision(12)) : "Not a number"; } catch (e) { err = (e as Error).message; } }
  return (
    <Panel><Stack>
      <Txt label="Expression" value={ex} onChange={setEx} placeholder="e.g. (12.5 + 7.5) × 3 ÷ 2" />
      <div className="rounded-xl p-4" style={{ background: "#0C0D22", border: "1px solid #23264A" }}>
        <p className="text-sm" style={{ color: "#6E739C" }}>Result</p>
        <p data-result="Result" className="text-3xl font-bold break-all" style={{ color: err ? "#F87171" : "#34D399", fontFamily: "var(--font-mono)" }}>{err ? "…" : res || "0"}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((k) => <button key={k} type="button" onClick={() => setEx(ex + k)} className="py-3 rounded-lg text-lg" style={{ background: "#181B3A", color: "#E8EAF6", border: "1px solid #2A2E55" }}>{k}</button>)}
        <button type="button" onClick={() => setEx(ex.slice(0, -1))} className="py-3 rounded-lg" style={{ background: "#181B3A", color: "#C9CCE8", border: "1px solid #2A2E55" }} aria-label="Backspace">⌫</button>
        <button type="button" onClick={() => setEx("")} className="py-3 rounded-lg col-span-3 font-semibold" style={{ background: "#3B82F6", color: "#fff" }}>Clear</button>
      </div>
      <Formula>Supports + − × ÷ ^ % ( ), pi, e, sqrt, sin, cos, tan (degrees), ln, log, abs. Brackets and powers are evaluated first, then × ÷, then + −.</Formula>
    </Stack></Panel>
  );
}

export function Roman() {
  const [n, setN] = useState("2024"), [r, setR] = useState("MCMXCIV");
  const v = Math.trunc(toNum(n)), okN = v >= 1 && v <= 3999;
  const back = fromRoman(r);
  return (
    <Panel><Stack>
      <p className="text-sm font-semibold" style={{ color: "#E8EAF6" }}>Number to Roman numeral</p>
      <Num label="Number (1-3999)" value={n} onChange={setN} step="1" />
      <Out rows={okN ? [["Roman numeral", toRoman(v)]] : []} />
      <p className="text-sm font-semibold pt-2" style={{ color: "#E8EAF6" }}>Roman numeral to number</p>
      <Txt label="Roman numeral" value={r} onChange={setR} />
      <Out rows={back ? [["Number", String(back)]] : []} />
      {r.trim() && !back && <p className="text-sm" style={{ color: "#F87171" }}>Not a valid Roman numeral between I and MMMCMXCIX.</p>}
      <Formula>I=1 V=5 X=10 L=50 C=100 D=500 M=1000. A smaller symbol before a larger one is subtracted (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900).</Formula>
    </Stack></Panel>
  );
}

export function NumWords() {
  const [v, setV] = useState("1234.56");
  const t = v.trim().replace(/,/g, "");
  const m = /^(-)?(\d+)(?:\.(\d+))?$/.exec(t);
  let rows: [string, string][] = [], note = "";
  if (m) {
    const w = intToWords(m[2]);
    if (!w) note = "That number is too large (limit is just under one sextillion).";
    else {
      const frac = m[3] ? ` point ${m[3].split("").map((c) => intToWords(c)).join(" ")}` : "";
      const words = `${m[1] ? "minus " : ""}${w}${frac}`;
      rows = [["In words", words]];
      const cents = m[3] ? (m[3] + "00").slice(0, 2) : "00";
      if (!m[1]) rows.push(["Cheque style", `${w} and ${cents}/100`]);
      rows.push(["Capitalised", words.charAt(0).toUpperCase() + words.slice(1)]);
    }
  } else if (t) note = "Enter a number such as 1234 or 1234.56.";
  return (
    <Panel><Stack>
      <Txt label="Number" value={v} onChange={setV} placeholder="1234.56" />
      {note && <p className="text-sm" style={{ color: "#F87171" }}>{note}</p>}
      <Out rows={rows} />
      <Formula>The number is split into groups of three digits (thousand, million, billion …) and each group is read as hundreds, tens and ones. Decimals are read digit by digit after &quot;point&quot;.</Formula>
      <Disclaimer>Uses US English scales (billion = 1,000,000,000). For legal cheques, check your bank&apos;s format.</Disclaimer>
    </Stack></Panel>
  );
}
