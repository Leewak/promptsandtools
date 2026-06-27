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
    title: "Best AI Writing Tools in 2026: Honest Comparison After Testing 12 Tools",
    excerpt: "We tested Jasper, Writesonic, Copy.ai, Claude, and 8 more. Here's what actually works for content creators and marketers.",
    category: "comparisons",
    tags: ["Jasper AI", "Writesonic", "Copy.ai", "AI writing"],
    date: "2026-06-20",
    readTime: 9,
    featured: true,
    coverColor: "#1E3A8A",
  },
  {
    slug: "how-to-use-chatgpt-for-marketing",
    title: "How to Use ChatGPT for Marketing: 15 Proven Workflows",
    excerpt: "Stop using ChatGPT as a one-shot tool. These 15 workflows will make it your most productive marketing employee.",
    category: "tutorials",
    tags: ["ChatGPT", "marketing", "prompts"],
    date: "2026-06-18",
    readTime: 7,
    featured: true,
    coverColor: "#064E3B",
  },
  {
    slug: "claude-vs-chatgpt-2026",
    title: "Claude vs ChatGPT in 2026: Which AI Is Actually Better for Work?",
    excerpt: "We ran 50 real work tasks through both. The winner depends entirely on what you're doing.",
    category: "comparisons",
    tags: ["Claude AI", "ChatGPT", "AI comparison"],
    date: "2026-06-15",
    readTime: 10,
    featured: false,
    coverColor: "#1E1B4B",
  },
  {
    slug: "best-prompts-for-content-creation",
    title: "47 Prompts for Content Creation That Actually Work in 2026",
    excerpt: "A curated library of prompts for blog posts, social media, email, and ad copy — tested and refined on real campaigns.",
    category: "prompts",
    tags: ["prompts", "content creation", "copywriting"],
    date: "2026-06-12",
    readTime: 6,
    featured: false,
    coverColor: "#0C4A6E",
  },
  {
    slug: "automate-social-media-ai",
    title: "How to Automate Your Social Media with AI (Without Losing Your Voice)",
    excerpt: "The right way to use Make.com, Buffer, and Claude together to schedule and create content at scale.",
    category: "automation",
    tags: ["Make.com", "automation", "social media"],
    date: "2026-06-10",
    readTime: 8,
    featured: false,
    coverColor: "#3B0764",
  },
  {
    slug: "ai-tools-for-seo-2026",
    title: "Best AI Tools for SEO in 2026: What Moved the Needle",
    excerpt: "Surfer SEO, Clearscope, Frase, and Ahrefs AI features — ranked by actual impact on organic traffic.",
    category: "ai-tools",
    tags: ["SEO", "Surfer SEO", "Frase", "AI tools"],
    date: "2026-06-08",
    readTime: 8,
    featured: false,
    coverColor: "#052E16",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter((p) => p.category === categorySlug);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter((p) => p.featured);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function getCategoryColor(slug: string): string {
  return categories.find((c) => c.slug === slug)?.color ?? "#3B82F6";
}

export function getCategoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}
