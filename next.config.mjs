/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Backend production - back subdomain
      {
        protocol: 'https',
        hostname: 'back.mimmoacademy.com',
        port: '',
        pathname: '/**',
      },
      // Backend production - main domain with /api path
      {
        protocol: 'https',
        hostname: 'mimmoacademy.com',
        port: '',
        pathname: '/**',
      },
      // Development - localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // Development - 127.0.0.1
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
