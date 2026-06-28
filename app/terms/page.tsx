import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of Use | Prompts & Tools",
  description: "Terms and conditions for using Prompts & Tools.",
};
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>Terms of Use</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>By accessing and using promptsandtools.online, you agree to be bound by these Terms of Use. Please read them carefully.</p>

      {[
        { h: "1. Acceptance of Terms", body: "By accessing or using this website, you confirm that you are at least 13 years old and agree to these terms. If you do not agree, please do not use this site." },
        { h: "2. Intellectual Property", body: "All content on this website — including articles, reviews, graphics, and code examples — is the property of Prompts & Tools unless otherwise noted. You may not reproduce, distribute, or create derivative works from our content without written permission. You may share excerpts with proper attribution and a link back to the original article." },
        { h: "3. Permitted Use", body: "You may access and use this website for personal, non-commercial purposes. You may not use this site to scrape content in bulk, republish our content without permission, engage in any activity that disrupts or interferes with the website's operation, or attempt to gain unauthorized access to any part of the site." },
        { h: "4. User-Submitted Content", body: "If you submit content to this site (such as comments or contact form messages), you grant us a non-exclusive, royalty-free license to use, reproduce, and display that content. You are responsible for ensuring that any content you submit does not violate third-party rights or applicable law." },
        { h: "5. Newsletter", body: "By subscribing to our newsletter, you consent to receive periodic emails about AI tools, productivity, and related topics. You may unsubscribe at any time using the link at the bottom of any newsletter email. We will not share your email address with third parties without your consent." },
        { h: "6. Disclaimer of Warranties", body: "This website is provided 'as is' without any warranties, express or implied. We do not warrant that the site will be error-free, uninterrupted, or free of viruses. We disclaim all warranties to the fullest extent permitted by applicable law." },
        { h: "7. Limitation of Liability", body: "To the maximum extent permitted by law, Prompts & Tools shall not be liable for any damages arising from your use of this website, including but not limited to direct, indirect, incidental, or consequential damages." },
        { h: "8. Governing Law", body: "These Terms are governed by applicable law. Any disputes arising from these Terms or your use of the site shall be resolved in accordance with applicable law." },
        { h: "9. Changes to Terms", body: "We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the new Terms." },
        { h: "10. Contact", body: "Questions about these Terms? Contact us at guifrhi.khalid@gmail.com." },
      ].map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#CBD5E1", fontFamily: "var(--font-space-grotesk)" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
