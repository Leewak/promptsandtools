// Long-form guide text shown under each tool (between "How to" and FAQ).
// Purpose: give tool pages real explanatory content so they are not just a form.
// Rules: describe only what the tool really does; no invented stats or test claims.
// Links use [label](/path) and are rendered by components/tools/Rich.tsx.
import type { ToolDef } from "./tools";

export type GuideSection = { h2: string; paras: string[]; list?: string[] };

const PRIVACY =
  "The file is processed by your browser on your own device. It is not uploaded to a server, so nothing is stored or seen by anyone else, and the tool keeps working on slow connections once the page has loaded.";

// ---------- Compress PDF (100 / 200 / 500 KB variants) ----------
const compressPdfBase: GuideSection[] = [
  {
    h2: "Why upload portals limit PDF size",
    paras: [
      "Job portals, university applications, visa systems and government forms often cap each file at 100 KB, 200 KB or 500 KB. The limit keeps their storage small and uploads fast, but a scanned document straight from a phone or scanner is often several megabytes.",
      "Most of that size comes from page images. A scan is really a photo of each page, saved at high resolution. Compression lowers the resolution and JPEG quality of those images until the whole file fits under the limit, while keeping the text readable.",
    ],
  },
  {
    h2: "How this compressor works",
    paras: [
      "The tool renders each page, then saves it again with lower quality and resolution, step by step, until the PDF is under your target. It stops at the first result that fits, so you keep as much quality as the limit allows.",
      "Because pages are rebuilt as images, the text in the compressed PDF can no longer be selected or searched. That is normally fine for upload forms, which only need the document to be legible. " + PRIVACY,
    ],
  },
  {
    h2: "Tips for the best result",
    paras: ["If the result is blurry, or the tool cannot reach your target, try these steps:"],
    list: [
      "Remove pages the form does not need. Fewer pages leave more room for each one. Use [Delete PDF pages](/tools/delete-pdf-pages) or [Extract PDF pages](/tools/extract-pdf-pages) first.",
      "Scan in black and white or greyscale instead of colour when colour is not required.",
      "Split a long document into parts if the portal accepts several files, see [Split PDF](/tools/split-pdf).",
      "For photos of documents, crop away the table and background before making the PDF with [Image to PDF](/tools/image-to-pdf).",
      "Password-protected PDFs must be unlocked in your PDF reader first.",
    ],
  },
];
const compressPdfSize: Record<number, GuideSection> = {
  100: {
    h2: "Is 100 KB enough for my document?",
    paras: [
      "100 KB is a tight limit. It works well for one to three pages of mostly text, such as an ID card copy, a certificate or a one-page form. For longer scans the pages become noticeably softer. If the portal allows it, [compress to 200 KB](/tools/compress-pdf-to-200kb) instead for sharper text.",
    ],
  },
  200: {
    h2: "Is 200 KB enough for my document?",
    paras: [
      "200 KB is the most common limit on application portals. It is usually enough for a CV, a mark sheet, an ID document or a short scanned letter of a few pages with clear, readable text. For very short documents you can go smaller with [compress to 100 KB](/tools/compress-pdf-to-100kb).",
    ],
  },
  500: {
    h2: "Is 500 KB enough for my document?",
    paras: [
      "500 KB leaves plenty of room. Multi-page scans, documents with photos or colour pages and longer reports usually stay sharp at this size. If the form has a lower limit, use [compress to 200 KB](/tools/compress-pdf-to-200kb) or [compress to 100 KB](/tools/compress-pdf-to-100kb).",
    ],
  },
};

// ---------- Resize image to KB (20 / 50 / 100 KB variants) ----------
const resizeKbBase: GuideSection[] = [
  {
    h2: "Why forms ask for a photo under a certain size",
    paras: [
      "Exam registrations, job applications, visa forms and government portals usually set two rules for photos: a maximum file size in KB, and sometimes exact dimensions in pixels. A photo from a modern phone is often 2–5 MB and several thousand pixels wide, so it is rejected straight away.",
      "File size and pixel size are different things. Pixels decide how large the image is; kilobytes decide how much data is stored. This tool can change both: it scales the photo to the pixel size you enter, then adjusts JPEG quality until the file fits under your KB limit.",
    ],
  },
  {
    h2: "How to get the size right first time",
    list: [
      "Read the form instructions for both values, for example \"under 50 KB, 200 × 230 pixels\".",
      "Crop the photo first if the form wants a face or a signature only. A tighter crop keeps more detail at small sizes. Use [Crop image](/tools/crop-image).",
      "Enter the width and height if the form specifies them; leave them empty to keep the original proportions.",
      "Check the result preview. If faces look blocky, the limit is very tight for that pixel size: try slightly smaller dimensions.",
    ],
    paras: [PRIVACY],
  },
  {
    h2: "Common photo requirements",
    paras: [
      "Requirements differ by portal, so always follow the official instructions. Typical patterns are a passport-style photo under 50 KB, a signature under 20 KB, and a scanned document under 100–300 KB. For signatures there is a dedicated [signature resizer](/tools/signature-resizer), and for passport and visa photos at the correct printed size use the [passport photo maker](/tools/passport-photo).",
    ],
  },
];
const resizeKbSize: Record<number, GuideSection> = {
  20: {
    h2: "Is 20 KB enough for a photo?",
    paras: [
      "20 KB is very small, but it works for signatures and for small photos of around 150–200 pixels wide, which is what forms with this limit usually expect. A full-size photo at 20 KB will look blocky, so enter the pixel size the form asks for. Signatures usually look cleaner with the [signature resizer](/tools/signature-resizer).",
    ],
  },
  50: {
    h2: "Is 50 KB enough for a photo?",
    paras: [
      "50 KB is the most common limit for applicant photos. At typical form sizes of around 200–600 pixels wide, a face photo stays clear at this size. If your portal allows more, [resize to 100 KB](/tools/resize-image-to-100kb) for extra detail; for signatures, [resize to 20 KB](/tools/resize-image-to-20kb).",
    ],
  },
  100: {
    h2: "Is 100 KB enough for a photo?",
    paras: [
      "100 KB is comfortable for a portrait photo of up to roughly 800–1000 pixels wide, and for clear photos of small documents. If the form wants something smaller, use [resize to 50 KB](/tools/resize-image-to-50kb). To shrink many photos at once without a fixed KB target, the [image compressor](/tools/image-compressor) is faster.",
    ],
  },
};

// ---------- Single tools ----------
const guides: Record<string, GuideSection[]> = {
  "passport-photo": [
    {
      h2: "What makes a passport photo acceptable",
      paras: [
        "Each country publishes its own photo rules, but most share the same basics: a recent colour photo, a plain light background, the face looking straight at the camera with a neutral expression, eyes open and visible, no glasses glare, even lighting without shadows on the face, and the head filling a set share of the frame.",
        "The printed size differs: many countries, including the UK, Schengen states, India and Australia, use 35 × 45 mm, while the United States uses 2 × 2 inches (51 × 51 mm) and Canada 50 × 70 mm. This tool crops your photo to the selected format.",
      ],
    },
    {
      h2: "Taking the photo at home",
      list: [
        "Stand about half a metre in front of a plain white or light grey wall.",
        "Face a window or use soft, even light from the front, so there are no shadows on the face or behind you.",
        "Ask someone else to take the photo at eye level from about 1.5 m away, rather than taking a selfie, which distorts the face.",
        "Remove glasses if the country requires it, keep hair away from the eyes and keep a neutral expression.",
      ],
      paras: [],
    },
    {
      h2: "Printing and online applications",
      paras: [
        "Download the 4 × 6 inch print sheet to print several photos at once at a photo kiosk or online print service: it is the standard photo print size, so the photos come out at the correct physical size when printed at 100% without scaling.",
        "For online applications, download the single photo. If the portal also sets a file size limit, run it through [resize image to 50 KB](/tools/resize-image-to-50kb). " + PRIVACY,
        "This tool helps with cropping and sizing, but the final decision is made by the authority checking your application. Always compare your photo with the official requirements for your country.",
      ],
    },
  ],
  "image-to-pdf": [
    {
      h2: "When to turn images into a PDF",
      paras: [
        "Many forms accept only PDF files, even when what you have are phone photos of documents, receipts or ID cards. Combining images into one PDF also keeps multi-page documents together in the right order, which is easier to send and to read than a folder of separate JPGs.",
        "This tool accepts JPG, PNG and WebP images, lets you reorder them, and puts each image on its own page. You can choose A4, US Letter or pages that match each image's size, and add a margin around the image.",
      ],
    },
    {
      h2: "Choosing page size and margin",
      list: [
        "A4: the standard paper size in most of the world. Choose it for documents that may be printed.",
        "US Letter: the standard in the United States and Canada.",
        "Same as image: each page takes the size of its picture. Best for screenshots and photos that will only be viewed on screen.",
        "Margin: a small margin gives scanned documents a cleaner, printed look; set it to 0 for edge-to-edge images.",
      ],
      paras: [],
    },
    {
      h2: "Tips for document photos",
      paras: [
        "Photograph documents flat, in good light, from straight above to avoid slanted edges. Crop away the table or background with [Crop image](/tools/crop-image) before converting, and rotate sideways photos with [Rotate and flip image](/tools/rotate-flip-image).",
        "If the finished PDF is too large for an upload form, use [Compress PDF to 200 KB](/tools/compress-pdf-to-200kb). To add more pages to an existing PDF, create a PDF from the new images and join them with [Merge PDF](/tools/merge-pdf). " + PRIVACY,
      ],
    },
  ],
  "image-compressor": [
    {
      h2: "What image compression does",
      paras: [
        "Compression reduces the file size of an image by storing it more efficiently and, for lossy formats, by discarding detail that is hard to see. Smaller images load faster on websites, send faster by email and messaging apps, and use less storage.",
        "This tool lets you choose the output format, set the quality with a slider and optionally limit the width in pixels. Reducing the width is often the biggest saving: a 4000-pixel phone photo shown at 1200 pixels on a website carries much more data than anyone sees.",
      ],
    },
    {
      h2: "JPG, PNG or WebP?",
      list: [
        "JPG: best for photos. Small files at quality settings around 70–80% with little visible loss. No transparency.",
        "PNG: lossless, so text, logos and screenshots stay pixel-sharp, and it supports transparency. Files are larger for photos.",
        "WebP: a modern format supported by current browsers that is usually smaller than JPG at similar quality and supports transparency. Some older software and upload forms do not accept it.",
      ],
      paras: [
        "For a website, WebP or JPG at 70–80% quality with a sensible maximum width is a good default. For an upload form that names a format, use exactly that format. To convert without compressing, see [JPG to PNG](/tools/jpg-to-png), [PNG to JPG](/tools/png-to-jpg) or [WebP to JPG](/tools/webp-to-jpg).",
      ],
    },
    {
      h2: "Hitting an exact size",
      paras: [
        "The compressor works with quality settings rather than a fixed KB target. If a form requires a photo under an exact size, such as 50 KB, use [Resize image to 50 KB](/tools/resize-image-to-50kb), which searches for the right quality automatically. " + PRIVACY,
      ],
    },
  ],
  "qr-code-generator": [
    {
      h2: "What you can put in a QR code",
      paras: [
        "A QR code stores text that a phone camera can read. Most often that text is a web address, but it can also be plain text, a phone number, an email address or Wi-Fi details written in a format that phones understand.",
        "The codes made here are static: the content is written directly into the pattern. There is no redirect through this website, no tracking and no expiry date. The code keeps working as long as the content (for example your web page) exists. The trade-off is that a static code cannot be edited after printing; to change the destination you make a new code.",
      ],
    },
    {
      h2: "Size, colour and error correction",
      list: [
        "Size: for print, download the SVG, which stays sharp at any size. PNG is fine for screens, documents and social media.",
        "Colour: keep strong contrast, ideally a dark code on a light background. Light codes on dark backgrounds or low-contrast colours can fail to scan on some phones.",
        "Error correction: higher levels let the code still scan when part of it is dirty, damaged or covered by a small logo, but make the pattern denser. Medium suits most uses; choose High or Highest for outdoor signs and printed packaging.",
      ],
      paras: [],
    },
    {
      h2: "Printing tips",
      paras: [
        "Keep a quiet border of empty space around the code, do not stretch it, and print it at least about 2 cm (0.8 in) wide for close-up scanning, larger for posters read from a distance. Short URLs give simpler patterns that scan more easily, so use a short link where you can, and add tracking parameters with the [UTM link builder](/tools/utm-link-builder) if you want to see visits in your analytics.",
        "Always test the printed code with two or three different phones before printing a large batch.",
      ],
    },
  ],
  "word-counter": [
    {
      h2: "What the word counter measures",
      paras: [
        "Paste or type text to see words, characters with and without spaces, sentences, paragraphs and an estimated reading time. The counts update as you type, so you can trim an essay or a post while watching the numbers.",
        "Reading time is estimated at about 238 words per minute, a commonly cited average for silent reading of non-fiction in English. Actual speed varies with the reader and how difficult the text is.",
      ],
    },
    {
      h2: "Common word and character limits",
      list: [
        "School and university essays: often 250, 500, 1,000 or 2,000 words, sometimes with a tolerance of about 10%.",
        "College application essays: often around 250–650 words, depending on the system and the prompt.",
        "Meta descriptions for search results: roughly 150–160 characters before they may be cut off.",
        "Social media: X (Twitter) posts are limited to 280 characters on standard accounts; other platforms have their own limits.",
      ],
      paras: [
        "Always check the exact rules of your course, publisher or platform, since they differ. For counting characters only, the [character counter](/tools/character-counter) shows character-focused figures.",
      ],
    },
    {
      h2: "How words are counted",
      paras: [
        "A word is any group of characters separated by spaces or line breaks, which matches how most word processors count. Hyphenated terms like \"well-known\" count as one word; numbers count as words. Different programs can differ by a few words on the same text, so allow a small margin when a limit is strict.",
        "Your text stays in your browser and is not sent anywhere. To clean up pasted text first, try [Remove extra spaces](/tools/remove-extra-spaces) or [Remove line breaks](/tools/remove-line-breaks).",
      ],
    },
  ],
  "password-generator": [
    {
      h2: "What makes a password strong",
      paras: [
        "A strong password is long and random. Length matters most: each extra character multiplies the number of possible combinations. Mixing lowercase, uppercase, digits and symbols increases the choice for every character, but a long password from a smaller character set can still be stronger than a short one with symbols.",
        "The tool shows an estimate in bits of entropy, which describes how many guesses an attacker would need for a password generated this way. As a rough guide, 70 bits or more is strong for online accounts, and 100 bits or more is very strong.",
      ],
    },
    {
      h2: "How the passwords are generated",
      paras: [
        "Passwords are created in your browser with the Web Crypto API (crypto.getRandomValues), the browser's cryptographically secure random number generator, rather than Math.random. Each chosen character type is included at least once and the characters are then shuffled.",
        "Nothing is sent to a server or stored. Once you close or refresh the page, the password exists only where you saved it.",
      ],
    },
    {
      h2: "Good password habits",
      list: [
        "Use a different password for every account. Reused passwords are the main way one data breach spreads to other accounts.",
        "Store passwords in a reputable password manager instead of a note or spreadsheet.",
        "Turn on two-factor authentication for email, banking and social accounts.",
        "Some sites limit length or reject certain symbols. If a password is refused, untick Symbols and use a longer length instead.",
      ],
      paras: [],
    },
  ],
  "json-formatter": [
    {
      h2: "Format, validate and minify JSON",
      paras: [
        "JSON (JavaScript Object Notation) is the standard text format for API responses, configuration files and data exchange. Machine-generated JSON is often a single long line, which is hard to read. Formatting adds line breaks and indentation so you can see the structure at a glance.",
        "The tool also validates the input. If the JSON is invalid, it reports the error so you can find the problem. Minify does the opposite of formatting: it removes all unnecessary whitespace to make the data as small as possible for sending or storing.",
      ],
    },
    {
      h2: "Common JSON errors",
      list: [
        "Trailing commas after the last item in an object or array, which JSON does not allow.",
        "Single quotes instead of double quotes around strings and keys.",
        "Keys without quotes, as in JavaScript object literals.",
        "Comments, which standard JSON does not support.",
        "Unescaped line breaks or quote marks inside strings.",
      ],
      paras: [],
    },
    {
      h2: "Related developer tools",
      paras: [
        "Convert JSON for spreadsheets with [JSON to CSV](/tools/json-to-csv) or the other way with [CSV to JSON](/tools/csv-to-json), and turn it into configuration syntax with [JSON to YAML](/tools/json-to-yaml). To inspect a login token, the [JWT decoder](/tools/jwt-decoder) shows its JSON contents.",
        "Your data is processed in the browser and not uploaded, which matters when the JSON contains API keys, customer data or internal configuration. Even so, avoid pasting live secrets into any website you do not control.",
      ],
    },
  ],
  "signature-resizer": [
    {
      h2: "Why signatures need resizing",
      paras: [
        "Online application forms for exams, jobs, banks and government services often ask for a scanned signature with strict rules, typically a width and height in pixels and a maximum size such as 10–20 KB. A phone photo of a signature is far too large and usually includes the paper, shadows and the table around it.",
        "This tool resizes the signature to the pixel size you enter and compresses it as a JPG under your KB limit.",
      ],
    },
    {
      h2: "Getting a clean signature",
      list: [
        "Sign on plain white paper with a black or dark blue pen. A felt-tip or gel pen gives a bolder line that survives small sizes better.",
        "Photograph it flat, in daylight, from straight above, without your shadow on the paper.",
        "Crop tightly around the signature before resizing, with [Crop image](/tools/crop-image), so the signature fills the frame.",
        "Check the requirements: some forms want black ink only, or a signature within a box of fixed proportions.",
      ],
      paras: [PRIVACY],
    },
    {
      h2: "Photo and signature together",
      paras: [
        "Most forms that ask for a signature also ask for a photo with its own limits. Use [Resize image to 50 KB](/tools/resize-image-to-50kb) for the photo or the [passport photo maker](/tools/passport-photo) if a passport-style format is required. To sign a PDF document directly instead, use [Sign PDF](/tools/sign-pdf).",
      ],
    },
  ],
  "merge-pdf": [
    {
      h2: "When to merge PDFs",
      paras: [
        "Merging combines several PDF files into one document. It is useful when a form allows only one upload but you have several documents, when you want to send a set of scans as a single attachment, or to keep invoices and statements for one period together.",
        "Add two or more PDFs, put them in the right order with the up and down buttons, and download the combined file. Pages are copied as they are, so text stays selectable and the quality does not change.",
      ],
    },
    {
      h2: "Tips",
      list: [
        "Remove pages you do not need first with [Delete PDF pages](/tools/delete-pdf-pages), or pick out specific pages with [Extract PDF pages](/tools/extract-pdf-pages).",
        "To add photos or scans that are images, convert them first with [Image to PDF](/tools/image-to-pdf), then merge.",
        "If the merged file is too large for an upload form, run it through [Compress PDF](/tools/compress-pdf-to-500kb).",
        "Password-protected PDFs cannot be merged until the password is removed in your PDF reader.",
        "Fix the order or orientation afterwards with [Reorder PDF pages](/tools/reorder-pdf-pages) and [Rotate PDF](/tools/rotate-pdf).",
      ],
      paras: [],
    },
    {
      h2: "Privacy",
      paras: [
        "PDFs often contain personal details such as bank statements, contracts, IDs and medical letters. This tool merges the files in your browser, so they are never uploaded to a server. " + "That also means the speed depends on your device: very large files may take a little longer on older phones.",
      ],
    },
  ],
  "split-pdf": [
    {
      h2: "Ways to split a PDF",
      paras: [
        "Splitting turns one PDF into several smaller files. This tool offers two methods: a fixed number of pages per file, for example every page as its own PDF or every 10 pages, or custom ranges such as 1-3, 4, 5- where each range becomes its own file.",
        "Pages are copied as they are, so text stays selectable and quality does not change. When several files are created, you can download them together.",
      ],
    },
    {
      h2: "Typical uses",
      list: [
        "Upload portals with a page or size limit per file.",
        "Separating documents that were scanned together in one batch.",
        "Sending only the relevant chapter or section of a long report.",
        "Saving each page of a form or statement as its own file.",
      ],
      paras: [
        "If you only need some pages in one file, [Extract PDF pages](/tools/extract-pdf-pages) is quicker. To remove a few pages and keep the rest, use [Delete PDF pages](/tools/delete-pdf-pages). The opposite job is done by [Merge PDF](/tools/merge-pdf).",
      ],
    },
    {
      h2: "Writing page ranges",
      paras: [
        "Separate ranges with commas. A single number is one page; a range like 4-7 includes both ends; a range ending in a dash, such as 8-, runs to the last page. For example, 1-2, 3-5, 6- creates three files. " + PRIVACY,
      ],
    },
  ],
  "pdf-to-jpg": [
    {
      h2: "Why convert PDF pages to images",
      paras: [
        "Images are easier to share in chats and social media, to insert into presentations and documents, and to upload to forms that accept only JPG. Converting also lets you show one page of a PDF without sending the whole file.",
        "Every page becomes its own JPG. You can download pages one at a time or all pages together as a ZIP file.",
      ],
    },
    {
      h2: "Choosing the quality",
      list: [
        "Standard: about 96 dpi. Good for viewing on screen and sharing in messages; smallest files.",
        "High: about 144 dpi. Sharper text, good for presentations and zooming in.",
        "Max: about 216 dpi. Best for small print, detailed drawings and printing, but files are larger and conversion of long documents takes longer.",
      ],
      paras: [
        "JPG is ideal for scans and pages with photos. For pages with sharp text, line drawings or transparency, [PDF to PNG](/tools/pdf-to-png) keeps edges crisper.",
      ],
    },
    {
      h2: "After converting",
      paras: [
        "If an upload form needs the image under a certain size, use [Resize image to 100 KB](/tools/resize-image-to-100kb). To turn images back into a single PDF, use [Image to PDF](/tools/image-to-pdf). " + PRIVACY,
      ],
    },
  ],
  "jpg-to-png": [
    {
      h2: "JPG vs PNG",
      paras: [
        "JPG uses lossy compression designed for photos: small files, but some detail is discarded, which can show as blur or artefacts around sharp edges and text. PNG is lossless: every pixel is stored exactly, which keeps text, logos and screenshots sharp, and it supports transparency.",
        "Converting a JPG to PNG does not bring back detail that JPG compression has already removed. What it does is stop further loss: PNG files can be edited and saved again without getting worse each time.",
      ],
    },
    {
      h2: "When to convert",
      list: [
        "A website or program accepts only PNG.",
        "You want to keep editing an image without adding more JPG artefacts with each save.",
        "You are preparing a graphic that you will later give a transparent background in an image editor.",
      ],
      paras: [
        "PNG files of photos are usually several times larger than the JPG. If file size matters more than lossless quality, keep the JPG or compress it with the [image compressor](/tools/image-compressor). " + PRIVACY,
      ],
    },
  ],
  "png-to-jpg": [
    {
      h2: "Why convert PNG to JPG",
      paras: [
        "PNG is lossless, which is great for screenshots and graphics but makes photos large. Saving a photo as JPG usually cuts the file size dramatically with little visible difference, which helps with email attachments, upload limits and website speed.",
        "Some forms and older programs also accept only JPG.",
      ],
    },
    {
      h2: "What happens to transparency",
      paras: [
        "JPG does not support transparency. Transparent areas of a PNG, for example around a logo or a cut-out product photo, are filled with white during conversion. If you need to keep transparency at a smaller size, use WebP via the [image compressor](/tools/image-compressor) instead.",
        "Screenshots with lots of text can look slightly soft as JPG. For those, keeping PNG is often the better choice.",
      ],
    },
    {
      h2: "Getting the size down further",
      paras: [
        "For an upload limit like 50 KB or 100 KB, use [Resize image to 50 KB](/tools/resize-image-to-50kb) or [Resize image to 100 KB](/tools/resize-image-to-100kb), which pick the quality automatically. To change the pixel size, use [Resize image in pixels](/tools/resize-image-pixels). " + PRIVACY,
      ],
    },
  ],
  "webp-to-jpg": [
    {
      h2: "What is WebP?",
      paras: [
        "WebP is an image format developed by Google that produces smaller files than JPG and PNG at similar quality. Many websites now serve images as WebP, so when you save a picture from a browser it often arrives as a .webp file.",
        "Current browsers display WebP without problems, but some photo editors, office programs, printing services, messaging apps and upload forms still do not accept it. Converting to JPG fixes that.",
      ],
    },
    {
      h2: "JPG or PNG?",
      paras: [
        "Choose JPG for photos: it is the most widely accepted image format. If the WebP has a transparent background, such as a logo or product cut-out, JPG fills the transparent areas with white; to keep the transparency use [WebP to PNG](/tools/webp-to-png) instead.",
        "To go the other way and make your own images smaller for a website, use [JPG to WebP](/tools/jpg-to-webp). " + PRIVACY,
      ],
    },
    {
      h2: "Respect image rights",
      paras: [
        "Converting an image does not change who owns it. Images saved from other websites are usually protected by copyright, so only reuse them where you have permission or the licence allows it.",
      ],
    },
  ],
  "percentage-calculator": [
    {
      h2: "The four percentage questions",
      paras: ["Almost every percentage problem is one of these, each with a simple formula:"],
      list: [
        "What is X% of Y? Multiply: Y × X ÷ 100. Example: 15% of 80 = 80 × 15 ÷ 100 = 12.",
        "X is what percent of Y? Divide: X ÷ Y × 100. Example: 12 of 80 = 12 ÷ 80 × 100 = 15%.",
        "Percentage change from X to Y: (Y − X) ÷ X × 100. Example: from 80 to 92 = 12 ÷ 80 × 100 = +15%.",
        "X is Y% of what? Divide: X ÷ Y × 100. Example: 12 is 15% of 12 ÷ 15 × 100 = 80.",
      ],
    },
    {
      h2: "Common mistakes",
      paras: [
        "Percentage change is always measured against the starting value. A price that rises from 80 to 100 has gone up 25%, but falling back from 100 to 80 is a 20% drop, because the starting point changed. That is why a 50% loss needs a 100% gain to recover.",
        "Percentage points are different from percent. If an interest rate goes from 2% to 3%, it rose by 1 percentage point, which is a 50% increase in the rate.",
      ],
    },
    {
      h2: "Related calculators",
      paras: [
        "For prices, the [discount calculator](/tools/discount-calculator) shows the sale price and saving, and the [VAT / sales tax calculator](/tools/vat-calculator) adds or removes tax. For business pricing, the [profit margin calculator](/tools/profit-margin-calculator) explains the difference between margin and markup, and for exam scores the [grade calculator](/tools/grade-calculator) turns points into a percentage.",
      ],
    },
  ],
  "age-calculator": [
    {
      h2: "How exact age is calculated",
      paras: [
        "Age is counted in completed years, months and days. The calculator steps forward from the date of birth: first the full years, then the full months, then the remaining days, taking the real length of each month and leap years into account.",
        "Because months have 28 to 31 days, \"1 month\" is not a fixed number of days. That is why age calculators can differ by a day around month ends. Totals in days and weeks, on the other hand, are exact.",
      ],
    },
    {
      h2: "Typical uses",
      list: [
        "Checking age limits on application and exam forms, which often ask for your age on a specific cut-off date rather than today.",
        "Working out the age of a child in months for health checks and development milestones.",
        "Counting days until a birthday or anniversary.",
      ],
      paras: [
        "Choose the date to calculate to, not only today, to answer cut-off questions such as \"age on 1 January\".",
      ],
    },
    {
      h2: "Birthdays on 29 February",
      paras: [
        "People born on 29 February have a real birthday only in leap years. In other years, legal rules on whether the birthday counts as 28 February or 1 March differ between countries, so check the local rule if it matters for an official deadline.",
        "To count the time between any two dates, use the [date difference calculator](/tools/date-difference-calculator), and to find a date a number of days ahead, use [add days to a date](/tools/add-days-to-date).",
      ],
    },
  ],
};

export function guideFor(t: ToolDef): GuideSection[] | undefined {
  const kb = Number(t.props?.defaultKb);
  if (t.kind === "compress-pdf" && compressPdfSize[kb]) return [compressPdfSize[kb], ...compressPdfBase];
  if (t.kind === "resize-image-kb" && resizeKbSize[kb]) return [resizeKbSize[kb], ...resizeKbBase];
  return guides[t.slug];
}
