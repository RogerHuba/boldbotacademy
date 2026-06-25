import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { reactCompiler: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
