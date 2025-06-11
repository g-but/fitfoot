const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Image optimization
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  // Enable production source maps for better error tracking
  productionBrowserSourceMaps: true,
}

// Only apply Sentry in production to keep development clean
if (process.env.NODE_ENV === 'production') {
  // Sentry configuration
  const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry webpack plugin
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    
    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,
    
    // Upload source maps to Sentry
    widenClientFileUpload: true,
    
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
    
    // Hides source maps from generated client bundles
    hideSourceMaps: true,
    
    // Release settings
    release: process.env.VERCEL_GIT_COMMIT_SHA,
  }

  // Export the config with Sentry wrapping
  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
} else {
  // Development: export clean config without Sentry
  module.exports = nextConfig
} 