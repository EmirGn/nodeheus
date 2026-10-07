import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow an isolated build dir (e.g. for a parallel preview server) without
  // clobbering the default `.next`. Defaults to `.next` for prod/Vercel.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // The landing page is a self-contained static document in public/home.html.
  // studio.nodeheus.com is rewritten to /studio by middleware before this runs.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/home.html" }],
    };
  },
};

export default nextConfig;
