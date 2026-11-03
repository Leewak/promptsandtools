// Pure calculation helpers for the calculator tools (no React, easy to verify).

export const pmt = (principal: number, annualPct: number, months: number) => {
  const r = annualPct / 1200;
  if (months <= 0) return NaN;
  return r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
};

/** Future value with a lump sum plus monthly deposits (end of month). `freq` = compounding periods per year. */
export const compound = (principal: number, annualPct: number, years: number, freq: number, monthly: number) => {
  const rp = annualPct / 100 / freq;
  const growth = Math.pow(1 + rp, freq * years);
  const i = Math.pow(1 + rp, freq / 12) - 1; // equivalent monthly rate
  const months = Math.round(years * 12);
  const fvDeposits = i === 0 ? monthly * months : monthly * ((Math.pow(1 + i, months) - 1) / i);
  const fv = principal * growth + fvDeposits;
  const contributed = principal + monthly * months;
  return { fv, contributed, interest: fv - contributed };
};

export const savingsMonthly = (goal: number, start: number, annualPct: number, months: number) => {
  const i = annualPct / 1200;
  if (months <= 0) return NaN;
  if (i === 0) return (goal - start) / months;
  const g = Math.pow(1 + i, months);
  return ((goal - start * g) * i) / (g - 1);
};

export const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

export const bmi = (kg: number, m: number) => kg / (m * m);
export const bmiBand = (b: number) => (b < 18.5 ? "Underweight" : b < 25 ? "Normal weight" : b < 30 ? "Overweight" : "Obesity");
export const mifflin = (kg: number, cm: number, age: number, sex: "male" | "female") => 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);

// ----- dates (UTC day arithmetic, so DST never shifts a day) -----
export const parseYmd = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 ? d : null;
};
export const ymd = (d: Date) => d.toISOString().slice(0, 10);
export const todayYmd = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`; };
export const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);
const dim = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

/** Calendar difference a -> b (a <= b) as years, months, days. */
export const ymdDiff = (a: Date, b: Date) => {
  let y = b.getUTCFullYear() - a.getUTCFullYear();
  let m = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) { m -= 1; d += dim(b.getUTCFullYear(), b.getUTCMonth() - 1); }
  if (m < 0) { y -= 1; m += 12; }
  return { y, m, d };
};
export const addMonths = (d: Date, n: number) => {
  const t = d.getUTCFullYear() * 12 + d.getUTCMonth() + n;
  const y = Math.floor(t / 12), mo = ((t % 12) + 12) % 12;
  return new Date(Date.UTC(y, mo, Math.min(d.getUTCDate(), dim(y, mo))));
};
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
export const weekdaysBetween = (a: Date, b: Date) => { // counts Mon-Fri in [a, b)
  let c = 0;
  for (let t = a.getTime(); t < b.getTime(); t += 86400000) { const w = new Date(t).getUTCDay(); if (w !== 0 && w !== 6) c++; }
  return c;
};
export const longDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// ----- time zones -----
const tzParts = (zone: string, t: number) => {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const o: Record<string, number> = {};
  for (const p of f.formatToParts(new Date(t))) if (p.type !== "literal") o[p.type] = +p.value;
  return Date.UTC(o.year, o.month - 1, o.day, o.hour % 24, o.minute, o.second);
};
/** Offset (ms) of `zone` from UTC at instant t. */
export const tzOffset = (zone: string, t: number) => tzParts(zone, Math.floor(t / 1000) * 1000) - Math.floor(t / 1000) * 1000;
/** Instant (ms) for a wall-clock time "YYYY-MM-DDTHH:mm" in `zone`. */
export const zonedToInstant = (local: string, zone: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) return NaN;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  let t = wall - tzOffset(zone, wall);
  t = wall - tzOffset(zone, t);
  return t;
};
export const fmtInZone = (t: number, zone: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(t));

// ----- romans / words -----
const ROMAN: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
export const toRoman = (n: number) => { let s = ""; for (const [v, r] of ROMAN) while (n >= v) { s += r; n -= v; } return s; };
export const fromRoman = (s: string): number | null => {
  const t = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(t)) return null;
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let n = 0;
  for (let i = 0; i < t.length; i++) { const a = val[t[i]], b = val[t[i + 1]] ?? 0; n += a < b ? -a : a; }
  return n >= 1 && n <= 3999 && toRoman(n) === t ? n : null; // reject non-canonical forms like IIII
};

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
const below1000 = (n: number): string => {
  const h = Math.floor(n / 100), r = n % 100, out: string[] = [];
  if (h) out.push(`${ONES[h]} hundred`);
  if (r) out.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ""));
  return out.join(" ");
};
/** Whole-number string (digits only) to English words. */
export const intToWords = (digits: string): string => {
  const s = digits.replace(/^0+(?=\d)/, "");
  if (s === "0") return "zero";
  const groups: string[] = [];
  for (let i = s.length; i > 0; i -= 3) groups.unshift(s.slice(Math.max(0, i - 3), i));
  if (groups.length > SCALES.length) return "";
  const out: string[] = [];
  groups.forEach((g, i) => { const v = +g; if (v) out.push(`${below1000(v)}${SCALES[groups.length - 1 - i] ? " " + SCALES[groups.length - 1 - i] : ""}`); });
  return out.join(" ");
};

// ----- safe expression evaluator (no eval) -----
export const evalExpr = (src: string): number => {
  const s = src.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/\s+/g, "").toLowerCase();
  let i = 0;
  const fn: Record<string, (x: number) => number> = { sqrt: Math.sqrt, sin: (x) => Math.sin((x * Math.PI) / 180), cos: (x) => Math.cos((x * Math.PI) / 180), tan: (x) => Math.tan((x * Math.PI) / 180), ln: Math.log, log: Math.log10, abs: Math.abs };
  const expr = (): number => { let v = term(); while (s[i] === "+" || s[i] === "-") { const op = s[i++]; const r = term(); v = op === "+" ? v + r : v - r; } return v; };
  const term = (): number => { let v = unary(); while (s[i] === "*" || s[i] === "/") { const op = s[i++]; const r = unary(); v = op === "*" ? v * r : v / r; } return v; };
  const unary = (): number => { if (s[i] === "-") { i++; return -unary(); } if (s[i] === "+") { i++; return unary(); } return pow(); };
  const pow = (): number => { const b = postfix(); if (s[i] === "^") { i++; return Math.pow(b, unary()); } return b; };
  const postfix = (): number => { let v = atom(); while (s[i] === "%") { i++; v /= 100; } return v; };
  const atom = (): number => {
    if (s[i] === "(") { i++; const v = expr(); if (s[i] !== ")") throw new Error("Missing )"); i++; return v; }
    const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i));
    if (m) { i += m[0].length; return parseFloat(m[0]); }
    const w = /^[a-z]+/.exec(s.slice(i));
    if (w) {
      i += w[0].length;
      if (w[0] === "pi") return Math.PI;
      if (w[0] === "e") return Math.E;
      const f = fn[w[0]];
      if (!f) throw new Error(`Unknown: ${w[0]}`);
      if (s[i] !== "(") throw new Error("Expected (");
      i++; const v = expr(); if (s[i] !== ")") throw new Error("Missing )"); i++;
      return f(v);
    }
    throw new Error("Unexpected input");
  };
  if (!s) return NaN;
  const v = expr();
  if (i < s.length) throw new Error("Unexpected input");
  return v;
};

// ----- unit conversion -----
export interface Unit { id: string; name: string; sym: string; f: number } // f = size of 1 unit in the base unit
export const UNIT_SETS: Record<string, { title: string; base: string; units: Unit[] }> = {
  length: { title: "Length", base: "metre", units: [
    { id: "mm", name: "Millimetres", sym: "mm", f: 0.001 }, { id: "cm", name: "Centimetres", sym: "cm", f: 0.01 }, { id: "m", name: "Metres", sym: "m", f: 1 }, { id: "km", name: "Kilometres", sym: "km", f: 1000 },
    { id: "in", name: "Inches", sym: "in", f: 0.0254 }, { id: "ft", name: "Feet", sym: "ft", f: 0.3048 }, { id: "yd", name: "Yards", sym: "yd", f: 0.9144 }, { id: "mi", name: "Miles", sym: "mi", f: 1609.344 }, { id: "nmi", name: "Nautical miles", sym: "nmi", f: 1852 } ] },
  weight: { title: "Weight", base: "kilogram", units: [
    { id: "mg", name: "Milligrams", sym: "mg", f: 1e-6 }, { id: "g", name: "Grams", sym: "g", f: 0.001 }, { id: "kg", name: "Kilograms", sym: "kg", f: 1 }, { id: "t", name: "Metric tonnes", sym: "t", f: 1000 },
    { id: "oz", name: "Ounces", sym: "oz", f: 0.028349523125 }, { id: "lb", name: "Pounds", sym: "lb", f: 0.45359237 }, { id: "st", name: "Stone", sym: "st", f: 6.35029318 } ] },
  volume: { title: "Volume", base: "litre", units: [
    { id: "ml", name: "Millilitres", sym: "ml", f: 0.001 }, { id: "l", name: "Litres", sym: "L", f: 1 }, { id: "tsp", name: "Teaspoons (US)", sym: "tsp", f: 0.00492892159375 }, { id: "tbsp", name: "Tablespoons (US)", sym: "tbsp", f: 0.01478676478125 },
    { id: "floz", name: "Fluid ounces (US)", sym: "fl oz", f: 0.0295735295625 }, { id: "cup", name: "Cups (US)", sym: "cup", f: 0.2365882365 }, { id: "pt", name: "Pints (US)", sym: "pt", f: 0.473176473 },
    { id: "qt", name: "Quarts (US)", sym: "qt", f: 0.946352946 }, { id: "gal", name: "Gallons (US)", sym: "gal", f: 3.785411784 }, { id: "m3", name: "Cubic metres", sym: "m³", f: 1000 } ] },
  area: { title: "Area", base: "square metre", units: [
    { id: "cm2", name: "Square centimetres", sym: "cm²", f: 1e-4 }, { id: "m2", name: "Square metres", sym: "m²", f: 1 }, { id: "km2", name: "Square kilometres", sym: "km²", f: 1e6 }, { id: "ha", name: "Hectares", sym: "ha", f: 1e4 },
    { id: "in2", name: "Square inches", sym: "in²", f: 0.00064516 }, { id: "ft2", name: "Square feet", sym: "ft²", f: 0.09290304 }, { id: "yd2", name: "Square yards", sym: "yd²", f: 0.83612736 }, { id: "ac", name: "Acres", sym: "ac", f: 4046.8564224 }, { id: "mi2", name: "Square miles", sym: "mi²", f: 2589988.110336 } ] },
  speed: { title: "Speed", base: "metre per second", units: [
    { id: "ms", name: "Metres per second", sym: "m/s", f: 1 }, { id: "kmh", name: "Kilometres per hour", sym: "km/h", f: 1 / 3.6 }, { id: "mph", name: "Miles per hour", sym: "mph", f: 0.44704 },
    { id: "kn", name: "Knots", sym: "kn", f: 1852 / 3600 }, { id: "fts", name: "Feet per second", sym: "ft/s", f: 0.3048 } ] },
  data: { title: "Data size", base: "byte", units: [
    { id: "bit", name: "Bits", sym: "bit", f: 0.125 }, { id: "B", name: "Bytes", sym: "B", f: 1 }, { id: "KB", name: "Kilobytes (1,000 B)", sym: "KB", f: 1e3 }, { id: "MB", name: "Megabytes (1,000 KB)", sym: "MB", f: 1e6 },
    { id: "GB", name: "Gigabytes (1,000 MB)", sym: "GB", f: 1e9 }, { id: "TB", name: "Terabytes (1,000 GB)", sym: "TB", f: 1e12 },
    { id: "KiB", name: "Kibibytes (1,024 B)", sym: "KiB", f: 1024 }, { id: "MiB", name: "Mebibytes", sym: "MiB", f: 1024 ** 2 }, { id: "GiB", name: "Gibibytes", sym: "GiB", f: 1024 ** 3 }, { id: "TiB", name: "Tebibytes", sym: "TiB", f: 1024 ** 4 } ] },
  temperature: { title: "Temperature", base: "kelvin", units: [
    { id: "C", name: "Celsius", sym: "°C", f: 1 }, { id: "F", name: "Fahrenheit", sym: "°F", f: 1 }, { id: "K", name: "Kelvin", sym: "K", f: 1 } ] },
};
export const convertTemp = (v: number, from: string, to: string) => {
  const c = from === "C" ? v : from === "F" ? ((v - 32) * 5) / 9 : v - 273.15;
  return to === "C" ? c : to === "F" ? (c * 9) / 5 + 32 : c + 273.15;
};
export const convertUnit = (cat: string, v: number, from: string, to: string) => {
  if (cat === "temperature") return convertTemp(v, from, to);
  const u = UNIT_SETS[cat].units;
  const a = u.find((x) => x.id === from), b = u.find((x) => x.id === to);
  return a && b ? (v * a.f) / b.f : NaN;
};
/** Approximate grams per US cup (240 ml is NOT used: US cup = 236.588 ml). Typical values from common baking references. */
export const INGREDIENTS: { id: string; name: string; gPerCup: number }[] = [
  { id: "water", name: "Water / milk (approx.)", gPerCup: 237 }, { id: "flour", name: "All-purpose flour", gPerCup: 125 }, { id: "sugar", name: "Granulated sugar", gPerCup: 200 }, { id: "brown", name: "Brown sugar (packed)", gPerCup: 213 },
  { id: "icing", name: "Powdered sugar", gPerCup: 120 }, { id: "butter", name: "Butter", gPerCup: 227 }, { id: "oil", name: "Vegetable oil", gPerCup: 218 }, { id: "honey", name: "Honey", gPerCup: 340 },
  { id: "rice", name: "Uncooked white rice", gPerCup: 185 }, { id: "oats", name: "Rolled oats", gPerCup: 90 }, { id: "cocoa", name: "Cocoa powder", gPerCup: 85 }, { id: "salt", name: "Table salt", gPerCup: 288 },
];
