import { ArrowDownAZ, ArrowLeftRight, Binary, CalendarClock, CaseSensitive, Code2, Database, Diff, Eraser, FileCode, FileJson, FileSpreadsheet, FileText, Fingerprint, Hash, KeyRound, Link2, ListX, Lock, Palette, Radio, Regex, Replace, RotateCcw, Shuffle, SquareDashed, Tags, TextCursorInput, Timer, Type, Users, WrapText, Bot, Megaphone, type LucideIcon } from "lucide-react";
import type { TextDevKind } from "@/lib/tools-textdev";

// Icons for the text and developer tools; spread into the main icon map in ToolIcon.tsx.
export const TEXTDEV_ICONS: Record<TextDevKind, LucideIcon> = {
  "case-converter": CaseSensitive, "dedupe-lines": ListX, "sort-lines": ArrowDownAZ, "remove-line-breaks": WrapText, "find-replace": Replace, "slug": Link2,
  "text-binary": Binary, "text-hex": Hash, "morse": Radio, "reverse-text": RotateCcw, "clean-spaces": Eraser, "base64": Lock, "url-codec": ArrowLeftRight,
  "html-entities": Code2, "csv-json": FileSpreadsheet, "json-csv": FileSpreadsheet, "json-yaml": FileJson, "xml-format": FileCode, "sql-format": Database,
  "jwt": KeyRound, "cron": Timer, "timestamp": CalendarClock,
  "text-diff": Diff, "char-count": Type, "lorem": FileText, "picker": Users, "regex": Regex, "uuid": Fingerprint, "hash": Shuffle,
  "markdown": TextCursorInput, "gradient": Palette, "shadow": SquareDashed, "meta-tags": Tags, "robots": Bot, "utm": Megaphone,
};
