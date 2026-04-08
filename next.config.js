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
      // Agent Store routes
      {
        source: '/agents',
        destination: 'https://atlas-synapse-ai.vercel.app/agents',
      },
      {
        source: '/agents/:path*',
        destination: 'https://atlas-synapse-ai.vercel.app/agents/:path*',
      },
      // Agent Store auth routes
      {
        source: '/auth/login',
        destination: 'https://atlas-synapse-ai.vercel.app/auth/login',
      },
      {
        source: '/auth/signup',
        destination: 'https://atlas-synapse-ai.vercel.app/auth/signup',
      },
      // Agent Store API routes
      {
        source: '/api/analyze-security',
        destination: 'https://atlas-synapse-ai.vercel.app/api/analyze-security',

      },
      {
        source: '/api/analyze-contract',
        destination: 'https://atlas-synapse-ai.vercel.app/api/analyze-contract',
      },
      {
        source: '/api/score-lead',
        destination: 'https://atlas-synapse-ai.vercel.app/api/score-lead',
      },
      {
        source: '/api/check-compliance',
        destination: 'https://atlas-synapse-ai.vercel.app/api/check-compliance',
      },
      {
        source: '/api/screen-candidate',
        destination: 'https://atlas-synapse-ai.vercel.app/api/screen-candidate',
      },
      {
        source: '/api/detect-fraud',
        destination: 'https://atlas-synapse-ai.vercel.app/api/detect-fraud',
      },
      {
        source: '/api/log-run',
        destination: 'https://atlas-synapse-ai.vercel.app/api/log-run',
      },
    ]
  },
}

module.exports = nextConfig
