import { defineConfig, loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3005",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3005,http://localhost:9000", 
      authCors: process.env.AUTH_CORS || "http://localhost:3005",
      jwtSecret: process.env.JWT_SECRET || "fitfoot-dev-jwt-secret",
      cookieSecret: process.env.COOKIE_SECRET || "fitfoot-dev-cookie-secret",
    },
    // Redis configuration
    redisUrl: process.env.REDIS_URL || undefined, // Use in-memory cache if Redis not available
    workerMode: process.env.NODE_ENV === 'development' ? 'shared' : 'worker',
  },
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        strict: "all",
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // Default configuration for email/password auth
            }
          }
        ]
      },
    },
    {
      resolve: "@medusajs/medusa/cart",
    },
    {
      resolve: "@medusajs/medusa/customer",
    },
    {
      resolve: "@medusajs/medusa/product",
    },
    {
      resolve: "@medusajs/medusa/region",
    },
    {
      resolve: "@medusajs/medusa/sales-channel",
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
    },
    {
      resolve: "@medusajs/medusa/payment",
    },
    {
      resolve: "@medusajs/medusa/user",
      options: {
        jwt_secret: process.env.JWT_SECRET || "fitfoot-dev-jwt-secret",
      },
    },
  ]
})
