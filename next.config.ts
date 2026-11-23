import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chat route reads articles and knowledge files from disk at runtime.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
};

export default nextConfig;
