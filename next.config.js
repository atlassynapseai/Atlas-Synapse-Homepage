/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/login', destination: '/auth?mode=signin', permanent: false },
      { source: '/signup', destination: '/auth?mode=signup', permanent: false },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/Aegis-Prime-Auditor',
        destination: 'https://atlassynapseai.github.io/Aegis-Prime-Auditor/',
      },
      {
        source: '/Aegis-Prime-Auditor/:path*',
        destination: 'https://atlassynapseai.github.io/Aegis-Prime-Auditor/:path*',
      },
      {
        source: '/Atlas-Synapse-Brand',
        destination: 'https://atlas-synapse-ai.vercel.app/Atlas-Synapse-Brand',
      },
      {
        source: '/Atlas-Synapse-Brand/:path*',
        destination: 'https://atlas-synapse-ai.vercel.app/Atlas-Synapse-Brand/:path*',
      },
    ]
  },
}

module.exports = nextConfig
