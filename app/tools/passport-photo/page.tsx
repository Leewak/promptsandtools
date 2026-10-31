import type { Metadata } from "next";
import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { passportGeneric } from "@/lib/tools";

export const metadata: Metadata = toolMetadata(passportGeneric);
export default function Page() { return <ToolPage t={passportGeneric} />; }
