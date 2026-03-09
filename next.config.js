/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ]
  },
}

module.exports = nextConfig
