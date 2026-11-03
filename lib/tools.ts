import { MEDIA_TOOLS, type MediaKind } from "./tools-media";

// Free browser-based tools. Each entry drives a tool page: metadata, guide, FAQ, JSON-LD and the interactive component.
// Size variants (PDF 100/200/500 KB, photo 20/50/100 KB) and passport countries get their own indexable URLs.

export type ToolCategory = "PDF" | "Image" | "Photo ID" | "Utilities";
export type ToolKind = "compress-pdf" | "resize-image-kb" | "passport-photo" | "signature-resizer" | "image-to-pdf" | "image-compressor" | "qr-code-generator" | "word-counter" | "password-generator" | "json-formatter" | MediaKind;

export interface ToolDef {
  slug: string; // path after /tools/
  kind: ToolKind;
  card: boolean; // shown in the homepage grid
  name: string;
  short: string; // card description
  category: ToolCategory;
  formats: string[];
  keywords: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  howToTitle: string;
  steps: string[];
  faq: { q: string; a: string }[];
  related: string[];
  crumb: string;
  props?: Record<string, string | number>;
}

export const categoryColor: Record<ToolCategory, string> = { PDF: "#60A5FA", Image: "#22D3EE", "Photo ID": "#A78BFA", Utilities: "#FBBF24" };
export const categoryAnchor: Record<ToolCategory, string> = { PDF: "pdf", Image: "image", "Photo ID": "photo-id", Utilities: "utilities" };

const T = (n: string) => `${n} | Prompts&Tools`;

const pdfVariant = (kb: number): ToolDef => ({
  slug: `compress-pdf-to-${kb}kb`, kind: "compress-pdf", card: kb === 200, props: { defaultKb: kb },
  name: "Compress PDF to size", short: "Shrink a PDF to 100 KB, 200 KB or 500 KB for upload portals.", category: "PDF",
  formats: ["100 KB", "200 KB", "500 KB"], keywords: `compress pdf kb ${kb}kb reduce size`,
  title: T(`Compress PDF to ${kb} KB Online Free (No Upload)`),
  description: `Compress a PDF to under ${kb} KB for job portals, exam and visa forms. Free, no sign-up, and the file is processed on your device, never uploaded.`,
  h1: `Compress PDF to ${kb} KB`,
  intro: "Shrink a PDF under the limit an upload portal asks for. The file is compressed in your browser and never uploaded.",
  howToTitle: `How to compress a PDF to ${kb} KB`,
  steps: ["Pick the target size the form asks for. Use Custom if your limit is different.", "Add your PDF. The tool lowers quality step by step until the file fits.", "Download it. The final size is shown before you save."],
  faq: [
    { q: "Is my PDF uploaded anywhere?", a: "No. The file is processed in your browser with JavaScript. Nothing is sent to a server, and closing the tab clears it." },
    { q: `What if my PDF can't get under ${kb} KB?`, a: "Long scanned PDFs may not fit. The tool shows the smallest size it reached; try a higher target or split the file into parts if the form allows several uploads." },
    { q: "Will the text stay readable?", a: "Yes, it stays readable, but to reach strict limits each page is turned into a compressed image, so the text can no longer be selected or searched. Check the result before you submit it." },
    { q: "Is there a file size or daily limit?", a: "We set no limit. Very large files depend on how much memory your device has." },
  ],
  related: ["resize-image-to-50kb", "image-to-pdf", "image-compressor", "signature-resizer"],
  crumb: `Compress to ${kb} KB`,
});

const imgVariant = (kb: number): ToolDef => ({
  slug: `resize-image-to-${kb}kb`, kind: "resize-image-kb", card: kb === 50, props: { defaultKb: kb },
  name: "Resize image to KB", short: "Hit an exact file size like 20 KB or 50 KB for application forms.", category: "Image",
  formats: ["20 KB", "50 KB", "100 KB"], keywords: `photo image resize kb ${kb}kb reduce size`,
  title: T(`Resize Image to ${kb} KB Online Free (No Upload)`),
  description: `Reduce a photo to under ${kb} KB, with optional width and height in pixels, for online applications. Free and private: nothing is uploaded.`,
  h1: `Resize image to ${kb} KB`,
  intro: `Online forms often ask for a photo under ${kb} KB. Pick the limit and, if needed, the exact pixel size. Your photo is processed in your browser and never uploaded.`,
  howToTitle: `How to resize a photo to ${kb} KB`,
  steps: [`Add your photo (JPG, PNG or WebP).`, `Keep ${kb} KB or type your own limit, plus width and height if the form asks for them.`, "Click Resize and download the JPG."],
  faq: [
    { q: "Will the photo still look good?", a: "The tool lowers JPG quality step by step and only reduces the dimensions if quality alone isn't enough, so you keep as much detail as the limit allows." },
    { q: "What format is the result?", a: "JPG, the format almost every application form accepts." },
    { q: "My form has a minimum size too. What should I do?", a: "Set the limit close to the upper bound, for example 45 KB for a 20–50 KB range, so the file lands inside the range." },
  ],
  related: ["passport-photo", "signature-resizer", "image-compressor", "compress-pdf-to-200kb"],
  crumb: `Resize to ${kb} KB`,
});

export const PASSPORT_COUNTRIES = [
  { id: "us", name: "United States", doc: "passport & visa", size: "2×2 in", w: 51, h: 51 },
  { id: "uk", name: "United Kingdom", doc: "passport", size: "35×45 mm", w: 35, h: 45 },
  { id: "schengen", name: "Schengen", doc: "visa", size: "35×45 mm", w: 35, h: 45 },
  { id: "canada", name: "Canada", doc: "passport", size: "50×70 mm", w: 50, h: 70 },
  { id: "india", name: "India", doc: "passport", size: "35×45 mm", w: 35, h: 45 },
  { id: "australia", name: "Australia", doc: "passport", size: "35×45 mm", w: 35, h: 45 },
  { id: "china", name: "China", doc: "visa", size: "33×48 mm", w: 33, h: 48 },
  { id: "morocco", name: "Morocco", doc: "passport & ID", size: "35×45 mm", w: 35, h: 45 },
];

const passportFaq = (country?: string) => [
  { q: `Will this ${country ? country + " " : ""}photo be accepted?`, a: "The tool gives you the correct dimensions, but acceptance also depends on lighting, background, expression and head size. Always check the current official rules before you submit." },
  { q: "How do I print it?", a: "Download the 4×6 in print sheet and print it at a photo kiosk or lab as a standard 4×6 in (10×15 cm) photo, then cut out the copies." },
  { q: "Is my photo uploaded anywhere?", a: "No. Cropping happens in your browser and the photo stays on your device." },
];

export const passportGeneric: ToolDef = {
  slug: "passport-photo", kind: "passport-photo", card: true,
  name: "Passport & visa photo maker", short: "Crop to official sizes for the US, UK, Schengen, Canada, India and more.", category: "Photo ID",
  formats: ["2×2 in", "35×45 mm"], keywords: "passport visa photo id picture",
  title: T("Passport & Visa Photo Maker Online Free (2×2 in, 35×45 mm)"),
  description: "Make a passport or visa photo in the official size: US 2×2 in, UK and Schengen 35×45 mm, Canada, India, Australia and more. Download the photo or a 4×6 print sheet.",
  h1: "Passport & visa photo maker",
  intro: "Choose a country, line your face up with the guide, and download a single photo or a printable 4×6 in sheet. Your photo never leaves your device.",
  howToTitle: "How to make a passport photo",
  steps: ["Take a front-facing photo against a plain, light background.", "Choose your country and document.", "Zoom and drag so your face sits inside the guide, then download the photo or the 4×6 print sheet."],
  faq: passportFaq(), related: ["resize-image-to-50kb", "signature-resizer", "image-to-pdf", "compress-pdf-to-200kb"], crumb: "Passport photo",
};

export const passportFor = (id: string): ToolDef | undefined => {
  const c = PASSPORT_COUNTRIES.find((x) => x.id === id);
  if (!c) return;
  return {
    ...passportGeneric, slug: `passport-photo/${c.id}`, card: false, props: { defaultSize: c.id },
    title: T(`${c.name} ${c.doc.replace(" & ", " & ")} Photo Maker (${c.size}) Online Free`),
    description: `Make a ${c.name} ${c.doc} photo in the official ${c.size} size. Crop your own photo, then download it or a 4×6 print sheet. Free, no upload.`,
    h1: `${c.name} ${c.doc} photo (${c.size})`,
    intro: `Crop your own photo to the ${c.name} ${c.doc} size of ${c.size}, then download it for an online application or as a 4×6 in sheet to print. Your photo never leaves your device.`,
    howToTitle: `How to make a ${c.name} ${c.doc} photo`,
    faq: passportFaq(c.name), crumb: `${c.name} (${c.size})`,
  };
};

const base: ToolDef[] = [
  pdfVariant(100), pdfVariant(200), pdfVariant(500),
  imgVariant(20), imgVariant(50), imgVariant(100),
  passportGeneric,
  {
    slug: "signature-resizer", kind: "signature-resizer", card: true,
    name: "Signature resizer", short: "Resize a scanned signature to the pixel and KB limits forms ask for.", category: "Photo ID",
    formats: ["px", "KB"], keywords: "signature kb resize sign",
    title: T("Signature Resizer Online: Resize Signature to 140×60 px, 20 KB"),
    description: "Resize a photo of your signature to the exact pixels and KB required by online forms (e.g. 140×60 px under 20 KB) with a clean white background.",
    h1: "Resize your signature for online forms",
    intro: "Add a photo or scan of your signature. The tool crops it to the ink, whitens the background and exports it at the pixel size and KB limit your form asks for.",
    howToTitle: "How to resize a signature",
    steps: ["Sign on plain white paper with a dark pen and take a sharp photo.", "Choose a preset or type the width, height and maximum KB.", "Click Resize and download the JPG."],
    faq: [
      { q: "Why is my background grey?", a: "Leave 'Clean background to pure white' switched on: it turns light grey paper into white and keeps the ink dark." },
      { q: "What size do forms usually ask for?", a: "Requirements vary by form. Common examples are 140×60 px under 20 KB or 300×80 px under 30 KB. Always use the size stated on your form." },
      { q: "Is my signature stored?", a: "No. It is processed on your device and never uploaded." },
    ],
    related: ["resize-image-to-20kb", "passport-photo", "compress-pdf-to-200kb"], crumb: "Signature resizer",
  },
  {
    slug: "image-to-pdf", kind: "image-to-pdf", card: true,
    name: "Image to PDF", short: "Combine several photos or scans into one PDF, in the order you choose.", category: "PDF",
    formats: ["JPG", "PNG"], keywords: "image pdf photo jpg png convert",
    title: T("JPG to PDF: Combine Images into One PDF Online Free"),
    description: "Convert JPG, PNG or WebP images into a single PDF. Reorder pages, choose A4 or Letter, and download. Free, no sign-up, files stay on your device.",
    h1: "Image to PDF (JPG, PNG, WebP)",
    intro: "Combine photos of documents, receipts or scans into one PDF in the order you choose, ready to email or upload.",
    howToTitle: "How to turn images into a PDF",
    steps: ["Add one or more images.", "Reorder them with the arrows and pick a page size.", "Click Create PDF and download it."],
    faq: [
      { q: "How many images can I add?", a: "As many as your device can handle. Very large batches may take a little longer." },
      { q: "Can I make the PDF smaller?", a: "Yes. Download it, then use the PDF compressor to reach a size like 200 KB." },
      { q: "Does it work on a phone?", a: "Yes. It runs in any modern mobile browser and you can pick photos straight from your gallery." },
    ],
    related: ["compress-pdf-to-200kb", "image-compressor", "resize-image-to-50kb"], crumb: "Image to PDF",
  },
  {
    slug: "image-compressor", kind: "image-compressor", card: true,
    name: "Image compressor & converter", short: "Compress images and convert between JPG, PNG and WebP.", category: "Image",
    formats: ["JPG", "PNG", "WebP"], keywords: "image photo compress convert jpg png webp",
    title: T("Image Compressor & Converter: JPG, PNG, WebP Online Free"),
    description: "Compress several images at once and convert between JPG, PNG and WebP. See the size saving before you download. Free and private.",
    h1: "Image compressor & converter",
    intro: "Shrink photos for websites, email or messaging. Choose quality, output format and an optional maximum width, then download each compressed file.",
    howToTitle: "How to compress images",
    steps: ["Add one or more images.", "Set the quality, format and maximum width.", "Click Compress and download the results."],
    faq: [
      { q: "Which format gives the smallest file?", a: "For photos, WebP and JPG are usually much smaller than PNG. PNG is best for screenshots and graphics with sharp edges." },
      { q: "Will compression reduce quality?", a: "Some detail is removed at lower quality settings. Around 70% is usually a good balance for photos." },
      { q: "Are my images uploaded?", a: "No, compression runs in your browser." },
    ],
    related: ["resize-image-to-50kb", "image-to-pdf", "passport-photo"], crumb: "Image compressor",
  },
  {
    slug: "qr-code-generator", kind: "qr-code-generator", card: true,
    name: "QR code generator", short: "Make QR codes for links, Wi‑Fi and contact cards. Download PNG or SVG.", category: "Utilities",
    formats: ["PNG", "SVG"], keywords: "qr code generator link",
    title: T("Free QR Code Generator: PNG & SVG, No Sign-up"),
    description: "Create a QR code for a link or any text. Choose colours and size, and download PNG or SVG. Free, no expiry.",
    h1: "QR code generator",
    intro: "Type a link or any text and get a QR code instantly. The codes are static, so they never expire and don't depend on this website.",
    howToTitle: "How to make a QR code",
    steps: ["Enter a link or text.", "Adjust size, colours and error correction if you like.", "Download as PNG for screens or SVG for print."],
    faq: [
      { q: "Do these QR codes expire?", a: "No. The content is encoded directly in the code, so it works forever." },
      { q: "Which error correction should I use?", a: "Medium suits most uses. Choose High or Highest if the code will be printed small or might get scratched." },
      { q: "PNG or SVG?", a: "PNG for websites and messages; SVG for printing, because it scales without losing sharpness." },
    ],
    related: ["password-generator", "json-formatter", "word-counter"], crumb: "QR code generator",
  },
  {
    slug: "word-counter", kind: "word-counter", card: true,
    name: "Word & character counter", short: "Count words, characters and reading time as you type or paste.", category: "Utilities",
    formats: ["Words", "Chars"], keywords: "word character count counter",
    title: T("Word Counter & Character Counter Online Free"),
    description: "Count words, characters (with and without spaces), sentences and paragraphs, plus reading time, as you type.",
    h1: "Word & character counter",
    intro: "Paste an essay, post or application answer to check it against a word or character limit.",
    howToTitle: "How to count words",
    steps: ["Type or paste your text.", "Read the live counts above the box."],
    faq: [
      { q: "How is reading time calculated?", a: "It assumes an average silent reading speed of about 238 words per minute." },
      { q: "Does it count spaces as characters?", a: "Both counts are shown: with spaces and without." },
      { q: "Is my text saved?", a: "No. The text stays in your browser and disappears when you close the page." },
    ],
    related: ["json-formatter", "password-generator", "qr-code-generator"], crumb: "Word counter",
  },
  {
    slug: "password-generator", kind: "password-generator", card: true,
    name: "Password generator", short: "Strong random passwords with the length and characters you choose.", category: "Utilities",
    formats: ["8–64 chars"], keywords: "password generator strong random",
    title: T("Strong Password Generator: Random & Secure"),
    description: "Generate strong random passwords with your choice of length, letters, numbers and symbols, using your browser's secure random generator.",
    h1: "Strong password generator",
    intro: "Create a random password that is hard to guess. Use a different password for every account and keep them in a password manager.",
    howToTitle: "How to generate a strong password",
    steps: ["Choose the length and character types.", "Click Generate new until you like it.", "Copy it into your password manager or sign-up form."],
    faq: [
      { q: "Is this generator safe?", a: "Passwords are generated on your device with the Web Crypto secure random function and are never sent anywhere." },
      { q: "How long should a password be?", a: "At least 14–16 characters for important accounts. Longer is stronger." },
      { q: "Why are some characters missing?", a: "Look-alike characters such as l, 1, O and 0 are excluded so passwords are easier to type correctly." },
    ],
    related: ["qr-code-generator", "json-formatter", "word-counter"], crumb: "Password generator",
  },
  {
    slug: "json-formatter", kind: "json-formatter", card: true,
    name: "JSON formatter", short: "Format, validate and minify JSON, with errors pointed out by line.", category: "Utilities",
    formats: ["Format", "Minify"], keywords: "json formatter validator beautify minify",
    title: T("JSON Formatter & Validator Online (Beautify, Minify)"),
    description: "Format, validate and minify JSON instantly. See the error and line number when JSON is invalid. Runs in your browser.",
    h1: "JSON formatter & validator",
    intro: "Paste JSON to pretty-print it, check that it is valid, or minify it for production.",
    howToTitle: "How to format JSON",
    steps: ["Paste your JSON.", "Click Format / validate or Minify.", "Copy or download the result."],
    faq: [
      { q: "Is my JSON sent to a server?", a: "No. Parsing happens in your browser, so it is safe for API responses and config files." },
      { q: "What does minify do?", a: "It removes all whitespace to make the JSON as small as possible." },
      { q: "Why is my JSON invalid?", a: "Common causes are trailing commas, single quotes instead of double quotes, and unquoted keys. The error message shows where parsing failed." },
    ],
    related: ["qr-code-generator", "word-counter", "password-generator"], crumb: "JSON formatter",
  },
];

/** Every flat /tools/[slug] page (passport countries live under /tools/passport-photo/[country]). */
export const tools = [...base, ...MEDIA_TOOLS];
export const cardTools = tools.filter((t) => t.card);
export const getTool = (slug: string) => tools.find((t) => t.slug === slug) ?? (slug.startsWith("passport-photo/") ? passportFor(slug.split("/")[1]) : undefined);
export const allToolPaths = [...tools.map((t) => t.slug), ...PASSPORT_COUNTRIES.map((c) => `passport-photo/${c.id}`)];
