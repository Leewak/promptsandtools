import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy | Prompts & Tools",
  description: "How Prompts & Tools collects, uses, and protects your personal information.",
};
const s = { h1: { fontFamily: "var(--font-space-grotesk)", color: "#F0F4FF", letterSpacing: "-0.025em" } as React.CSSProperties };
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={s.h1}>Privacy Policy</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>This Privacy Policy explains how Prompts &amp; Tools ("we", "us", or "our") collects, uses, and shares information when you visit promptsandtools.online.</p>

      {[
        {
          h: "1. Information We Collect",
          body: "We collect information you provide directly (such as your email address when subscribing to our newsletter), and information collected automatically when you visit our site. Automatically collected data includes your IP address, browser type, operating system, referring URLs, pages viewed, and time spent on pages. This data is collected via Google Analytics and standard server logs.",
        },
        {
          h: "2. How We Use Your Information",
          body: "We use collected data to: operate and improve the website; send newsletter emails if you have subscribed; analyze traffic patterns and popular content; comply with legal obligations. We do not sell your personal information to third parties.",
        },
        {
          h: "3. Google AdSense and Advertising",
          body: "We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting Google's Ads Settings at google.com/settings/ads. We do not control the data Google collects for advertising purposes. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website.",
        },
        {
          h: "4. Affiliate Links",
          body: "Some links on this site are affiliate links. When you click an affiliate link and make a purchase, we may earn a commission. Affiliate partners may use tracking cookies to attribute sales to our referrals. We do not receive your personal payment or billing information through affiliate programs.",
        },
        {
          h: "5. Cookies",
          body: "We use cookies to remember your preferences, analyze site traffic (Google Analytics), and serve relevant advertisements (Google AdSense). You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain features. See our Cookie Policy for full details.",
        },
        {
          h: "6. Third-Party Services",
          body: "We use the following third-party services: Google Analytics (analytics), Google AdSense (advertising), and email service providers for newsletter delivery. Each third party operates under its own privacy policy. We encourage you to review their policies.",
        },
        {
          h: "7. Data Retention",
          body: "Newsletter subscriber data is retained until you unsubscribe. Analytics data is retained for 26 months in accordance with Google Analytics default settings. We review and delete unnecessary personal data periodically.",
        },
        {
          h: "8. Your Rights",
          body: "Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact us at the email below. EU/UK residents may have additional rights under GDPR. California residents may have rights under CCPA.",
        },
        {
          h: "9. Children's Privacy",
          body: "Our website is not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.",
        },
        {
          h: "10. Changes to This Policy",
          body: "We may update this Privacy Policy periodically. We will post the updated policy on this page with a revised date. Continued use of the site after changes constitutes acceptance of the updated policy.",
        },
        {
          h: "11. Contact",
          body: "If you have questions about this Privacy Policy, please contact us at: guifrhi.khalid@gmail.com",
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
