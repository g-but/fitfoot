#!/bin/bash

echo "🔧 Using direct Supabase connection..."

cat > .env << 'EOF'
# === FitFoot Medusa Backend Environment Configuration ===
DATABASE_URL=postgresql://postgres:fitfoot2025@db.ghsnckaygyjsebgrvdwv.supabase.co:5432/postgres

# Authentication secrets
JWT_SECRET=fitfoot-jwt-secret-super-secure-2025
COOKIE_SECRET=fitfoot-cookie-secret-super-secure-2025

# Server configuration
PORT=9000
NODE_ENV=development

# CORS Configuration
STORE_CORS=http://localhost:3005,http://localhost:3000
ADMIN_CORS=http://localhost:3005,http://localhost:9000,http://localhost:3000
AUTH_CORS=http://localhost:3005,http://localhost:3000

# Redis Configuration - use in-memory for development
REDIS_URL=

# Supabase Configuration
SUPABASE_URL=https://ghsnckaygyjsebgrvdwv.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
EOF

echo "✅ Updated to use direct connection with correct hostname" 