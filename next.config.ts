import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    nextPublicApiUrl: 'http://localhost:5134/api/v1',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
export default nextConfig;