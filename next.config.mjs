/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      'clsx',
      'tailwind-merge',
      '@tanstack/react-query',
    ],
  },
};

export default nextConfig;
