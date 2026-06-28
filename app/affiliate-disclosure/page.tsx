import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Affiliate Disclosure | Prompts & Tools",
  description: "Our affiliate disclosure and how we earn commissions.",
};
export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>Affiliate Disclosure</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>In the interest of full transparency, this page explains our affiliate relationships and how we earn revenue.</p>

      {[
        {
          h: "FTC Disclosure",
          body: "In accordance with the Federal Trade Commission (FTC) guidelines on endorsements and testimonials, Prompts & Tools discloses that some of the links on this website are affiliate links. This means that if you click a link and make a purchase, we may receive a commission at no additional cost to you.",
        },
        {
          h: "What This Means for You",
          body: "Clicking an affiliate link does not change the price you pay. The commission we earn comes from the vendor's marketing budget, not from you. You pay exactly the same price whether you use our affiliate link or go directly to the vendor's website.",
        },
        {
          h: "Our Review Standards",
          body: "We only recommend products and services we have personally tested or thoroughly researched. Affiliate relationships do not influence our rankings, ratings, or editorial opinions. We regularly update our reviews to reflect current pricing, features, and performance. If we stop recommending a product, we remove or update the affiliate link regardless of any active partnership.",
        },
        {
          h: "Which Products Have Affiliate Links?",
          body: "Affiliate links may be present in product reviews, comparison articles, and 'best of' lists. Affiliate links are identified with 'rel=sponsored' or 'rel=noopener sponsored' in the HTML. The specific tools we have affiliate relationships with include (but are not limited to) Jasper AI, Writesonic, Copy.ai, Surfer SEO, Frase, and Make.com.",
        },
        {
          h: "Advertising Revenue",
          body: "In addition to affiliate commissions, this site displays advertisements through Google AdSense. These ads are served automatically by Google and are not individually endorsed by us. The presence of an ad does not constitute a recommendation.",
        },
        {
          h: "Questions?",
          body: "If you have questions about our affiliate relationships or want to know whether a specific link is an affiliate link, contact us at hello@promptsandtools.online.",
        },
      ].map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#CBD5E1", fontFamily: "var(--font-space-grotesk)" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
