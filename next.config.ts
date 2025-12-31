import { NextConfig } from "next"

const nextConfig: NextConfig = {
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
    qualities: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    
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
    const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' tiny.cloud *.google-analytics.com *.tiny.cloud stripe.com algolianet.com *.algolianet.com algolia.net *.algolia.net *.stripe.com razorpay.com *.razorpay.com paypal.com *.paypal.com *.googletagmanager.com *.doubleclick.net *.googleadservices.com 'unsafe-inline' 'unsafe-eval';
  connect-src 'self' tiny.cloud *.google-analytics.com *.tiny.cloud stripe.com *.stripe.com razorpay.com algolianet.com algolia.net *.algolia.net *.algolianet.com *.razorpay.com paypal.com *.paypal.com *.googletagmanager.com ipapi.co *.ipapi.co google-analytics.com *.google-analytics.com *.google.com data: gap: ws: 'unsafe-inline' 'unsafe-eval';
  frame-src 'self' stripe.com *.googletagmanager.com *.google-analytics.com *.stripe.com algolianet.com *.algolianet.com algolia.net *.doubleclick.net *.googletagmanager.com *.algolia.net razorpay.com *.razorpay.com paypal.com *.paypal.com 'unsafe-inline' 'unsafe-eval';
  child-src 'self' stripe.com *.stripe.com razorpay.com algolianet.com algolia.net *.algolia.net *.algolianet.com *.razorpay.com paypal.com *.paypal.com 'unsafe-inline' 'unsafe-eval';
  style-src 'self' tiny.cloud *.tiny.cloud stripe.com algolianet.com algolia.net *.algolia.net *.algolianet.com *.stripe.com razorpay.com *.razorpay.com paypal.com *.paypal.com fonts.googleapis.com 'unsafe-inline';
  font-src * 'self';
  object-src * 'self' data: blob:;
  img-src * 'self' *.google-analytics.com *.googletagmanager.com data: blob:;
  media-src * 'self' *.chouhanrugs.com *.caredone.in data: blob:;
  `
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

export default nextConfig
