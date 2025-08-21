import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // Durante o build, ignorar erros de TypeScript em desenvolvimento
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Durante o build, ignorar erros de ESLint em desenvolvimento
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
