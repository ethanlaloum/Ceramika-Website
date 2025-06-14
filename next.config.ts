import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
};

export default nextConfig;
