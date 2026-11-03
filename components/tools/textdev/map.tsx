"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { TextDevKind } from "@/lib/tools-textdev";
import { OP_NAMES, type OpName } from "./ops";

const loading = () => <div className="rounded-2xl h-64 animate-pulse" style={{ background: "#10122A", border: "1px solid #23264A" }} />;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = (loader: () => Promise<{ default: ComponentType<any> }>) => dynamic(loader, { ssr: false, loading });

const Op = d(() => import("./TextOp"));
const opComp = (op: OpName) => function OpTool() { return <Op op={op} />; };

// Component for each text/dev tool kind; spread into the main map in ToolRunner.tsx.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TEXTDEV_MAP: Record<TextDevKind, ComponentType<any>> = {
  ...(Object.fromEntries(OP_NAMES.map((o) => [o, opComp(o)])) as unknown as Record<OpName, ComponentType>),
  "text-diff": d(() => import("./Diff")),
  "char-count": d(() => import("./CharCount")),
  "lorem": d(() => import("./Lorem")),
  "picker": d(() => import("./Picker")),
  "regex": d(() => import("./Regex")),
  "uuid": d(() => import("./Uuid")),
  "hash": d(() => import("./Hash")),
  "markdown": d(() => import("./Markdown")),
  "gradient": d(() => import("./CssGen").then((m) => ({ default: m.Gradient }))),
  "shadow": d(() => import("./CssGen").then((m) => ({ default: m.Shadow }))),
  "meta-tags": d(() => import("./SeoGen").then((m) => ({ default: m.MetaTags }))),
  "robots": d(() => import("./SeoGen").then((m) => ({ default: m.Robots }))),
  "utm": d(() => import("./SeoGen").then((m) => ({ default: m.Utm }))),
};
