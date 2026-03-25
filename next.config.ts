import { NextConfig } from "next"
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Cache Components temporarily disabled - requires Suspense boundaries 
  // around all dynamic data access patterns. Will re-enable after migration.
  // cacheComponents: true,
  allowedDevOrigins:['192.168.1.9'],
  experimental: {
    webpackMemoryOptimizations: true
  },
  env: {
    NEXT_PUBLIC_ALGOLIA_APPID: process.env.ALGOLIA_APPID,
    NEXT_PUBLIC_ALGOLIA_KEY_CLIENT: process.env.ALGOLIA_KEY_CLIENT,
    NEXT_PUBLIC_ALGOLIA_INDEX: process.env.ALGOLIA_INDEX,
    NEXT_PUBLIC_ALGOLIA_QUERY_INDEX: process.env.ALGOLIA_QUERY_INDEX,
  },
  turbopack: {
    // Example: Add aliases and externals for Turbopack (experimental, API may change)
    resolveAlias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
  },
  images: {
    // Optimized quality array - fewer options means better caching
    // 75 is default, 85 for high quality, 50 for thumbnails
    qualities: [10, 40, 50, 60, 75, 85, 90, 95, 100],
    // AVIF has better compression than WebP (20% smaller)
    formats: ['image/avif', 'image/webp'],
    // Optimize device sizes for common breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Cache images longer (4 hours default -> 24 hours)
    minimumCacheTTL: 86400,

    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.tailwindui.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.yashkumarjha.tk' },
      { protocol: 'https', hostname: '**.chouhanrugs.com' },
      { protocol: 'https', hostname: '**.caredone.in' },
    ]
  },
  redirects: async () => {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.chouhanrugs.com" }],
        destination: "https://chouhanrugs.com/:path*",
        permanent: true,
      }
    ]
  },
  webpack(
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) {
    config.externals.push({
      canvas: 'commonjs canvas'
    })
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.js'
    }
    // config.resolve.alias['express-handlebars'] = 'node_modules/handlebars/dist/handlebars.js'
    return config
  },
  async headers() {
    const buildCsp = (directives: Record<string, string[]>) => {
      return Object.entries(directives)
        .map(([directive, values]) => `${directive} ${values.join(' ')}`)
        .join('; ')
    }

    const cspDirectives: Record<string, string[]> = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'tiny.cloud',
        '*.tiny.cloud',
        'stripe.com',
        '*.stripe.com',
        'algolianet.com',
        '*.algolianet.com',
        'algolia.net',
        '*.algolia.net',
        'razorpay.com',
        '*.razorpay.com',
        'paypal.com',
        '*.paypal.com',
        '*.googletagmanager.com',
        'www.googletagmanager.com',
        '*.google-analytics.com',
        'www.google-analytics.com',
        'ssl.google-analytics.com',
        '*.doubleclick.net',
        '*.googleadservices.com',
        'www.googleadservices.com',
        'www.google.com',
        'www.gstatic.com',
      ],
      'connect-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'tiny.cloud',
        '*.tiny.cloud',
        'stripe.com',
        '*.stripe.com',
        'algolianet.com',
        '*.algolianet.com',
        'algolia.net',
        '*.algolia.net',
        'razorpay.com',
        '*.razorpay.com',
        'paypal.com',
        '*.paypal.com',
        '*.googletagmanager.com',
        '*.google-analytics.com',
        'www.google-analytics.com',
        '*.googleadservices.com',
        'www.googleadservices.com',
        '*.doubleclick.net',
        '*.google.com',
        'ipapi.co',
        '*.ipapi.co',
        'data:',
        'gap:',
        'ws:',
      ],
      'frame-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'stripe.com',
        '*.stripe.com',
        'algolianet.com',
        '*.algolianet.com',
        'algolia.net',
        '*.algolia.net',
        'razorpay.com',
        '*.razorpay.com',
        'paypal.com',
        '*.paypal.com',
        '*.googletagmanager.com',
        '*.google-analytics.com',
        '*.doubleclick.net',
        '*.google.com',
      ],
      'child-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'stripe.com',
        '*.stripe.com',
        'algolianet.com',
        '*.algolianet.com',
        'algolia.net',
        '*.algolia.net',
        'razorpay.com',
        '*.razorpay.com',
        'paypal.com',
        '*.paypal.com',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'tiny.cloud',
        '*.tiny.cloud',
        'stripe.com',
        '*.stripe.com',
        'algolianet.com',
        '*.algolianet.com',
        'algolia.net',
        '*.algolia.net',
        'razorpay.com',
        '*.razorpay.com',
        'paypal.com',
        '*.paypal.com',
        'fonts.googleapis.com',
      ],
      'font-src': ["'self'", '*'],
      'object-src': ["'none'"],
      'img-src': ["'self'", '*', '*.google-analytics.com', '*.googletagmanager.com', '*.googleadservices.com', 'data:', 'blob:'],
      'media-src': ["'self'", '*', '*.chouhanrugs.com', '*.caredone.in', 'data:', 'blob:'],
    }

    const ContentSecurityPolicy = buildCsp(cspDirectives)
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: "geolocation=()",
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  }
}

export default withNextIntl(nextConfig)
