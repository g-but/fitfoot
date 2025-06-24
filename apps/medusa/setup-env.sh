#!/bin/bash
cat > .env << 'EOF'
# === FitFoot Medusa Backend Environment Configuration ===

# Database Configuration (Supabase PostgreSQL - Direct Connection)
DATABASE_URL=postgresql://postgres:fitfoot2025@db.qpvgxkgjlggcgiqctcji.supabase.co:5432/postgres
DATABASE_TYPE=postgres

# Authentication Secrets
JWT_SECRET=fitfoot-jwt-secret-super-secure-2025
COOKIE_SECRET=fitfoot-cookie-secret-super-secure-2025

# Server Configuration
PORT=9000
NODE_ENV=development

# CORS Configuration
STORE_CORS=http://localhost:3005
ADMIN_CORS=http://localhost:3005,http://localhost:9000
AUTH_CORS=http://localhost:3005

# Disable Redis for development (use in-memory)
REDIS_URL=

# Supabase Configuration
SUPABASE_URL=https://qpvgxkgjlggcgiqctcji.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwdmd4a2dqbGdnY2dpcWN0Y2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Nzk1NDQsImV4cCI6MjA1MDU1NTU0NH0.FJJ5L6KiCcMa2dMBFmw0KgVDOFNB0iV2XaUl7d1Xc3k
EOF 