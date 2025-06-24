#!/bin/bash

# This script updates the Medusa backend's .env file to use a specific
# regional connection pooler for Supabase. This can help resolve
# IPv6-related connection issues.

PROJECT_ID="ghsnckaygyjsebgrvdwv"
DB_PASSWORD="fitfoot2025"
REGION="aws-0-us-east-1"
SUPABASE_URL="https://ghsnckaygyjsebgrvdwv.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoc25ja2F5Z3lqc2ViZ3J2ZHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzI4OTQsImV4cCI6MjA2NTM0ODg5NH0.8mdctFRldmJcwDI9LRgzhmKWwUi_iAhQtQEg7dvoEO0"

# Construct the new DATABASE_URL
DATABASE_URL="postgresql://postgres.${PROJECT_ID}:${DB_PASSWORD}@${REGION}.pooler.supabase.com:6543/postgres"

echo "🔧 Attempting to fix Supabase connection using regional pooler..."
echo "🌍 Region: ${REGION}"

# Create the .env file in the medusa directory
cat > ./apps/medusa/.env << EOF
# === FitFoot Medusa Backend Environment Configuration ===
# Using Supabase regional connection pooler to avoid IPv6 issues.

# Database Configuration
DATABASE_URL=${DATABASE_URL}

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
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
EOF

echo "✅ Updated apps/medusa/.env with the new regional database URL."
echo "🚀 You can now try running the database migrations and starting the server." 