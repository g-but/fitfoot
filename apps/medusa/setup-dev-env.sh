#!/bin/bash

# === FitFoot Medusa Development Environment Setup ===
# This script configures Medusa with SQLite for reliable development

echo "🔧 Setting up Medusa development environment..."

# Create development environment file
cat > .env << 'EOF'
# === FitFoot Medusa Backend Environment Configuration ===
# Development-friendly configuration with SQLite fallback

# Database Configuration - using SQLite for development reliability
# Uncomment and use the PostgreSQL URL when Supabase is properly configured:
# DATABASE_URL=postgresql://postgres:fitfoot2025@db.qpvgxkgjlggcgiqctcji.supabase.co:5432/postgres
DATABASE_URL=sqlite://./medusa-db.sqlite

# Authentication secrets
JWT_SECRET=fitfoot-jwt-secret-super-secure-2025
COOKIE_SECRET=fitfoot-cookie-secret-super-secure-2025

# Server configuration
PORT=9000
NODE_ENV=development

# CORS Configuration - allowing both frontend ports
STORE_CORS=http://localhost:3005,http://localhost:3000
ADMIN_CORS=http://localhost:3005,http://localhost:9000,http://localhost:3000
AUTH_CORS=http://localhost:3005,http://localhost:3000

# Redis Configuration - use in-memory for development
REDIS_URL=

# Supabase Configuration (for future use)
SUPABASE_URL=https://qpvgxkgjlggcgiqctcji.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwdmd4a2dqbGdnY2dpcWN0Y2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Nzk1NDQsImV4cCI6MjA1MDU1NTU0NH0.FJJ5L6KiCcMa2dMBFmw0KgVDOFNB0iV2XaUl7d1Xc3k
EOF

echo "✅ Environment file created"
echo "📊 Database: SQLite (development-friendly)"
echo "🌐 CORS: Configured for localhost:3005 and localhost:3000"
echo "🔒 Auth: Development secrets configured"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run dev"
echo "2. Run migrations: npx medusa db:migrate"
echo "3. Create admin user: npx medusa user --email admin@fitfoot.com --password admin123" 