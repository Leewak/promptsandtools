"use client";

import { useState } from "react";
import { Button, Panel, Segmented } from "../ui";
import { bmi, bmiBand, mifflin } from "./math";
import { Disclaimer, Formula, Grid, Num, Out, Sel, Stack, plain, toNum } from "./shared";

const MED = <Disclaimer>General information only, not medical advice. Talk to a doctor or dietitian about your own health, weight or diet.</Disclaimer>;

export function Bmi() {
  const [sys, setSys] = useState<"Metric" | "Imperial">("Metric");
  const [kg, setKg] = useState("70"), [cm, setCm] = useState("175"), [lb, setLb] = useState("154"), [ft, setFt] = useState("5"), [inch, setInch] = useState("9");
  const w = sys === "Metric" ? toNum(kg) : toNum(lb) * 0.45359237;
  const h = sys === "Metric" ? toNum(cm) / 100 : (toNum(ft) * 12 + (toNum(inch) || 0)) * 0.0254;
  const ok = w > 0 && h > 0.5 && h < 2.8;
  const b = ok ? bmi(w, h) : NaN;
  const lo = 18.5 * h * h, hi = 24.9 * h * h;
  const rows: [string, string][] = ok ? [["Your BMI", plain(b, 1)], ["WHO category (adults)", bmiBand(b)], ["Healthy weight range for this height", sys === "Metric" ? `${plain(lo, 1)} to ${plain(hi, 1)} kg` : `${plain(lo / 0.45359237, 1)} to ${plain(hi / 0.45359237, 1)} lb`]] : [];
  return (
    <Panel><Stack>
      <Segmented options={["Metric", "Imperial"] as const} value={sys} onChange={setSys} />
      {sys === "Metric" ? <Grid><Num label="Weight (kg)" value={kg} onChange={setKg} /><Num label="Height (cm)" value={cm} onChange={setCm} /></Grid>
        : <Grid cols={3}><Num label="Weight (lb)" value={lb} onChange={setLb} /><Num label="Height (feet)" value={ft} onChange={setFt} /><Num label="Height (inches)" value={inch} onChange={setInch} /></Grid>}
      <Out rows={rows} />
      <Formula>BMI = weight (kg) ÷ height (m)². WHO adult bands: under 18.5 underweight · 18.5–24.9 normal · 25–29.9 overweight · 30 and over obesity.</Formula>
      <Disclaimer>BMI is a screening number for adults aged 20+. It does not measure body fat and can mislead for athletes, older adults, pregnancy and children. It is not a diagnosis.</Disclaimer>
      {MED}
    </Stack></Panel>
  );
}

const ACT: [string, string, number][] = [["1.2", "Little or no exercise", 1.2], ["1.375", "Light exercise 1-3 days/week", 1.375], ["1.55", "Moderate exercise 3-5 days/week", 1.55], ["1.725", "Hard exercise 6-7 days/week", 1.725], ["1.9", "Very hard exercise or physical job", 1.9]];
export function Bmr() {
  const [sex, setSex] = useState<"male" | "female">("male"), [age, setAge] = useState("30"), [kg, setKg] = useState("80"), [cm, setCm] = useState("180"), [act, setAct] = useState("1.375");
  const a = toNum(age), w = toNum(kg), h = toNum(cm);
  const ok = a >= 15 && a <= 100 && w > 20 && h > 100;
  const bmr = ok ? mifflin(w, h, a, sex) : NaN;
  const tdee = bmr * +act;
  const rows: [string, string][] = ok ? [["Basal metabolic rate (BMR)", `${Math.round(bmr)} kcal/day`], ["Maintenance calories (TDEE)", `${Math.round(tdee)} kcal/day`], ["Estimated for slow weight loss (-500)", `${Math.round(tdee - 500)} kcal/day`], ["Estimated for slow weight gain (+300)", `${Math.round(tdee + 300)} kcal/day`]] : [];
  return (
    <Panel><Stack>
      <Segmented options={["male", "female"] as const} value={sex} onChange={setSex} format={(s) => (s === "male" ? "Male" : "Female")} />
      <Grid><Num label="Age (years)" value={age} onChange={setAge} /><Num label="Weight (kg)" value={kg} onChange={setKg} /><Num label="Height (cm)" value={cm} onChange={setCm} />
        <Sel label="Activity level" value={act} onChange={setAct} options={ACT.map(([v, l]) => [v, l] as [string, string])} /></Grid>
      <Out rows={rows} />
      <Formula>Mifflin-St Jeor: BMR = 10 × kg + 6.25 × cm − 5 × age + 5 (men) or − 161 (women). TDEE = BMR × activity factor.</Formula>
      <Disclaimer>Estimates only (typically within about 10%). Very low calorie targets are not safe without medical supervision.</Disclaimer>
      {MED}
    </Stack></Panel>
  );
}

const GP: [string, number][] = [["A", 4], ["A-", 3.7], ["B+", 3.3], ["B", 3], ["B-", 2.7], ["C+", 2.3], ["C", 2], ["C-", 1.7], ["D+", 1.3], ["D", 1], ["D-", 0.7], ["F", 0]];
export function Gpa() {
  const [rows, setRows] = useState([{ n: "", c: "3", g: "A" }, { n: "", c: "3", g: "B+" }, { n: "", c: "4", g: "B" }, { n: "", c: "", g: "A" }]);
  const set = (i: number, k: "n" | "c" | "g", v: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  let pts = 0, cr = 0;
  rows.forEach((r) => { const c = toNum(r.c); if (c > 0) { pts += c * (GP.find((x) => x[0] === r.g)?.[1] ?? 0); cr += c; } });
  return (
    <Panel><Stack>
      <div className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <div key={i} className="grid gap-2" style={{ gridTemplateColumns: "1fr 80px 90px" }}>
            <input aria-label={`Course ${i + 1} name`} placeholder={`Course ${i + 1} (optional)`} value={r.n} onChange={(e) => set(i, "n", e.target.value)} className="rounded-lg px-3 py-2.5 text-sm text-[#E8EAF6] min-w-0" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }} />
            <input aria-label={`Course ${i + 1} credits`} placeholder="Credits" type="number" min={0} value={r.c} onChange={(e) => set(i, "c", e.target.value)} className="rounded-lg px-3 py-2.5 text-sm text-[#E8EAF6] min-w-0" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }} />
            <select aria-label={`Course ${i + 1} grade`} value={r.g} onChange={(e) => set(i, "g", e.target.value)} className="rounded-lg px-2 py-2.5 text-sm text-[#E8EAF6]" style={{ background: "#0C0D22", border: "1px solid #2A2E55" }}>{GP.map(([g]) => <option key={g}>{g}</option>)}</select>
          </div>
        ))}
      </div>
      <div className="flex gap-2"><Button secondary onClick={() => setRows([...rows, { n: "", c: "3", g: "A" }])}>Add course</Button><Button secondary onClick={() => setRows(rows.slice(0, -1))} disabled={rows.length <= 1}>Remove last</Button></div>
      <Out rows={cr > 0 ? [["GPA (4.0 scale)", (pts / cr).toFixed(2)], ["Total credits", plain(cr, 2)], ["Quality points", plain(pts, 2)]] : []} />
      <Formula>GPA = Σ (credits × grade points) ÷ Σ credits. Scale used: A 4.0 · A- 3.7 · B+ 3.3 · B 3.0 · B- 2.7 · C+ 2.3 · C 2.0 · C- 1.7 · D+ 1.3 · D 1.0 · D- 0.7 · F 0.</Formula>
      <Disclaimer>This is the common unweighted US 4.0 scale. Your school may use different values or weight honors and AP courses; check its policy.</Disclaimer>
    </Stack></Panel>
  );
}

const letter = (p: number) => (p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 60 ? "D" : "F");
export function Grade() {
  const [got, setGot] = useState("42"), [out, setOut] = useState("50");
  const [cur, setCur] = useState("82"), [wt, setWt] = useState("30"), [goal, setGoal] = useState("90");
  const g = toNum(got), o = toNum(out), c = toNum(cur), w = toNum(wt), t = toNum(goal);
  const pct = o > 0 && g >= 0 ? (g / o) * 100 : NaN;
  const need = w > 0 && w <= 100 ? (t - c * (1 - w / 100)) / (w / 100) : NaN;
  return (
    <Panel><Stack>
      <p className="text-sm font-semibold" style={{ color: "#E8EAF6" }}>Score to percentage and letter grade</p>
      <Grid><Num label="Points earned" value={got} onChange={setGot} /><Num label="Points possible" value={out} onChange={setOut} /></Grid>
      <Out rows={Number.isFinite(pct) ? [["Percentage", `${plain(pct, 2)}%`], ["Letter grade", letter(pct)]] : []} />
      <p className="text-sm font-semibold pt-2" style={{ color: "#E8EAF6" }}>What do I need on the final?</p>
      <Grid cols={3}><Num label="Current grade (%)" value={cur} onChange={setCur} /><Num label="Final counts for (% of grade)" value={wt} onChange={setWt} /><Num label="Grade you want (%)" value={goal} onChange={setGoal} /></Grid>
      <Out rows={Number.isFinite(need) ? [["Score needed on the final", `${plain(need, 2)}%`], ["Possible?", need > 100 ? "Not with a score of 100% or less" : need <= 0 ? "You already have it" : "Yes"]] : []} />
      <Formula>Percentage = earned ÷ possible × 100. Needed = (goal − current × (1 − weight)) ÷ weight.</Formula>
      <Disclaimer>Letter bands used: A 90+ · B 80-89 · C 70-79 · D 60-69 · F below 60. Your school may use other cut-offs.</Disclaimer>
    </Stack></Panel>
  );
}
