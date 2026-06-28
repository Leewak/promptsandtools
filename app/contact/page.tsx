"use client";
import type { Metadata } from "next";
export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient" style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>Contact Us</h1>
      <p className="mb-10 text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>
        Have a question, correction, or partnership inquiry? We read every message and reply within 2–3 business days.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Editorial", desc: "Corrections, content suggestions, or topic requests" },
          { title: "Partnerships", desc: "Sponsorship, collaboration, or affiliate inquiries" },
          { title: "Technical", desc: "Broken links, site issues, or display problems" },
        ].map(({ title, desc }) => (
          <div key={title} className="p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <p className="font-semibold text-sm mb-1" style={{ color: "#3B82F6" }}>{title}</p>
            <p className="text-xs" style={{ color: "#4A5580" }}>{desc}</p>
          </div>
        ))}
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Name</label>
            <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Email</label>
            <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Subject</label>
          <input type="text" placeholder="What is this about?" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Message</label>
          <textarea rows={6} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
          Send Message
        </button>
        <p className="text-center text-xs" style={{ color: "#2A3260" }}>
          Or email us directly at <a href="mailto:guifrhi.khalid@gmail.com" style={{ color: "#3B82F6" }}>guifrhi.khalid@gmail.com</a>
        </p>
      </form>
    </div>
  );
}
