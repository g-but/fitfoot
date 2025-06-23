const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. Only use during deployment emergency.
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@medusajs/framework'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.SANITY_DATASET,
  },
  
  // Image optimization
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  
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
            value: 'strict-origin-when-cross-origin',
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
  
  // Webpack configuration for Medusa compatibility
  webpack: (config, { isServer }) => {
    // Handle node modules that need special treatment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Suppress webpack warnings for OpenTelemetry
    config.ignoreWarnings = [
      { module: /node_modules\/@opentelemetry/ },
      { module: /node_modules\/@sentry/ },
      { module: /node_modules\/require-in-the-middle/ },
    ];

    return config;
  },
}

// Only apply Sentry in production to keep development clean
if (process.env.NODE_ENV === 'production') {
  // Sentry configuration
  const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry webpack plugin
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    
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