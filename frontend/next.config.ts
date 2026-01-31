import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'], // Add 'images.unsplash.com' in domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',  // Update to accept all paths from images.unsplash.com
      },
    ],
  },
};

export default nextConfig;
