import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { getTool, tools } from "@/lib/tools";

export const dynamicParams = false;
export async function generateStaticParams() { return tools.filter((t) => t.slug !== "passport-photo").map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTool((await params).slug);
  return t ? toolMetadata(t) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTool((await params).slug);
  if (!t) notFound();
  return <ToolPage t={t} />;
}
