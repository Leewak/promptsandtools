import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AdsterraSideRails } from "@/components/Adsterra";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Prompts & Tools — The Practical Guide to AI Tools", template: "%s | Prompts & Tools" },
  description: "Independent AI Editorial",
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
      </head>
      <body className="min-h-screen flex flex-col bg-pt-black text-pt-white antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <AdsterraSideRails />
        <Footer />
        <Script id="clarity-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","z65gjkl1hy");` }} />
      </body>
    </html>
  );
}
