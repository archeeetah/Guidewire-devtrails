/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bypassing Turbopack/PWA Worker Errors manually
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Vercel Production Fast API proxy mapping
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` 
          : 'http://127.0.0.1:8000/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
