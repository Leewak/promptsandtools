import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // first versions of the tool URLs, before size variants existed
    return [
      // one host only: www -> apex (www served a duplicate copy)
      { source: "/:path*", has: [{ type: "host", value: "www.promptsandtools.online" }], destination: "https://promptsandtools.online/:path*", permanent: true },
      { source: "/tools/compress-pdf", destination: "/tools/compress-pdf-to-200kb", permanent: true },
      { source: "/tools/resize-image-kb", destination: "/tools/resize-image-to-50kb", permanent: true },
      { source: "/tools/passport-photo-maker", destination: "/tools/passport-photo", permanent: true },
    ];
  },
};

export default nextConfig;
