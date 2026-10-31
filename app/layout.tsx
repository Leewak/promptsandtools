import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AdsterraPopunder, AdsterraSideRails, AdsterraSocialBar } from "@/components/Adsterra";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "Prompts&Tools: Free File Tools for Any Form (No Upload)", template: "%s" },
  description: "Compress a PDF to 200 KB, resize a photo to 20 KB, or make a passport photo in the official size. Free tools that run in your browser.",
  metadataBase: new URL("https://promptsandtools.online"),
  openGraph: {
    siteName: "Prompts & Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${mono.variable}`}>
      <head>
        {/* Google Analytics 4 (G-W734225SHP) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W734225SHP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-W734225SHP');`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ background: "#0A0B1A", color: "#E8EAF6", fontFamily: "var(--font-space-grotesk)" }}>
        <Nav />
        <main className="flex-1">{children}</main>
        <AdsterraSideRails />
        <AdsterraSocialBar />
        <AdsterraPopunder />
        <Footer />
        <Script id="clarity-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","z65gjkl1hy");` }} />
      </body>
    </html>
  );
}
