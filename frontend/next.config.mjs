/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://laboissim.onrender.com/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'https://laboissim.onrender.com/auth/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'https://laboissim.onrender.com/media/:path*',
      },
    ];
  },
  trailingSlash: false,
}

export default nextConfig
