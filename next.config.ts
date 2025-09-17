import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSG will be configured per-route as needed
  // API routes require server mode

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      // SVG handling
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
