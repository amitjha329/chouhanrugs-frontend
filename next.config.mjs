/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.tailwindui.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.yashkumarjha.tk' },
      { protocol: 'https', hostname: '**.chouhanrugs.com' },
      { protocol: 'https', hostname: '**.caredone.in' },
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
  script-src 'self' tiny.cloud *.tiny.cloud stripe.com algolianet.com *.algolianet.com algolia.net *.algolia.net *.stripe.com razorpay.com *.razorpay.com paypal.com *.paypal.com *.googletagmanager.com 'unsafe-inline' 'unsafe-eval';
  connect-src 'self' tiny.cloud *.tiny.cloud stripe.com *.stripe.com razorpay.com algolianet.com algolia.net *.algolia.net *.algolianet.com *.razorpay.com paypal.com *.paypal.com ipapi.co *.ipapi.co google-analytics.com *.google-analytics.com data: gap: ws: 'unsafe-inline' 'unsafe-eval';
  frame-src 'self' stripe.com *.stripe.com algolianet.com *.algolianet.com algolia.net *.algolia.net razorpay.com *.razorpay.com paypal.com *.paypal.com 'unsafe-inline' 'unsafe-eval';
  child-src 'self' stripe.com *.stripe.com razorpay.com algolianet.com algolia.net *.algolia.net *.algolianet.com *.razorpay.com paypal.com *.paypal.com 'unsafe-inline' 'unsafe-eval';
  style-src 'self' tiny.cloud *.tiny.cloud stripe.com algolianet.com algolia.net *.algolia.net *.algolianet.com *.stripe.com razorpay.com *.razorpay.com paypal.com *.paypal.com fonts.googleapis.com 'unsafe-inline';
  font-src * 'self';
  object-src * 'self' data: blob:;
  img-src * 'self' data: blob:;
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
  }
}

export default nextConfig
