/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zmashaael.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ugucwuhjwvburukihbbd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Language',
            value: 'ar',
          },
        ],
      },
    ];
  },
};

export default nextConfig;