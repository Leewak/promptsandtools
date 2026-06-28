import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cookie Policy | Prompts & Tools",
  description: "How Prompts & Tools uses cookies and how you can control them.",
};
export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>Cookie Policy</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>This Cookie Policy explains how Prompts &amp; Tools uses cookies and similar tracking technologies on promptsandtools.online.</p>

      {[
        {
          h: "What Are Cookies?",
          body: "Cookies are small text files placed on your device when you visit a website. They allow the site to remember your actions and preferences over time, so you don't have to re-enter information each time you visit.",
        },
        {
          h: "Types of Cookies We Use",
          body: "We use four types of cookies: (1) Essential cookies — required for basic website functionality. (2) Analytics cookies — Google Analytics uses these to track page views, session duration, and traffic sources. This data is anonymized and aggregated. (3) Advertising cookies — Google AdSense uses cookies to display personalized ads based on your browsing history. (4) Functional cookies — remember your preferences such as newsletter subscription status.",
        },
        {
          h: "Google Analytics Cookies",
          body: "Google Analytics sets the following cookies: _ga (2-year expiry) — distinguishes users; _gid (24-hour expiry) — distinguishes users; _gat (1-minute expiry) — throttles request rate. All data collected by Google Analytics is anonymized and used solely for traffic analysis. You can opt out at tools.google.com/dlpage/gaoptout.",
        },
        {
          h: "Google AdSense Cookies",
          body: "Google AdSense places advertising cookies to serve ads relevant to your interests. These cookies do not store personal information such as your name or email address, but they do track your browsing behavior across websites that use Google advertising services. To opt out of personalized advertising, visit google.com/settings/ads.",
        },
        {
          h: "Affiliate Tracking Cookies",
          body: "When you click an affiliate link on our site, the destination company may set a tracking cookie on your device. This cookie allows the affiliate program to attribute any subsequent purchase to our referral. These cookies are set by third parties and are governed by their own cookie policies.",
        },
        {
          h: "How to Control Cookies",
          body: "You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a new cookie is set. Note that disabling cookies may impact the functionality of this and other websites. Browser-specific instructions: Chrome — Settings > Privacy and Security > Cookies. Firefox — Options > Privacy & Security. Safari — Preferences > Privacy.",
        },
        {
          h: "Updates to This Policy",
          body: "We may update this Cookie Policy to reflect changes in our practices or for legal reasons. The date at the top of this page indicates when the policy was last updated.",
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
