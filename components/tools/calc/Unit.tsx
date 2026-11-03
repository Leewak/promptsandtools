"use client";

import { useState } from "react";
import { Button, Panel } from "../ui";
import { INGREDIENTS, UNIT_SETS, convertUnit } from "./math";
import { Formula, Grid, Num, Out, Sel, Stack, plain, toNum } from "./shared";

const fmt = (x: number) => (!Number.isFinite(x) ? "–" : Math.abs(x) >= 1e9 || (x !== 0 && Math.abs(x) < 1e-4) ? x.toExponential(5) : String(+x.toPrecision(10)));

export default function Unit({ cat = "length", from: f0, to: t0 }: { cat?: string; from?: string; to?: string }) {
  const set = UNIT_SETS[cat] ?? UNIT_SETS.length;
  const key = UNIT_SETS[cat] ? cat : "length";
  const [from, setFrom] = useState(f0 ?? set.units[0].id), [to, setTo] = useState(t0 ?? set.units[1].id), [v, setV] = useState("1");
  const [ing, setIng] = useState("water");
  const x = toNum(v), r = Number.isFinite(x) ? convertUnit(key, x, from, to) : NaN;
  const name = (id: string) => set.units.find((u) => u.id === id)!;
  const a = name(from), b = name(to);
  const common = key === "temperature" ? [-40, 0, 20, 37, 100] : [1, 5, 10, 50, 100];
  const swap = () => { setFrom(to); setTo(from); };
  const opts = set.units.map((u): [string, string] => [u.id, `${u.name} (${u.sym})`]);
  const cup = key === "volume" ? convertUnit("volume", x, from, "cup") : NaN;
  const gPerCup = INGREDIENTS.find((i) => i.id === ing)!.gPerCup;
  return (
    <Panel><Stack>
      <Grid>
        <Num label={`Value in ${a.sym}`} value={v} onChange={setV} />
        <div />
        <Sel label="From" value={from} onChange={setFrom} options={opts} />
        <Sel label="To" value={to} onChange={setTo} options={opts} />
      </Grid>
      <div><Button secondary onClick={swap}>⇄ Swap units</Button></div>
      <Out rows={Number.isFinite(r) ? [[`${fmt(x)} ${a.sym} =`, `${fmt(r)} ${b.sym}`]] : []} />
      {key === "temperature" ? (
        <Formula>°F = °C × 9/5 + 32 · °C = (°F − 32) × 5/9 · K = °C + 273.15</Formula>
      ) : (
        <Formula>1 {a.sym} = {fmt(convertUnit(key, 1, from, to))} {b.sym} · 1 {b.sym} = {fmt(convertUnit(key, 1, to, from))} {a.sym}</Formula>
      )}
      {key === "volume" && (
        <div className="flex flex-col gap-3 pt-2" style={{ borderTop: "1px solid #1A1D3B" }}>
          <p className="text-sm font-semibold" style={{ color: "#E8EAF6" }}>Cups to grams for baking (approximate)</p>
          <Sel label="Ingredient" value={ing} onChange={setIng} options={INGREDIENTS.map((i) => [i.id, i.name])} />
          <Out rows={Number.isFinite(cup) ? [[`${fmt(x)} ${a.sym} of this ingredient weighs about`, `${plain(cup * gPerCup, 0)} g (${plain((cup * gPerCup) / 28.349523125, 1)} oz)`]] : []} />
          <p className="text-xs" style={{ color: "#6E739C" }}>US cup = 236.588 ml (a metric cup is 250 ml). Weights per cup vary with how the ingredient is packed or sifted, so treat them as a guide.</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ color: "#C9CCE8" }}>
          <thead><tr style={{ color: "#9CA1C9" }}><th className="text-left py-1">{a.sym}</th><th className="text-right">{b.sym}</th></tr></thead>
          <tbody>{common.map((c) => <tr key={c} style={{ borderTop: "1px solid #1A1D3B" }}><td className="py-1">{c}</td><td className="text-right">{fmt(convertUnit(key, c, from, to))}</td></tr>)}</tbody>
        </table>
      </div>
    </Stack></Panel>
  );
}
