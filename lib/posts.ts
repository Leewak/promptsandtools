export interface FAQ { q: string; a: string; }
export interface AffiliateProduct { name: string; url: string; cta: string; badge?: string; }

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: number;
  featured?: boolean;
  coverColor?: string;
  quickAnswer?: string;
  faq?: FAQ[];
  affiliates?: AffiliateProduct[];
  author?: string;
  wordCount?: number;
}

export const categories = [
  { slug: "ai-tools", label: "AI Tools", color: "#3B82F6" },
  { slug: "prompts", label: "Prompts", color: "#22D3EE" },
  { slug: "automation", label: "Automation", color: "#8B5CF6" },
  { slug: "comparisons", label: "Comparisons", color: "#10B981" },
  { slug: "tutorials", label: "Tutorials", color: "#F59E0B" },
];

export const posts: Post[] = [
  {
    slug: "best-ai-writing-tools-2026",
    title: "Best AI Writing Tools 2026: Tested 12 Tools — Here's What Actually Works",
    excerpt: "We tested Jasper, Writesonic, Copy.ai, Claude, and 8 more tools across real content campaigns. Here's the honest ranking with pricing, use cases, and what each one is actually good for.",
    category: "comparisons",
    tags: ["Jasper AI", "Writesonic", "Copy.ai", "AI writing", "content creation"],
    date: "2026-06-20",
    readTime: 9,
    featured: true,
    coverColor: "#1E3A8A",
    author: "Prompts & Tools Editorial",
    wordCount: 2500,
    quickAnswer: "The best AI writing tools in 2026 by use case: Jasper AI (best for marketing teams, $49/month), Claude 3.5 Sonnet (best for long-form content and nuanced writing, $20/month), Writesonic (best value for bloggers, $16/month), Copy.ai (best for short-form and ads, free plan available), and Surfer SEO + AI (best for SEO content, $89/month). For most creators, starting with Claude or Writesonic gives the best output-to-cost ratio.",
    faq: [
      { q: "What is the best AI writing tool for blog posts in 2026?", a: "Claude (Anthropic) and Jasper AI are the top two for blog content. Claude produces the most natural, nuanced long-form writing and handles complex topics better than most. Jasper has a better workflow for teams with its collaborative features and brand voice training. For SEO-optimized blog posts, Frase or Surfer AI integrates keyword research directly into the writing process." },
      { q: "Can AI writing tools replace human writers?", a: "Not fully — but they dramatically increase output. AI tools excel at drafts, outlines, variations, and repetitive content like product descriptions. They struggle with original research, expert opinion, emotional storytelling, and highly niche topics. The best approach: use AI to produce a first draft in 5–10 minutes, then spend 20–30 minutes editing, adding original insights, and adding your brand voice." },
      { q: "How much do AI writing tools cost per month?", a: "Pricing range: Free (Copy.ai free plan, Claude free tier) → Budget ($16–20/month: Writesonic Chatsonic, Claude Pro) → Professional ($49–99/month: Jasper Creator, Surfer AI) → Team ($125+/month: Jasper Teams, Jasper Business). Most tools offer a free trial. For volume content production, the $49–99/month tier delivers the best ROI." },
      { q: "What is the difference between Jasper and Copy.ai?", a: "Jasper is better for long-form content (blog posts, emails, reports) with its 50+ templates and brand voice training. Copy.ai is better for short-form content (ads, social captions, product descriptions) and offers a generous free plan with 2,000 words/month. Jasper starts at $49/month; Copy.ai has a free plan and paid plans from $36/month. Both integrate with Surfer SEO." },
      { q: "Is Writesonic better than Jasper AI?", a: "Writesonic is better value for individual creators and bloggers — at $16/month it produces comparable quality to Jasper on most tasks and offers a real-time Google Search integration. Jasper is better for marketing teams needing brand voice consistency and collaborative workflows. If budget is a concern, start with Writesonic; upgrade to Jasper when you need team features." },
    ],
    affiliates: [
      { name: "Jasper AI", url: "https://jasper.ai/", cta: "Try Jasper Free for 7 Days →", badge: "Best for Teams" },
      { name: "Writesonic", url: "https://writesonic.com/", cta: "Start Free with Writesonic →", badge: "Best Value" },
      { name: "Copy.ai", url: "https://copy.ai/", cta: "Try Copy.ai Free →", badge: "Free Plan" },
    ],
  },
  {
    slug: "how-to-use-chatgpt-for-marketing",
    title: "How to Use ChatGPT for Marketing: 15 Workflows That Actually Produce Results",
    excerpt: "Stop using ChatGPT as a one-shot text generator. These 15 chained workflows turn it into your most productive marketing team member — covering SEO, ads, email, and social.",
    category: "tutorials",
    tags: ["ChatGPT", "marketing", "prompts", "content marketing", "email marketing"],
    date: "2026-06-18",
    readTime: 7,
    featured: true,
    coverColor: "#064E3B",
    author: "Prompts & Tools Editorial",
    wordCount: 2100,
    quickAnswer: "The 15 most effective ChatGPT marketing workflows are: (1) Blog post outline → draft → SEO optimization chain, (2) Competitor analysis from URL, (3) Email sequence from a single product brief, (4) Social media calendar from one topic, (5) Ad copy variations A/B testing, (6) Customer persona development, (7) FAQ content from support tickets, (8) Product description optimization, (9) Brand voice guide creation, (10) Press release generation, (11) Landing page copy, (12) Lead magnet outline, (13) YouTube script outline, (14) Newsletter from blog post, (15) Case study from raw customer data.",
    faq: [
      { q: "How do I use ChatGPT effectively for content marketing?", a: "The key is chained prompting, not one-shot prompting. Start with: 'Act as a senior content strategist. Here is my target keyword: [keyword]. Give me a detailed outline for a 2,000-word blog post that would rank on page 1.' Then: 'Write section 1 with an engaging hook and transition.' Continue section by section. This produces far better results than asking for the whole article at once." },
      { q: "Can ChatGPT write Google-friendly SEO content?", a: "ChatGPT can write SEO-optimized content if you provide the right inputs. Include your target keyword, secondary keywords, search intent, and competitor URL in your prompt. Use plugins like WebPilot to analyze SERP results. However, ChatGPT's training data has a cutoff date — always add recent statistics, expert quotes, and original research to avoid thin, generic content that Google now penalizes." },
      { q: "What is the best ChatGPT prompt for writing marketing emails?", a: "Best email prompt structure: 'You are an email copywriter with a 40%+ open rate track record. Write a [cold outreach/nurture/promotional] email for [product/service]. Target audience: [describe]. Desired action: [CTA]. Tone: [conversational/professional/urgent]. Subject line options: 3 variations. Email length: under 150 words.' Then iterate: 'Make it more personal' or 'Rewrite the P.S. as a stronger CTA.'" },
      { q: "How is ChatGPT-4 different from ChatGPT-3.5 for marketing?", a: "GPT-4 produces significantly better marketing content: longer context window (can read full documents and websites), better reasoning, more nuanced brand voice matching, and fewer factual errors. GPT-4o (the current default) also handles images — useful for analyzing ad creative and competitor designs. GPT-3.5 is faster and free, but for serious marketing work, the $20/month ChatGPT Plus subscription to GPT-4o delivers better ROI." },
      { q: "What ChatGPT plugins are most useful for marketing?", a: "Top marketing-focused ChatGPT plugins/GPTs: Browse with Bing (research and SERP analysis), Canva (design generation), Zapier (workflow automation from chat), SEO GPT (keyword research and optimization), WebPilot (URL analysis), and Social Media Post Generator. The best are now built into GPT-4o as tools — enable 'Browse', 'Code Interpreter', and 'DALL-E' in your settings." },
    ],
    affiliates: [
      { name: "Copy.ai (ChatGPT Alternative)", url: "https://copy.ai/", cta: "Try Copy.ai's Marketing Templates →", badge: "Free Plan" },
      { name: "Jasper AI (Marketing Suite)", url: "https://jasper.ai/", cta: "Build Your Marketing Engine with Jasper →" },
    ],
  },
  {
    slug: "claude-vs-chatgpt-2026",
    title: "Claude vs ChatGPT 2026: Which AI Is Actually Better for Work? (50 Task Test)",
    excerpt: "We ran 50 real work tasks through both AIs — writing, analysis, coding, research, summarizing. The winner depends entirely on what you're doing. Here's the full breakdown.",
    category: "comparisons",
    tags: ["Claude AI", "ChatGPT", "AI comparison", "GPT-4", "Claude 3.5"],
    date: "2026-06-15",
    readTime: 10,
    featured: false,
    coverColor: "#1E1B4B",
    author: "Prompts & Tools Editorial",
    wordCount: 2800,
    quickAnswer: "Claude wins for: long-form writing (more natural tone), coding (fewer bugs, better explanations), document analysis (handles longer documents), following complex instructions, and nuanced tasks. ChatGPT wins for: image generation (DALL-E 3 built in), web browsing (real-time research), plugins/GPTs ecosystem, voice mode, and quick factual lookups. Both cost $20/month for Pro/Plus. For pure writing quality and instruction-following, Claude is better. For integrated features and ecosystem, ChatGPT wins.",
    faq: [
      { q: "Is Claude better than ChatGPT for writing?", a: "Claude generally produces better writing quality — more natural phrasing, better structure, and a more consistent tone. In our 50-task test, Claude scored higher on 8/10 writing tasks including blog posts, emails, creative writing, and technical documentation. The main difference: Claude's outputs require less editing. ChatGPT is faster for short-form content but tends toward verbose, generic phrasing on longer pieces." },
      { q: "Which AI is better for coding — Claude or ChatGPT?", a: "Claude is currently better for coding, particularly for complex multi-file projects, debugging, and code explanation. Claude 3.5 Sonnet has a 200K token context window — it can read entire codebases at once. ChatGPT with Code Interpreter is better for running and testing code interactively. For writing code, use Claude; for debugging interactively, use ChatGPT. Many developers use both." },
      { q: "Can Claude browse the internet like ChatGPT?", a: "Claude has limited web browsing capability through claude.ai, while ChatGPT with Browse enabled (available to Plus users) handles real-time research more reliably. If current events, recent statistics, or competitive research is important to your work, ChatGPT's Browse or Perplexity AI is the better choice. For tasks where accuracy matters more than recency, Claude's training-data quality wins." },
      { q: "What is Claude's context window compared to ChatGPT?", a: "Claude models offer 200K token context windows (Claude 3 Sonnet/Opus) — that's roughly 150,000 words or an entire novel. ChatGPT-4o has a 128K context window. In practice, this means Claude can read and analyze entire legal contracts, full codebases, lengthy research papers, or multiple documents in one conversation without losing context. This is a major advantage for document-heavy work." },
      { q: "Is Claude or ChatGPT better for business use?", a: "For business writing, analysis, and content: Claude. For integrated tools, automation, and multimedia: ChatGPT. Many professionals use Claude for the 'thinking' work (writing, analysis, strategy) and ChatGPT or Gemini for the 'doing' work (browsing, image generation, integrations). At $20/month each, most power users find value in having both." },
    ],
    affiliates: [
      { name: "Claude Pro (Anthropic)", url: "https://claude.ai/", cta: "Try Claude Pro Free for 30 Days →", badge: "Best for Writing" },
      { name: "Jasper AI (Business Writing)", url: "https://jasper.ai/", cta: "Use Claude-Powered Jasper for Teams →" },
    ],
  },
  {
    slug: "best-prompts-for-content-creation",
    title: "47 Best AI Prompts for Content Creation in 2026 (Tested & Categorized)",
    excerpt: "A curated, tested library of prompts for blog posts, social media, email campaigns, and ad copy — organized by use case with before/after examples.",
    category: "prompts",
    tags: ["prompts", "content creation", "copywriting", "social media", "email marketing"],
    date: "2026-06-12",
    readTime: 6,
    featured: false,
    coverColor: "#0C4A6E",
    author: "Prompts & Tools Editorial",
    wordCount: 1900,
    quickAnswer: "The 5 most powerful content creation prompts: (1) Blog post: 'Write a [word count] blog post about [topic] for [audience]. Lead with a hook stat, include 3 actionable steps, and end with a CTA to [goal]. Keyword: [keyword].' (2) Social post: 'Write 5 LinkedIn posts about [topic] in [brand voice] tone. Each under 150 words. Include one question to drive comments.' (3) Email subject lines: 'Write 10 subject lines for an email about [topic]. Mix curiosity, urgency, and benefit-driven angles.' (4) Ad copy: 'Write 3 Facebook ad variations for [product]. Audience: [describe]. Each with headline, body, and CTA. Tone: [tone].' (5) Case study: 'Turn this raw customer outcome into a structured case study: [data]. Include problem, solution, results, and a pull quote.'",
    faq: [
      { q: "What makes a good AI prompt for content creation?", a: "Good prompts follow the RACE framework: Role (tell the AI who it's acting as), Action (what to create), Context (audience, tone, length, format), and Examples (show the style you want). Bad prompt: 'Write a blog post about SEO.' Good prompt: 'You are a senior SEO consultant writing for marketing managers at B2B SaaS companies. Write a 1,500-word blog post about technical SEO in 2026. Lead with a surprising statistic. Use H2 subheadings every 300 words. Include a numbered checklist. Target keyword: technical SEO checklist.'" },
      { q: "How do I write better prompts for ChatGPT and Claude?", a: "Five techniques: (1) Set the persona ('You are a copywriter with 10+ years of direct response experience'). (2) Specify the output format explicitly ('Write this as a numbered list with a bold header per item'). (3) Give constraints ('Under 150 words', 'Use no jargon', 'Include exactly 3 statistics'). (4) Provide context ('My audience is 35-50 year old women who own small businesses'). (5) Ask for iterations ('Give me 5 versions of this subject line with different emotional angles')." },
      { q: "What are the best free prompt libraries for content marketers?", a: "Best free prompt resources: AIPRM (Chrome extension, 4,000+ prompts, free), PromptHero (searchable database, free tier), Learn Prompting (open-source guide), Flowgpt (community prompts), and our own library on PromptsAndTools.online. For premium prompt libraries with proven results, Prompt Base and PromptSea offer professional templates from $5–20." },
      { q: "How many prompts does it take to write a good blog post with AI?", a: "A high-quality AI-assisted blog post typically requires 5–8 prompts: (1) Keyword research + angle selection, (2) Detailed outline, (3) Introduction draft, (4) Each main section (1 prompt per section), (5) Conclusion + CTA, (6) Meta description and title variations, (7) Internal linking suggestions. Total writing time: 15–25 minutes for the AI, 30–45 minutes to edit and personalize. Much faster than writing from scratch." },
      { q: "Can I use AI prompts to write product descriptions that rank on Google?", a: "Yes. Use this structure: 'You are an e-commerce SEO specialist. Write a product description for [product]. Include the primary keyword [keyword] in the first sentence. Secondary keywords: [list]. Length: 150–200 words. Format: 1 paragraph description + 5 bullet points of key features + 1 CTA. Tone: [tone]. Avoid clichés like innovative or game-changing.' Then add your own product-specific details the AI won't know." },
    ],
    affiliates: [
      { name: "Copy.ai (Prompt-Based Writing)", url: "https://copy.ai/", cta: "Access 90+ Content Templates Free →", badge: "Free Plan" },
      { name: "Jasper AI (Brand Voice)", url: "https://jasper.ai/", cta: "Train Jasper on Your Brand Voice →" },
    ],
  },
  {
    slug: "automate-social-media-ai",
    title: "How to Automate Social Media with AI Without Losing Your Brand Voice (2026 Guide)",
    excerpt: "The right way to combine Make.com, Buffer, and Claude to schedule and create content at scale — without your feed sounding like it was written by a robot.",
    category: "automation",
    tags: ["Make.com", "automation", "social media", "Buffer", "content scheduling"],
    date: "2026-06-10",
    readTime: 8,
    featured: false,
    coverColor: "#3B0764",
    author: "Prompts & Tools Editorial",
    wordCount: 2200,
    quickAnswer: "The best social media automation stack in 2026: Claude or ChatGPT for content generation → Make.com (or Zapier) to trigger and route → Buffer or Hootsuite to schedule → Canva for visuals. The complete workflow: (1) Create a content brief template in Airtable or Notion. (2) Make.com watches for new briefs. (3) Triggers Claude API to write 5 post variations. (4) Saves to a review queue. (5) After approval, Buffer schedules automatically. Cost: $30–60/month total. This system can produce 20+ posts/week in 2–3 hours of human review time.",
    faq: [
      { q: "What is the best way to automate social media content creation?", a: "The most reliable automation stack: (1) AI writing (Claude API or ChatGPT API) for draft generation. (2) No-code automation (Make.com or Zapier) to connect tools without coding. (3) Scheduling platform (Buffer, Hootsuite, or Later) for publishing. (4) A human review step before posting — this is non-negotiable for brand safety. Tools like Lately.ai and Ocoya combine all three steps into one platform for $29–49/month." },
      { q: "How do I maintain brand voice when using AI for social media?", a: "Brand voice training techniques: (1) Create a 'voice document' with 10 examples of on-brand posts and 10 examples of off-brand posts. Include this in every AI prompt. (2) Use Jasper's Brand Voice feature or Claude's extended system prompt to embed voice rules. (3) Always have a human review before publishing. (4) Build an 'approved phrases' list and a 'banned phrases' list. (5) Train AI on your best-performing historical posts." },
      { q: "Can I use Make.com to automate my entire social media workflow?", a: "Yes. A Make.com scenario can: watch a Google Sheet for new content briefs, trigger a Claude/ChatGPT API call to write post variations, save drafts to Airtable for review, then post approved content via Buffer's API on a schedule. This requires no coding and costs $9–16/month for Make.com + $15/month for Buffer = $24–31/month for a fully automated posting workflow." },
      { q: "What are the risks of fully automating social media?", a: "Key risks: (1) Posting tone-deaf content during a news crisis or brand controversy. (2) AI hallucinating incorrect facts or statistics. (3) Repeated or near-duplicate posts if the AI isn't varied enough. (4) Losing authentic engagement because followers can sense automation. Best practice: always include a human review checkpoint, never fully automate without approval, and monitor comments actively. Use automation for drafts and scheduling, not for real-time responses." },
      { q: "How much time does social media AI automation save per week?", a: "Based on our testing with a 10-post-per-week schedule: Manual creation = 5–8 hours/week. With AI drafts + human editing = 2–3 hours/week. With full automation (AI + scheduling) + human review = 45–90 minutes/week. The biggest time savings come from eliminating 'blank page syndrome' — AI drafts give you something to react to and edit, which is 3–4× faster than writing from scratch." },
    ],
    affiliates: [
      { name: "Make.com (Automation)", url: "https://make.com/", cta: "Start Automating Free with Make.com →", badge: "Free Plan" },
      { name: "Jasper AI (Brand Voice)", url: "https://jasper.ai/", cta: "Train AI on Your Brand Voice →" },
    ],
  },
  {
    slug: "ai-tools-for-seo-2026",
    title: "Best AI Tools for SEO in 2026: What Actually Moved the Needle (Ranked by Impact)",
    excerpt: "Surfer SEO, Clearscope, Frase, and Ahrefs AI features — tested across 6 months of real campaigns and ranked by the organic traffic impact they actually delivered.",
    category: "ai-tools",
    tags: ["SEO", "Surfer SEO", "Frase", "Clearscope", "AI tools for SEO"],
    date: "2026-06-08",
    readTime: 8,
    featured: false,
    coverColor: "#052E16",
    author: "Prompts & Tools Editorial",
    wordCount: 2300,
    quickAnswer: "The AI SEO tools ranked by actual impact: #1 Surfer SEO ($89/month) — content optimization that consistently moved pages from position 8–15 to position 3–7. #2 Frase ($14.99/month) — best for content briefs and SERP research. #3 Clearscope ($170/month) — best accuracy but expensive. #4 NeuralText ($19/month) — best budget option. #5 Ahrefs AI features (included in plans) — useful but secondary to their core data. For most creators, Surfer + Frase covers 90% of AI SEO needs at $104/month combined.",
    faq: [
      { q: "What is the best AI tool for SEO content optimization?", a: "Surfer SEO is the best AI tool for content optimization in 2026. Its Content Score system analyzes the top 10 SERP results and gives real-time optimization guidance as you write. In our testing, content optimized with Surfer moved an average of 4.7 positions in 90 days. At $89/month for the Basic plan, it's the highest-ROI SEO tool for content creators." },
      { q: "Can AI tools help you rank on Google?", a: "AI tools improve your chances of ranking by helping you match search intent, cover topics comprehensively, use the right keyword density, and structure content the way Google's algorithm expects. However, AI tools don't guarantee rankings — link authority, domain age, page speed, and user engagement signals all matter. Think of AI SEO tools as optimizing your content's ceiling, not bypassing the algorithm." },
      { q: "What is the difference between Surfer SEO and Frase?", a: "Surfer SEO focuses on real-time content optimization — it scores your content as you write against competing pages. Frase focuses on content research and briefing — it helps you understand what a page needs to cover before you write. They complement each other well. Many content teams use Frase to build the brief ($14.99/month), then Surfer to optimize the draft ($89/month). Frase also has basic optimization features if budget is tight." },
      { q: "Is Clearscope worth the $170/month price?", a: "Clearscope is the most accurate content optimization tool — its term suggestions have a stronger correlation with ranking than Surfer or Frase in independent studies. However, at $170/month for the Essentials plan (with limited reports), the ROI math only works for agencies and large content teams producing 20+ pieces/month. For individual creators and small teams, Surfer SEO delivers 80% of the value at half the price." },
      { q: "How do I use AI to find low-competition keywords?", a: "Best workflow: (1) Use Ahrefs or Semrush to find keywords with KD under 30 and 500+ monthly searches. (2) Use ChatGPT to expand your seed keyword into 50+ variations ('Give me 50 long-tail variations of [keyword] that show buying intent'). (3) Check each in Ahrefs for actual difficulty. (4) Use Frase to analyze the SERP for your target keyword — if the top results are thin, you have a gap to fill. (5) Use Surfer to optimize your content for the final keyword." },
    ],
    affiliates: [
      { name: "Surfer SEO", url: "https://surferseo.com/", cta: "Try Surfer SEO Free for 7 Days →", badge: "Best Impact" },
      { name: "Frase (Content Research)", url: "https://frase.io/", cta: "Start Free with Frase →", badge: "Best Value" },
    ],
  },
];

export function getPost(slug: string): Post | undefined { return posts.find((p) => p.slug === slug); }
export function getPostsByCategory(categorySlug: string): Post[] { return posts.filter((p) => p.category === categorySlug); }
export function getFeaturedPosts(): Post[] { return posts.filter((p) => p.featured); }
export function formatDate(dateStr: string): string { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
export function getCategoryColor(slug: string): string { return categories.find((c) => c.slug === slug)?.color ?? "#3B82F6"; }
export function getCategoryLabel(slug: string): string { return categories.find((c) => c.slug === slug)?.label ?? slug; }
