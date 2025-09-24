/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporarily disabled to fix Fast Refresh loop
  productionBrowserSourceMaps: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pink-abstract-gayal-682.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: '*.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Prevent Next.js dev server from reloading when Prisma SQLite DB changes
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/prisma/dev.db',
        '**/*.db',
      ],
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://* blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://mainnet.helius-rpc.com https://devnet.helius-rpc.com https://testnet.helius-rpc.com https://explorer-api.devnet.solana.com https://explorer-api.mainnet-beta.solana.com https://explorer-api.testnet.solana.com https://ipfs.io https://nft.storage https://*.pinata.cloud https://api.solflare.com https://solflare.com https://connect.solflare.com https://phantom.app https://api.phantom.app https://*.vercel-analytics.com https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.vercel-scripts.com; frame-src 'self' https://connect.solflare.com https://solflare.com https://phantom.app; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;
