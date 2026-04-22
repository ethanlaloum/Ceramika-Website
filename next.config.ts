import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname,
  },

  // Configuration pour les images avec Vercel Blob Storage
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
};

export default nextConfig;
