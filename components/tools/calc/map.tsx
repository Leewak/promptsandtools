"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { CalcKind } from "@/lib/tools-calc";

const loading = () => <div className="rounded-2xl h-64 animate-pulse" style={{ background: "#10122A", border: "1px solid #23264A" }} />;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = (loader: () => Promise<{ default: ComponentType<any> }>) => dynamic(loader, { ssr: false, loading });
const pick = <M extends Record<string, ComponentType>>(imp: () => Promise<M>, k: keyof M) => d(() => imp().then((m) => ({ default: m[k] })));

// Component for each calculator/converter kind; spread into the main map in ToolRunner.tsx.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CALC_MAP: Record<CalcKind, ComponentType<any>> = {
  "percent": pick(() => import("./Misc"), "Percent"), "average": pick(() => import("./Misc"), "Average"), "random": pick(() => import("./Misc"), "Random"),
  "dice": pick(() => import("./Misc"), "Dice"), "fraction": pick(() => import("./Misc"), "Fraction"), "calculator": pick(() => import("./Misc"), "Calculator"),
  "roman": pick(() => import("./Misc"), "Roman"), "num-words": pick(() => import("./Misc"), "NumWords"),
  "loan": pick(() => import("./Finance"), "Loan"), "mortgage": pick(() => import("./Finance"), "Mortgage"), "compound": pick(() => import("./Finance"), "Compound"),
  "simple-interest": pick(() => import("./Finance"), "Simple"), "savings-goal": pick(() => import("./Finance"), "SavingsGoal"), "tip": pick(() => import("./Finance"), "Tip"),
  "discount": pick(() => import("./Finance"), "Discount"), "vat": pick(() => import("./Finance"), "Vat"), "margin": pick(() => import("./Finance"), "Margin"),
  "fuel": pick(() => import("./Finance"), "Fuel"), "electricity": pick(() => import("./Finance"), "Electricity"),
  "age": pick(() => import("./Dates"), "Age"), "date-diff": pick(() => import("./Dates"), "DateDiff"), "date-add": pick(() => import("./Dates"), "DateAdd"),
  "timezone": pick(() => import("./Dates"), "TimeZone"), "countdown": pick(() => import("./Dates"), "Countdown"), "hours-decimal": pick(() => import("./Dates"), "HoursDecimal"),
  "work-hours": pick(() => import("./Dates"), "WorkHours"),
  "bmi": pick(() => import("./Health"), "Bmi"), "bmr": pick(() => import("./Health"), "Bmr"), "gpa": pick(() => import("./Health"), "Gpa"), "grade": pick(() => import("./Health"), "Grade"),
  "unit": d(() => import("./Unit")),
};
