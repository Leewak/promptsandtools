// Free browser-based tools. Each entry drives /tools/[slug]: metadata, guide, FAQ and the interactive component.

export type ToolCategory = "pdf" | "image" | "forms" | "text" | "developer" | "security";
export interface ToolDef {
  slug: string;
  name: string;
  category: ToolCategory;
  title: string; // <title>
  description: string; // meta description
  h1: string;
  intro: string;
  steps: string[];
  faq: { q: string; a: string }[];
  related: string[];
}

export const toolCategories: Record<ToolCategory, string> = {
  forms: "Photos & documents for applications",
  pdf: "PDF tools",
  image: "Image tools",
  text: "Text tools",
  developer: "Developer tools",
  security: "Security tools",
};

export const tools: ToolDef[] = [
  {
    slug: "compress-pdf",
    name: "Compress PDF to 100KB, 200KB, 500KB",
    category: "pdf",
    title: "Compress PDF to 100KB, 200KB or 500KB Online Free",
    description: "Reduce a PDF to an exact size like 100 KB, 200 KB or 500 KB for upload forms. Free, no sign-up, and your file never leaves your device.",
    h1: "Compress PDF to a specific size (100 KB, 200 KB, 500 KB)",
    intro: "Job portals, exam forms and visa sites often reject PDFs above a size limit. Pick the limit you need and this tool shrinks your PDF until it fits, entirely in your browser.",
    steps: ["Choose your PDF.", "Pick a target such as 200 KB, or type your own limit.", "Click Compress and download the smaller PDF."],
    faq: [
      { q: "Is my PDF uploaded to a server?", a: "No. The PDF is processed by your browser on your own device, so it never leaves your computer or phone." },
      { q: "Why can't I select text in the compressed PDF?", a: "To reach strict size limits, each page is converted into a compressed image. That keeps the document readable but makes the text non-selectable." },
      { q: "What if it can't reach my target size?", a: "Very long documents may not fit a small limit and stay readable. Try a higher target, or split the PDF and upload the parts separately if the form allows." },
    ],
    related: ["image-to-pdf", "resize-image-kb", "image-compressor"],
  },
  {
    slug: "resize-image-kb",
    name: "Resize image to 20KB, 50KB, 100KB",
    category: "forms",
    title: "Resize Image to 20KB, 50KB or 100KB Online Free",
    description: "Reduce a photo to an exact file size in KB (20 KB, 50 KB, 100 KB) and optional pixel size for online applications. Free and private.",
    h1: "Resize an image to a size in KB (20 KB, 50 KB, 100 KB)",
    intro: "Online applications often ask for a photo 'under 50 KB' or 'between 20 and 100 KB'. Choose the limit and, if needed, the exact width and height in pixels.",
    steps: ["Choose your photo.", "Pick the maximum size in KB and, optionally, the width and height in pixels.", "Click Resize and download the JPG."],
    faq: [
      { q: "Will the photo still look good?", a: "The tool lowers JPG quality step by step and only reduces the dimensions if quality alone isn't enough, so you keep as much detail as the limit allows." },
      { q: "What format is the result?", a: "JPG, the format almost every application form accepts." },
      { q: "Is there a minimum size?", a: "If a form also has a minimum (for example 20 KB), set the maximum close to the upper limit, such as 45 KB for a 20–50 KB range." },
    ],
    related: ["passport-photo-maker", "signature-resizer", "image-compressor"],
  },
  {
    slug: "passport-photo-maker",
    name: "Passport & visa photo maker",
    category: "forms",
    title: "Passport & Visa Photo Maker Online Free (2x2, 35x45mm)",
    description: "Make a passport or visa photo in the right size: US 2x2 inch, UK and Schengen 35x45 mm, Canada, India and more. Download the photo or a 4x6 print sheet.",
    h1: "Passport and visa photo maker",
    intro: "Crop your own photo to the official size for the US (2×2 in), UK, Schengen, Canada, India, Australia, China or Morocco, then download it for an online application or as a 4×6 sheet to print.",
    steps: ["Take a front-facing photo against a plain, light background.", "Choose your country and document.", "Zoom and drag so your face sits inside the guide, then download the photo or the 4×6 print sheet."],
    faq: [
      { q: "Will this photo be accepted?", a: "The tool gives you the correct dimensions, but acceptance also depends on lighting, background, expression and head size. Always check the official rules of the authority you are applying to." },
      { q: "How do I print it?", a: "Download the 4×6 print sheet and print it at a photo kiosk or lab as a standard 4×6 inch (10×15 cm) photo, then cut out the copies." },
      { q: "Is my photo uploaded anywhere?", a: "No. Cropping happens in your browser and the photo stays on your device." },
    ],
    related: ["resize-image-kb", "signature-resizer", "image-to-pdf"],
  },
  {
    slug: "signature-resizer",
    name: "Signature resizer",
    category: "forms",
    title: "Signature Resizer Online: Resize Signature to 140x60, 20KB",
    description: "Resize a photo of your signature to the exact pixels and KB required by online forms (e.g. 140x60 px under 20 KB) with a clean white background.",
    h1: "Resize your signature for online forms",
    intro: "Upload a photo or scan of your signature. The tool crops it to the ink, whitens the background and exports it at the pixel size and KB limit your form asks for.",
    steps: ["Sign on plain white paper with a dark pen and take a sharp photo.", "Choose a preset or type the width, height and maximum KB.", "Click Resize and download the JPG."],
    faq: [
      { q: "Why is my background grey?", a: "Leave 'Clean background to pure white' switched on; it turns light grey paper into white and keeps the ink dark." },
      { q: "What size do forms usually ask for?", a: "Requirements vary by form. Common examples are 140×60 px under 20 KB or 300×80 px under 30 KB. Always use the size stated on your form." },
      { q: "Is my signature stored?", a: "No. It is processed on your device and never uploaded." },
    ],
    related: ["resize-image-kb", "passport-photo-maker", "compress-pdf"],
  },
  {
    slug: "image-to-pdf",
    name: "JPG / images to PDF",
    category: "pdf",
    title: "JPG to PDF: Combine Images into One PDF Online Free",
    description: "Convert JPG, PNG or WebP images into a single PDF. Reorder pages, choose A4 or Letter, and download. Free, no sign-up, files stay on your device.",
    h1: "Convert images to PDF (JPG, PNG, WebP to PDF)",
    intro: "Combine photos of documents, receipts or scans into one PDF in the order you choose, ready to email or upload.",
    steps: ["Choose one or more images.", "Reorder them with the arrows and pick a page size.", "Click Create PDF and download it."],
    faq: [
      { q: "How many images can I add?", a: "As many as your device can handle. Very large batches may take a little longer." },
      { q: "Can I make the PDF smaller?", a: "Yes. Download it, then use the PDF compressor to reach a size like 200 KB." },
      { q: "Does it work on a phone?", a: "Yes. It runs in any modern mobile browser and you can pick photos straight from your gallery." },
    ],
    related: ["compress-pdf", "image-compressor", "resize-image-kb"],
  },
  {
    slug: "image-compressor",
    name: "Image compressor",
    category: "image",
    title: "Image Compressor: Compress JPG, PNG, WebP Online Free",
    description: "Compress several images at once and convert between JPG, PNG and WebP. See the size saving before you download. Free and private.",
    h1: "Compress images (JPG, PNG, WebP)",
    intro: "Shrink photos for websites, email or messaging. Choose quality, output format and an optional maximum width, then download each compressed file.",
    steps: ["Choose one or more images.", "Set the quality, format and maximum width.", "Click Compress and download the results."],
    faq: [
      { q: "Which format gives the smallest file?", a: "For photos, WebP and JPG are usually much smaller than PNG. PNG is best for screenshots and graphics with sharp edges." },
      { q: "Will compression reduce quality?", a: "Some detail is removed at lower quality settings. Around 70% is usually a good balance for photos." },
      { q: "Are my images uploaded?", a: "No, compression runs in your browser." },
    ],
    related: ["resize-image-kb", "image-to-pdf", "passport-photo-maker"],
  },
  {
    slug: "qr-code-generator",
    name: "QR code generator",
    category: "developer",
    title: "Free QR Code Generator: PNG & SVG, No Sign-up",
    description: "Create a QR code for a link, text, Wi-Fi details or contact info. Choose colours and size, and download PNG or SVG. Free, no expiry.",
    h1: "QR code generator",
    intro: "Type a link or any text and get a QR code instantly. The codes are static, so they never expire and don't depend on this website.",
    steps: ["Enter a link or text.", "Adjust size, colours and error correction if you like.", "Download as PNG for screens or SVG for print."],
    faq: [
      { q: "Do these QR codes expire?", a: "No. The content is encoded directly in the code, so it works forever." },
      { q: "Which error correction should I use?", a: "Medium suits most uses. Choose High or Highest if the code will be printed small or might get scratched." },
      { q: "PNG or SVG?", a: "PNG for websites and messages; SVG for printing, because it scales without losing sharpness." },
    ],
    related: ["password-generator", "json-formatter", "word-counter"],
  },
  {
    slug: "word-counter",
    name: "Word & character counter",
    category: "text",
    title: "Word Counter & Character Counter Online Free",
    description: "Count words, characters (with and without spaces), sentences and paragraphs, plus reading time, as you type. Free online word counter.",
    h1: "Word and character counter",
    intro: "Paste an essay, post or application answer to check it against a word or character limit.",
    steps: ["Type or paste your text.", "Read the live counts above the box."],
    faq: [
      { q: "How is reading time calculated?", a: "It assumes an average silent reading speed of about 238 words per minute." },
      { q: "Does it count spaces as characters?", a: "Both counts are shown: with spaces and without." },
      { q: "Is my text saved?", a: "No. The text stays in your browser and disappears when you close the page." },
    ],
    related: ["json-formatter", "password-generator", "qr-code-generator"],
  },
  {
    slug: "password-generator",
    name: "Password generator",
    category: "security",
    title: "Strong Password Generator: Random & Secure",
    description: "Generate strong random passwords with your choice of length, letters, numbers and symbols, using your browser's secure random generator.",
    h1: "Strong password generator",
    intro: "Create a random password that is hard to guess. Use a different password for every account and keep them in a password manager.",
    steps: ["Choose the length and character types.", "Click Generate new until you like it.", "Copy it into your password manager or sign-up form."],
    faq: [
      { q: "Is this generator safe?", a: "Passwords are generated on your device with the Web Crypto secure random function and are never sent anywhere." },
      { q: "How long should a password be?", a: "At least 14–16 characters for important accounts. Longer is stronger." },
      { q: "Why are some characters missing?", a: "Look-alike characters such as l, 1, O and 0 are excluded so passwords are easier to type correctly." },
    ],
    related: ["qr-code-generator", "json-formatter", "word-counter"],
  },
  {
    slug: "json-formatter",
    name: "JSON formatter & validator",
    category: "developer",
    title: "JSON Formatter & Validator Online (Beautify, Minify)",
    description: "Format, validate and minify JSON instantly. See the error and line number when JSON is invalid. Runs in your browser.",
    h1: "JSON formatter and validator",
    intro: "Paste JSON to pretty-print it, check that it is valid, or minify it for production.",
    steps: ["Paste your JSON.", "Click Format / validate or Minify.", "Copy or download the result."],
    faq: [
      { q: "Is my JSON sent to a server?", a: "No. Parsing happens in your browser, so it is safe for API responses and config files." },
      { q: "What does minify do?", a: "It removes all whitespace to make the JSON as small as possible." },
      { q: "Why is my JSON invalid?", a: "Common causes are trailing commas, single quotes instead of double quotes, and unquoted keys. The error message shows where parsing failed." },
    ],
    related: ["qr-code-generator", "word-counter", "password-generator"],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
