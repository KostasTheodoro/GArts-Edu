import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for modern browsers
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'next-intl'],
  },
};

export default withNextIntl(nextConfig);
