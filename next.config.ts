import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  typescript: {
    // ⚠️ Cela ignorera toutes les erreurs de type lors du build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
