/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
    ],
    // OR (older syntax)
    // domains: ['randomuser.me'],
  },
};

module.exports = nextConfig;
