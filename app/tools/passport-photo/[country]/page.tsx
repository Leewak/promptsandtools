import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { PASSPORT_COUNTRIES, passportFor } from "@/lib/tools";

export const dynamicParams = false;
export async function generateStaticParams() { return PASSPORT_COUNTRIES.map((c) => ({ country: c.id })); }

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const t = passportFor((await params).country);
  return t ? toolMetadata(t) : {};
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const t = passportFor((await params).country);
  if (!t) notFound();
  return <ToolPage t={t} />;
}
