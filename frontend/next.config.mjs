/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@reptracker/shared"],

  async rewrites() {
    const origin = process.env.BACKEND_ORIGIN;
    if (!origin) return [];

    return [
      // health endpoint is NOT under /api in your backend
      { source: "/health", destination: `${origin}/health` },

      // proxy all /api/* to your backend /api/*
      { source: "/api/:path*", destination: `${origin}/api/:path*` },
    ];
  },
};
export default nextConfig;
