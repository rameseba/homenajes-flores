import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: se sirve desde Cloudflare Pages sin servidor Node.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
