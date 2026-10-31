import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // first versions of the tool URLs, before size variants existed
    return [
      { source: "/tools/compress-pdf", destination: "/tools/compress-pdf-to-200kb", permanent: true },
      { source: "/tools/resize-image-kb", destination: "/tools/resize-image-to-50kb", permanent: true },
      { source: "/tools/passport-photo-maker", destination: "/tools/passport-photo", permanent: true },
    ];
  },
};

export default nextConfig;
