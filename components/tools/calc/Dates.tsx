"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, Segmented } from "../ui";
import { addDays, addMonths, dayDiff, fmtInZone, longDate, parseYmd, todayYmd, tzOffset, weekdaysBetween, ymd, ymdDiff, zonedToInstant } from "./math";
import { Disclaimer, Formula, Grid, Num, Out, Sel, Stack, Txt, money, plain, toNum } from "./shared";

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function Age() {
  const [dob, setDob] = useState("1990-05-15"), [on, setOn] = useState(todayYmd());
  const a = parseYmd(dob), b = parseYmd(on);
  let rows: [string, string][] = [];
  if (a && b && a <= b) {
    const d = ymdDiff(a, b), total = dayDiff(a, b);
    let next = new Date(Date.UTC(b.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
    if (a.getUTCMonth() === 1 && a.getUTCDate() === 29 && next.getUTCMonth() !== 1) next = new Date(Date.UTC(b.getUTCFullYear(), 1, 28));
    if (next < b) next = new Date(Date.UTC(b.getUTCFullYear() + 1, a.getUTCMonth(), a.getUTCDate()));
    rows = [["Age", `${d.y} years, ${d.m} months, ${d.d} days`], ["Total months", String(d.y * 12 + d.m)], ["Total weeks", String(Math.floor(total / 7))], ["Total days", total.toLocaleString("en-US")], ["Next birthday", `${plural(dayDiff(b, next), "day")} (${longDate(next)})`]];
  }
  return (
    <Panel><Stack>
      <Grid><Txt label="Date of birth" type="date" value={dob} onChange={setDob} /><Txt label="Age at date" type="date" value={on} onChange={setOn} /></Grid>
      <Out rows={rows} />
      {a && b && a > b && <p className="text-sm" style={{ color: "#F87171" }}>The birth date must be before the other date.</p>}
      <Formula>Years and months are counted on the calendar from the birth date; leftover days are counted from the last full month.</Formula>
    </Stack></Panel>
  );
}

export function DateDiff() {
  const [s, setS] = useState("2025-01-01"), [e, setE] = useState("2025-12-25"), [incl, setIncl] = useState(false);
  const a = parseYmd(s), b = parseYmd(e);
  let rows: [string, string][] = [];
  if (a && b) {
    const [x, y] = a <= b ? [a, b] : [b, a];
    const days = dayDiff(x, y) + (incl ? 1 : 0), d = ymdDiff(x, y);
    const end = incl ? addDays(y, 1) : y;
    rows = [["Days between", days.toLocaleString("en-US")], ["Weeks and days", `${Math.floor(days / 7)} weeks, ${days % 7} days`], ["Years, months, days", `${d.y} y, ${d.m} m, ${d.d} d`], ["Weekdays (Mon-Fri)", String(weekdaysBetween(x, end))], ["Hours", (days * 24).toLocaleString("en-US")]];
  }
  return (
    <Panel><Stack>
      <Grid><Txt label="Start date" type="date" value={s} onChange={setS} /><Txt label="End date" type="date" value={e} onChange={setE} /></Grid>
      <label className="text-sm flex gap-2 items-center" style={{ color: "#C9CCE8" }}><input type="checkbox" checked={incl} onChange={(ev) => setIncl(ev.target.checked)} /> Include the end date (count both days)</label>
      <Out rows={rows} />
      <Formula>Days = difference between the two calendar dates. Weekdays count Monday to Friday and ignore public holidays.</Formula>
    </Stack></Panel>
  );
}

export function DateAdd() {
  const [s, setS] = useState(todayYmd()), [n, setN] = useState("30"), [u, setU] = useState("days"), [dir, setDir] = useState<"Add" | "Subtract">("Add");
  const a = parseYmd(s), k = Math.trunc(toNum(n)) * (dir === "Add" ? 1 : -1);
  let rows: [string, string][] = [];
  if (a && Number.isFinite(k)) {
    const r = u === "days" ? addDays(a, k) : u === "weeks" ? addDays(a, k * 7) : u === "months" ? addMonths(a, k) : addMonths(a, k * 12);
    rows = [["Resulting date", longDate(r)], ["In numbers (YYYY-MM-DD)", ymd(r)], ["Days from start", String(dayDiff(a, r))]];
  }
  return (
    <Panel><Stack>
      <Segmented options={["Add", "Subtract"] as const} value={dir} onChange={setDir} />
      <Grid cols={3}><Txt label="Start date" type="date" value={s} onChange={setS} /><Num label="Amount" value={n} onChange={setN} step="1" /><Sel label="Unit" value={u} onChange={setU} options={[["days", "Days"], ["weeks", "Weeks"], ["months", "Months"], ["years", "Years"]]} /></Grid>
      <Out rows={rows} />
      <Formula>Days and weeks are added exactly. Months and years keep the day of the month; if it does not exist (for example 31 + 1 month), the last day of that month is used.</Formula>
    </Stack></Panel>
  );
}

const ZONES: string[] = (() => { try { return (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone"); } catch { return ["UTC"]; } })();
const POPULAR = ["America/Los_Angeles", "America/New_York", "UTC", "Europe/London", "Europe/Paris", "Africa/Casablanca", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"];
const nowLocal = () => { const n = new Date(); return `${todayYmd()}T${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`; };

export function TimeZone() {
  const here = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const all = useMemo(() => {
    const ok = (z: string) => { try { new Intl.DateTimeFormat("en-US", { timeZone: z }); return true; } catch { return false; } };
    // browsers list canonical names only (e.g. Asia/Calcutta); add the common modern aliases people search for
    return Array.from(new Set(["UTC", ...ZONES, ...POPULAR, "Asia/Kolkata", "Asia/Ho_Chi_Minh", "Asia/Kathmandu", "Europe/Kyiv", "Asia/Yangon", here].filter(ok))).sort();
  }, [here]);
  const [when, setWhen] = useState(nowLocal()), [from, setFrom] = useState(here), [to, setTo] = useState(here === "UTC" ? "America/New_York" : "UTC");
  const t = zonedToInstant(when, from);
  const ok = Number.isFinite(t);
  const off = (z: string) => { const m = tzOffset(z, t) / 60000; const sgn = m < 0 ? "-" : "+"; return `UTC${sgn}${String(Math.floor(Math.abs(m) / 60)).padStart(2, "0")}:${String(Math.abs(m) % 60).padStart(2, "0")}`; };
  const opts = all.map((z): [string, string] => [z, z.replace(/_/g, " ")]);
  return (
    <Panel><Stack>
      <Grid><Txt label="Date and time" type="datetime-local" value={when} onChange={setWhen} /><Sel label="From time zone" value={from} onChange={setFrom} options={opts} /></Grid>
      <Sel label="To time zone" value={to} onChange={setTo} options={opts} />
      <Out rows={ok ? [[`Time in ${to.replace(/_/g, " ")}`, fmtInZone(t, to)], ["UTC offset (from)", off(from)], ["UTC offset (to)", off(to)], ["UTC", new Date(t).toISOString().replace("T", " ").slice(0, 16)]] : []} />
      {ok && (
        <div className="overflow-x-auto"><table className="w-full text-sm" style={{ color: "#C9CCE8" }}><tbody>
          {POPULAR.filter((z) => all.includes(z)).map((z) => <tr key={z} style={{ borderTop: "1px solid #1A1D3B" }}><td className="py-1.5">{z.replace(/_/g, " ")}</td><td className="text-right">{fmtInZone(t, z)}</td></tr>)}
        </tbody></table></div>
      )}
      <Formula>The wall-clock time is converted to a UTC instant using the source zone&apos;s offset on that date, then shown in the target zone. Daylight saving time is applied automatically through your browser&apos;s time zone data.</Formula>
    </Stack></Panel>
  );
}

export function Countdown() {
  const yr = new Date().getFullYear() + 1;
  const [target, setTarget] = useState(`${yr}-01-01T00:00`);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const t = new Date(target).getTime();
  const ok = Number.isFinite(t);
  const diff = ok ? Math.abs(t - now) : 0, past = ok && t < now;
  const days = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
  const rows: [string, string][] = ok ? [[past ? "Time since" : "Time left", `${days}d ${h}h ${m}m ${s}s`], ["Total days", plain(diff / 86400000, 2)], ["Total weeks", plain(diff / 604800000, 2)], ["Total hours", Math.floor(diff / 3600000).toLocaleString("en-US")]] : [];
  return (
    <Panel><Stack>
      <Txt label="Target date and time (your local time)" type="datetime-local" value={target} onChange={setTarget} />
      <Out rows={rows} />
      <Formula>Time left = target − now, updated every second using your device clock.</Formula>
    </Stack></Panel>
  );
}

export function HoursDecimal() {
  const [h, setH] = useState("7"), [m, setM] = useState("45"), [dec, setDec] = useState("7.75");
  const H = toNum(h) || 0, M = toNum(m) || 0, D = toNum(dec);
  const asDec = H + M / 60;
  const totalMin = Math.round(Math.abs(D) * 60);
  return (
    <Panel><Stack>
      <p className="text-sm font-semibold" style={{ color: "#E8EAF6" }}>Hours and minutes to decimal hours</p>
      <Grid><Num label="Hours" value={h} onChange={setH} /><Num label="Minutes" value={m} onChange={setM} /></Grid>
      <Out rows={[["Decimal hours", plain(asDec, 4)], ["Total minutes", String(Math.round(H * 60 + M))]]} />
      <p className="text-sm font-semibold pt-2" style={{ color: "#E8EAF6" }}>Decimal hours to hours and minutes</p>
      <Num label="Decimal hours" value={dec} onChange={setDec} />
      <Out rows={Number.isFinite(D) ? [["Hours and minutes", `${D < 0 ? "-" : ""}${Math.floor(totalMin / 60)} h ${totalMin % 60} min`]] : []} />
      <Formula>Decimal = hours + minutes ÷ 60. Hours = whole part of the decimal; minutes = fractional part × 60.</Formula>
    </Stack></Panel>
  );
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mins = (t: string) => { const m = /^(\d{2}):(\d{2})$/.exec(t); return m ? +m[1] * 60 + +m[2] : NaN; };
export function WorkHours() {
  const [rows, setRows] = useState(DAYS.map((_, i) => ({ s: i < 5 ? "09:00" : "", e: i < 5 ? "17:00" : "", b: i < 5 ? "30" : "0" })));
  const [rate, setRate] = useState("");
  const set = (i: number, k: "s" | "e" | "b", v: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const per = rows.map((r) => { const a = mins(r.s), b = mins(r.e); if (!Number.isFinite(a) || !Number.isFinite(b)) return 0; let d = b - a; if (d < 0) d += 1440; return Math.max(0, d - (toNum(r.b) || 0)); });
  const total = per.reduce((x, y) => x + y, 0);
  const R = toNum(rate);
  const out: [string, string][] = [["Total time", `${Math.floor(total / 60)} h ${total % 60} min`], ["Total in decimal hours", plain(total / 60, 2)]];
  if (R >= 0) out.push(["Gross pay (before tax)", money((total / 60) * R)]);
  return (
    <Panel><Stack>
      <div className="grid gap-2 text-sm" style={{ gridTemplateColumns: "minmax(70px,1fr) 1fr 1fr 70px 70px", color: "#C9CCE8" }}>
        <span style={{ color: "#6E739C" }}>Day</span><span style={{ color: "#6E739C" }}>Start</span><span style={{ color: "#6E739C" }}>End</span><span style={{ color: "#6E739C" }}>Break (min)</span><span style={{ color: "#6E739C" }}>Hours</span>
        {rows.map((r, i) => (
          <div key={DAYS[i]} className="contents">
            <span className="self-center">{DAYS[i].slice(0, 3)}</span>
            <input aria-label={`${DAYS[i]} start`} type="time" value={r.s} onChange={(e) => set(i, "s", e.target.value)} className="rounded-lg px-2 py-2 text-sm text-[#E8EAF6] min-w-0" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }} />
            <input aria-label={`${DAYS[i]} end`} type="time" value={r.e} onChange={(e) => set(i, "e", e.target.value)} className="rounded-lg px-2 py-2 text-sm text-[#E8EAF6] min-w-0" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }} />
            <input aria-label={`${DAYS[i]} break`} type="number" min={0} value={r.b} onChange={(e) => set(i, "b", e.target.value)} className="rounded-lg px-2 py-2 text-sm text-[#E8EAF6] min-w-0" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }} />
            <span className="self-center" style={{ fontFamily: "var(--font-mono)" }}>{plain(per[i] / 60, 2)}</span>
          </div>
        ))}
      </div>
      <Num label="Hourly rate (optional)" value={rate} onChange={setRate} />
      <Out rows={out} />
      <Formula>Daily hours = end − start − break. If the end time is earlier than the start, the shift is treated as overnight (adds 24 h).</Formula>
      <Disclaimer>Pay is gross and ignores overtime rules and tax. General information only.</Disclaimer>
    </Stack></Panel>
  );
}
