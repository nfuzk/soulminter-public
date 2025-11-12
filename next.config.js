const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

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
      },
      {
        protocol: 'https',
        hostname: '*.arweave.net',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Prevent Next.js dev server from reloading when Prisma SQLite DB changes
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/prisma/dev.db',
          '**/*.db',
        ],
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.soulminter.io',
          },
        ],
        destination: 'https://soulminter.io/:path*',
        permanent: true,
      },
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.blog.soulminter.io',
          },
        ],
        destination: 'https://blog.soulminter.io/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Handle root path for blog subdomain
      {
        source: '/',
        has: [{ type: 'host', value: 'blog.soulminter.io' }],
        destination: '/blog',
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'www.blog.soulminter.io' }],
        destination: '/blog',
      },
      // Handle all other paths for blog subdomain
      {
        source: '/:path+',
        has: [{ type: 'host', value: 'blog.soulminter.io' }],
        destination: '/blog/:path+',
      },
      {
        source: '/:path+',
        has: [{ type: 'host', value: 'www.blog.soulminter.io' }],
        destination: '/blog/:path+',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://va.vercel-scripts.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://* blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' ws://localhost:* ws://127.0.0.1:* https://mainnet.helius-rpc.com https://devnet.helius-rpc.com https://testnet.helius-rpc.com https://explorer-api.devnet.solana.com https://explorer-api.mainnet-beta.solana.com https://explorer-api.testnet.solana.com https://ipfs.io https://nft.storage https://*.pinata.cloud https://api.solflare.com https://solflare.com https://connect.solflare.com https://phantom.app https://api.phantom.app https://*.vercel-analytics.com https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com; frame-src 'self' https://connect.solflare.com https://solflare.com https://phantom.app; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
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

module.exports = withMDX(nextConfig);
