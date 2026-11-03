"use client";

import { useState } from "react";
import { Panel, Segmented } from "../ui";
import { compound, pmt, savingsMonthly } from "./math";
import { Disclaimer, Formula, Grid, Num, Out, Sel, Stack, money, plain, toNum } from "./shared";

const GENERAL = <Disclaimer>For general information only, not financial advice. Real offers can include fees, insurance or different rounding, so check the figures with your lender or provider.</Disclaimer>;

export function Loan() {
  const [amt, setAmt] = useState("20000"), [rate, setRate] = useState("7"), [term, setTerm] = useState("5"), [unit, setUnit] = useState<"Years" | "Months">("Years");
  const a = toNum(amt), r = toNum(rate), n = Math.round(toNum(term) * (unit === "Years" ? 12 : 1));
  const ok = a > 0 && r >= 0 && n > 0;
  const m = ok ? pmt(a, r, n) : NaN;
  const rows: [string, string][] = ok ? [["Monthly payment", money(m)], ["Total interest", money(m * n - a)], ["Total repaid", money(m * n)], ["Number of payments", String(n)]] : [];
  // yearly breakdown
  const table: { y: number; interest: number; principal: number; bal: number }[] = [];
  if (ok && n <= 600) { let bal = a; const i = r / 1200; for (let y = 1; y <= Math.ceil(n / 12); y++) { let ti = 0, tp = 0; for (let k = 0; k < 12 && (y - 1) * 12 + k < n; k++) { const it = bal * i, pr = m - it; ti += it; tp += pr; bal -= pr; } table.push({ y, interest: ti, principal: tp, bal: Math.max(0, bal) }); } }
  return (
    <Panel><Stack>
      <Grid>
        <Num label="Loan amount" value={amt} onChange={setAmt} /><Num label="Interest rate (% per year)" value={rate} onChange={setRate} />
        <Num label="Loan term" value={term} onChange={setTerm} /><div className="flex flex-col gap-1.5 text-sm" style={{ color: "#C9CCE8" }}>Term unit<Segmented options={["Years", "Months"] as const} value={unit} onChange={setUnit} /></div>
      </Grid>
      <Out rows={rows} />
      <Formula>Payment = P × r ÷ (1 − (1 + r)^−n), where r = annual rate ÷ 12 ÷ 100 and n = number of monthly payments. Payments are made at the end of each month.</Formula>
      {table.length > 0 && (
        <div className="overflow-x-auto"><table className="w-full text-sm" style={{ color: "#C9CCE8" }}><thead><tr style={{ color: "#9CA1C9" }}><th className="text-left py-1">Year</th><th className="text-right">Principal</th><th className="text-right">Interest</th><th className="text-right">Balance</th></tr></thead>
          <tbody>{table.map((t) => <tr key={t.y} style={{ borderTop: "1px solid #1A1D3B" }}><td className="py-1">{t.y}</td><td className="text-right">{money(t.principal)}</td><td className="text-right">{money(t.interest)}</td><td className="text-right">{money(t.bal)}</td></tr>)}</tbody></table></div>
      )}
      {GENERAL}
    </Stack></Panel>
  );
}

export function Mortgage() {
  const [price, setPrice] = useState("350000"), [down, setDown] = useState("70000"), [rate, setRate] = useState("6.5"), [term, setTerm] = useState("30"), [tax, setTax] = useState("1.1"), [ins, setIns] = useState("1200");
  const p = toNum(price), d = toNum(down) || 0, r = toNum(rate), y = toNum(term);
  const loan = p - d, n = Math.round(y * 12);
  const ok = p > 0 && loan > 0 && r >= 0 && n > 0;
  const pi = ok ? pmt(loan, r, n) : NaN;
  const taxM = ok ? (p * ((toNum(tax) || 0) / 100)) / 12 : 0, insM = ok ? (toNum(ins) || 0) / 12 : 0;
  const rows: [string, string][] = ok ? [["Total monthly payment", money(pi + taxM + insM)], ["Principal & interest", money(pi)], ["Property tax (monthly)", money(taxM)], ["Home insurance (monthly)", money(insM)], ["Loan amount", money(loan)], ["Down payment", `${plain((d / p) * 100, 1)}%`], ["Total interest over the loan", money(pi * n - loan)]] : [];
  return (
    <Panel><Stack>
      <Grid>
        <Num label="Home price" value={price} onChange={setPrice} /><Num label="Down payment (amount)" value={down} onChange={setDown} />
        <Num label="Interest rate (% per year)" value={rate} onChange={setRate} /><Num label="Loan term (years)" value={term} onChange={setTerm} />
        <Num label="Property tax (% of price per year)" value={tax} onChange={setTax} /><Num label="Home insurance (per year)" value={ins} onChange={setIns} />
      </Grid>
      <Out rows={rows} />
      <Formula>Principal &amp; interest = L × r ÷ (1 − (1 + r)^−n) with L = price − down payment, r = rate ÷ 12. Tax and insurance are added as yearly amounts ÷ 12.</Formula>
      <Disclaimer>Assumes a fixed-rate loan. Mortgage insurance (PMI), HOA fees and closing costs are not included. General information only, not financial advice.</Disclaimer>
    </Stack></Panel>
  );
}

export function Compound() {
  const [p, setP] = useState("10000"), [r, setR] = useState("5"), [y, setY] = useState("10"), [f, setF] = useState("1"), [c, setC] = useState("0");
  const P = toNum(p) || 0, R = toNum(r), Y = toNum(y), C = toNum(c) || 0;
  const ok = R >= 0 && Y > 0 && (P > 0 || C > 0);
  const o = ok ? compound(P, R, Y, +f, C) : null;
  const rows: [string, string][] = o ? [["Future value", money(o.fv)], ["Total contributed", money(o.contributed)], ["Interest earned", money(o.interest)]] : [];
  return (
    <Panel><Stack>
      <Grid>
        <Num label="Starting amount" value={p} onChange={setP} /><Num label="Interest rate (% per year)" value={r} onChange={setR} />
        <Num label="Years" value={y} onChange={setY} /><Sel label="Compounded" value={f} onChange={setF} options={[["1", "Yearly"], ["2", "Half-yearly"], ["4", "Quarterly"], ["12", "Monthly"], ["365", "Daily"]]} />
        <Num label="Monthly deposit (optional)" value={c} onChange={setC} />
      </Grid>
      <Out rows={rows} />
      <Formula>A = P × (1 + r/n)^(n×t). With monthly deposits, each deposit is added at the end of the month and grows at the equivalent monthly rate.</Formula>
      {GENERAL}
    </Stack></Panel>
  );
}

export function Simple() {
  const [p, setP] = useState("1000"), [r, setR] = useState("5"), [t, setT] = useState("3"), [u, setU] = useState("12");
  const P = toNum(p), R = toNum(r), T = toNum(t);
  const ok = P > 0 && R >= 0 && T > 0;
  // time in years: unit 12 -> years, 1 -> months, 0 -> days
  const years = +u === 12 ? T : +u === 1 ? T / 12 : T / 365;
  const interest = ok ? P * (R / 100) * years : NaN;
  const rows: [string, string][] = ok ? [["Simple interest", money(interest)], ["Total amount", money(P + interest)], ["Time in years", plain(years, 4)]] : [];
  return (
    <Panel><Stack>
      <Grid>
        <Num label="Principal" value={p} onChange={setP} /><Num label="Interest rate (% per year)" value={r} onChange={setR} />
        <Num label="Time" value={t} onChange={setT} /><Sel label="Time unit" value={u} onChange={setU} options={[["12", "Years"], ["1", "Months"], ["0", "Days"]]} />
      </Grid>
      <Out rows={rows} />
      <Formula>Interest = P × R × T, with R as a decimal (5% = 0.05) and T in years. Months ÷ 12, days ÷ 365.</Formula>
      {GENERAL}
    </Stack></Panel>
  );
}

export function SavingsGoal() {
  const [g, setG] = useState("10000"), [s, setS] = useState("1000"), [r, setR] = useState("3"), [m, setM] = useState("24");
  const G = toNum(g), S = toNum(s) || 0, R = toNum(r) || 0, M = Math.round(toNum(m));
  const ok = G > 0 && M > 0 && R >= 0;
  const need = ok ? savingsMonthly(G, S, R, M) : NaN;
  const rows: [string, string][] = ok ? (need <= 0 ? [["Monthly saving needed", "0.00 (goal already reached)"]] : [["Monthly saving needed", money(need)], ["You deposit in total", money(need * M + S)], ["Interest earned", money(G - S - need * M)]]) : [];
  return (
    <Panel><Stack>
      <Grid>
        <Num label="Savings goal" value={g} onChange={setG} /><Num label="Already saved" value={s} onChange={setS} />
        <Num label="Interest rate (% per year, 0 if none)" value={r} onChange={setR} /><Num label="Months to reach the goal" value={m} onChange={setM} />
      </Grid>
      <Out rows={rows} />
      <Formula>Monthly deposit = (Goal − Start × (1+i)^m) × i ÷ ((1+i)^m − 1), where i = annual rate ÷ 12 and deposits are made at the end of each month.</Formula>
      {GENERAL}
    </Stack></Panel>
  );
}

export function Tip() {
  const [bill, setBill] = useState("84.50"), [pct, setPct] = useState("18"), [ppl, setPpl] = useState("2");
  const b = toNum(bill), t = toNum(pct), n = Math.max(1, Math.round(toNum(ppl) || 1));
  const ok = b >= 0 && t >= 0;
  const tip = ok ? (b * t) / 100 : NaN;
  const rows: [string, string][] = ok ? [["Tip", money(tip)], ["Total", money(b + tip)], ["Total per person", money((b + tip) / n)], ["Tip per person", money(tip / n)]] : [];
  return (
    <Panel><Stack>
      <Grid cols={3}><Num label="Bill amount" value={bill} onChange={setBill} /><Num label="Tip (%)" value={pct} onChange={setPct} /><Num label="Split between (people)" value={ppl} onChange={setPpl} step="1" min={1} /></Grid>
      <div className="flex flex-wrap gap-2 items-center text-sm" style={{ color: "#9CA1C9" }}>Quick tip: <Segmented options={[10, 15, 18, 20, 25]} value={Number(pct)} onChange={(v) => setPct(String(v))} format={(v) => `${v}%`} /></div>
      <Out rows={rows} />
      <Formula>Tip = bill × tip% ÷ 100. Total = bill + tip. Per person = total ÷ number of people.</Formula>
      <Disclaimer>Tipping customs differ by country; check what is normal where you are.</Disclaimer>
    </Stack></Panel>
  );
}

export function Discount() {
  const [price, setPrice] = useState("120"), [d1, setD1] = useState("25"), [d2, setD2] = useState("");
  const p = toNum(price), a = toNum(d1) || 0, b = toNum(d2) || 0;
  const ok = p >= 0 && a >= 0 && a <= 100 && b >= 0 && b <= 100;
  const final = ok ? p * (1 - a / 100) * (1 - b / 100) : NaN;
  const rows: [string, string][] = ok ? [["Sale price", money(final)], ["You save", money(p - final)], ["Total discount", `${plain(p ? ((p - final) / p) * 100 : 0, 2)}%`]] : [];
  return (
    <Panel><Stack>
      <Grid cols={3}><Num label="Original price" value={price} onChange={setPrice} /><Num label="Discount (%)" value={d1} onChange={setD1} /><Num label="Extra discount (%, optional)" value={d2} onChange={setD2} /></Grid>
      <Out rows={rows} />
      <Formula>Sale price = price × (1 − discount%). A second discount is applied to the already reduced price, so 20% + 10% off is 28% off, not 30%.</Formula>
    </Stack></Panel>
  );
}

export function Vat() {
  const [mode, setMode] = useState<"Add tax" | "Remove tax">("Add tax"), [amt, setAmt] = useState("100"), [rate, setRate] = useState("20");
  const a = toNum(amt), r = toNum(rate);
  const ok = a >= 0 && r >= 0;
  const net = mode === "Add tax" ? a : a / (1 + r / 100);
  const gross = mode === "Add tax" ? a * (1 + r / 100) : a;
  const rows: [string, string][] = ok ? [[mode === "Add tax" ? "Price including tax" : "Price without tax", money(mode === "Add tax" ? gross : net)], ["Tax amount", money(gross - net)], ["Net (before tax)", money(net)], ["Gross (with tax)", money(gross)]] : [];
  return (
    <Panel><Stack>
      <Segmented options={["Add tax", "Remove tax"] as const} value={mode} onChange={setMode} />
      <Grid><Num label={mode === "Add tax" ? "Price before tax" : "Price including tax"} value={amt} onChange={setAmt} /><Num label="Tax rate (%) – enter your local rate" value={rate} onChange={setRate} /></Grid>
      <Out rows={rows} />
      <Formula>Add: gross = net × (1 + rate/100). Remove: net = gross ÷ (1 + rate/100); tax = gross − net. Enter the rate that applies to you; no rate is assumed.</Formula>
      <Disclaimer>For general information only. Check your local tax rules for rounding and exemptions.</Disclaimer>
    </Stack></Panel>
  );
}

export function Margin() {
  const [mode, setMode] = useState<"From cost & price" | "Price from margin" | "Price from markup">("From cost & price");
  const [cost, setCost] = useState("60"), [price, setPrice] = useState("100"), [pct, setPct] = useState("40");
  const c = toNum(cost), s = toNum(price), x = toNum(pct);
  let rows: [string, string][] = [];
  if (mode === "From cost & price" && c >= 0 && s > 0) { const pr = s - c; rows = [["Profit margin", `${plain((pr / s) * 100, 2)}%`], ["Markup", `${plain(c ? (pr / c) * 100 : NaN, 2)}%`], ["Profit", money(pr)]]; }
  if (mode === "Price from margin" && c >= 0 && x >= 0 && x < 100) { const sp = c / (1 - x / 100); rows = [["Selling price", money(sp)], ["Profit", money(sp - c)], ["Markup", `${plain(c ? ((sp - c) / c) * 100 : NaN, 2)}%`]]; }
  if (mode === "Price from markup" && c >= 0 && x >= 0) { const sp = c * (1 + x / 100); rows = [["Selling price", money(sp)], ["Profit", money(sp - c)], ["Profit margin", `${plain(((sp - c) / sp) * 100, 2)}%`]]; }
  return (
    <Panel><Stack>
      <Segmented options={["From cost & price", "Price from margin", "Price from markup"] as const} value={mode} onChange={setMode} />
      <Grid>
        <Num label="Cost" value={cost} onChange={setCost} />
        {mode === "From cost & price" ? <Num label="Selling price" value={price} onChange={setPrice} /> : <Num label={mode === "Price from margin" ? "Desired margin (%)" : "Desired markup (%)"} value={pct} onChange={setPct} />}
      </Grid>
      <Out rows={rows} />
      <Formula>Margin = (price − cost) ÷ price. Markup = (price − cost) ÷ cost. A 50% markup is only a 33.3% margin. Price from margin = cost ÷ (1 − margin).</Formula>
    </Stack></Panel>
  );
}

export function Fuel() {
  const [sys, setSys] = useState<"Metric" | "US">("Metric"), [dist, setDist] = useState("500"), [cons, setCons] = useState("7"), [price, setPrice] = useState("1.50"), [ppl, setPpl] = useState("1");
  const d = toNum(dist), c = toNum(cons), p = toNum(price), n = Math.max(1, Math.round(toNum(ppl) || 1));
  const ok = d >= 0 && c > 0 && p >= 0;
  const fuel = ok ? (sys === "Metric" ? (d * c) / 100 : d / c) : NaN;
  const cost = fuel * p;
  const rows: [string, string][] = ok ? [["Trip fuel cost", money(cost)], [sys === "Metric" ? "Fuel needed (litres)" : "Fuel needed (gallons)", plain(fuel, 2)], ["Cost per person", money(cost / n)], [sys === "Metric" ? "Cost per km" : "Cost per mile", money(d ? cost / d : NaN, 3)]] : [];
  const sw = (s: "Metric" | "US") => { setSys(s); if (s === "US") { setDist("300"); setCons("30"); setPrice("3.50"); } else { setDist("500"); setCons("7"); setPrice("1.50"); } };
  return (
    <Panel><Stack>
      <Segmented options={["Metric", "US"] as const} value={sys} onChange={sw} format={(s) => (s === "Metric" ? "km · L/100 km" : "miles · mpg")} />
      <Grid>
        <Num label={sys === "Metric" ? "Trip distance (km)" : "Trip distance (miles)"} value={dist} onChange={setDist} /><Num label={sys === "Metric" ? "Consumption (L per 100 km)" : "Fuel economy (miles per gallon)"} value={cons} onChange={setCons} />
        <Num label={sys === "Metric" ? "Fuel price (per litre)" : "Fuel price (per gallon)"} value={price} onChange={setPrice} /><Num label="Travelling people (to split cost)" value={ppl} onChange={setPpl} step="1" min={1} />
      </Grid>
      <Out rows={rows} />
      <Formula>{sys === "Metric" ? "Fuel (L) = distance × consumption ÷ 100. Cost = fuel × price per litre." : "Fuel (gal) = miles ÷ mpg. Cost = fuel × price per gallon."} Prices are whatever you enter; none are assumed.</Formula>
    </Stack></Panel>
  );
}

export function Electricity() {
  const [w, setW] = useState("100"), [h, setH] = useState("10"), [rate, setRate] = useState("0.20");
  const W = toNum(w), H = toNum(h), R = toNum(rate);
  const ok = W >= 0 && H >= 0 && H <= 24 && R >= 0;
  const kwhDay = ok ? (W * H) / 1000 : NaN;
  const rows: [string, string][] = ok ? [["Cost per day", money(kwhDay * R, 3)], ["Cost per month (30 days)", money(kwhDay * R * 30)], ["Cost per year (365 days)", money(kwhDay * R * 365)], ["Energy per day", `${plain(kwhDay, 3)} kWh`], ["Energy per month (30 days)", `${plain(kwhDay * 30, 2)} kWh`]] : [];
  return (
    <Panel><Stack>
      <Grid cols={3}><Num label="Device power (watts)" value={w} onChange={setW} /><Num label="Hours used per day (0-24)" value={h} onChange={setH} /><Num label="Your price per kWh" value={rate} onChange={setRate} /></Grid>
      <Out rows={rows} />
      <Formula>kWh = watts × hours ÷ 1000. Cost = kWh × your price per kWh. Find the watts on the device label and the rate on your electricity bill.</Formula>
      <Disclaimer>Estimate only: real use varies with settings, standby power and tariffs.</Disclaimer>
    </Stack></Panel>
  );
}
