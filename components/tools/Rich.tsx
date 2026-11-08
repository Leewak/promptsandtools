import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/** Text with inline [label](/internal-path) links. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0, k = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    out.push(<Link key={k++} href={m[2]} className="underline underline-offset-2 hover:text-white" style={{ color: "#7DD3FC" }}>{m[1]}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
