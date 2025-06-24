#!/bin/bash

# Configure Existing Supabase Project for FitFoot
# This script configures your existing "fitfoot" project

set -e

echo "🔗 Configuring Existing Supabase Project: fitfoot"
echo "=============================================="

# Check if .env file exists
if [ -f "apps/medusa/.env" ]; then
    echo "📝 Found existing .env file"
    echo "💡 Backing up current .env to .env.backup"
    cp apps/medusa/.env apps/medusa/.env.backup
else
    echo "📝 Creating new .env file from template"
    cp apps/medusa/env.template apps/medusa/.env
fi

echo ""
echo "🔑 To configure your existing 'fitfoot' project, I need:"
echo "   1. Your Supabase project URL"
echo "   2. Your database password"
echo "   3. Your Supabase API keys"
echo ""
echo "📋 Get these from: https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]"
echo ""

# Get project reference/URL
echo "🌐 Enter your Supabase project URL (e.g., https://abcdefg.supabase.co):"
read -r SUPABASE_URL

# Extract project reference from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\)\.supabase\.co/\1/')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Invalid Supabase URL format. Please use format: https://[project-ref].supabase.co"
    exit 1
fi

echo "✅ Project Reference: $PROJECT_REF"

# Get database password
echo ""
echo "🔒 Enter your database password:"
read -s DB_PASSWORD

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Database password is required"
    exit 1
fi

# Get Supabase anon key
echo ""
echo "🔑 Enter your Supabase anon key (from Settings > API):"
read -r SUPABASE_ANON_KEY

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase anon key is required"
    exit 1
fi

# Get service role key (optional)
echo ""
echo "🔑 Enter your Supabase service role key (optional, for admin operations):"
read -r SUPABASE_SERVICE_KEY

echo ""
echo "🔧 Updating configuration files..."

# Update Medusa backend .env
cat > apps/medusa/.env << EOF
# Supabase Database Configuration
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres

# JWT & Security
JWT_SECRET=fitfoot-production-jwt-$(openssl rand -hex 16)
COOKIE_SECRET=fitfoot-production-cookie-$(openssl rand -hex 16)

# CORS Configuration
STORE_CORS=http://localhost:3005,https://fitfoot.ch
ADMIN_CORS=http://localhost:3005,http://localhost:9000,https://admin.fitfoot.ch
AUTH_CORS=http://localhost:3005,https://fitfoot.ch

# Worker Mode
WORKER_MODE=shared
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}

# File Storage (Supabase Storage)
SUPABASE_STORAGE_BUCKET=fitfoot-products

# Development
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
EOF

# Update frontend .env.local
cat > apps/web/.env.local << EOF
# Next.js Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Sanity CMS Configuration (if using)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Development
NODE_ENV=development
NEXT_PUBLIC_VERCEL_ENV=development
EOF

echo "✅ Configuration files updated!"
echo ""

echo "🔄 Testing database connection..."
cd apps/medusa

# Test connection
if npx medusa --version > /dev/null 2>&1; then
    echo "✅ Medusa CLI available"
else
    echo "📦 Installing Medusa dependencies..."
    npm install
fi

echo ""
echo "🗄️ Running database migrations..."
if npx medusa migrations run; then
    echo "✅ Database migrations completed"
else
    echo "❌ Migration failed. Please check your database connection."
    echo "💡 Verify your database password and project URL"
    exit 1
fi

echo ""
echo "👤 Creating admin user..."
echo "Enter admin email (e.g., admin@fitfoot.ch):"
read -r ADMIN_EMAIL
echo "Enter admin password:"
read -s ADMIN_PASSWORD

if npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"; then
    echo "✅ Admin user created successfully"
else
    echo "⚠️  Admin user creation failed (user might already exist)"
fi

echo ""
echo "🌱 Seeding Swiss footwear products..."
if npx medusa exec ./src/scripts/seed-fitfoot.ts; then
    echo "✅ Swiss footwear products seeded successfully"
else
    echo "⚠️  Seeding failed - you can retry later with: npm run seed"
fi

cd ../..

echo ""
echo "🎉 Supabase Project 'fitfoot' Configured Successfully!"
echo ""
echo "🔗 Your Configuration:"
echo "   • Project: fitfoot ($PROJECT_REF)"
echo "   • Database: PostgreSQL via Supabase"
echo "   • Admin Email: $ADMIN_EMAIL"
echo "   • Environment: Development"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start development: npm run dev"
echo "   2. Visit Admin: http://localhost:9000/admin"
echo "   3. Visit Store: http://localhost:3005"
echo "   4. Test integration: npm run test-all"
echo ""
echo "🔗 Useful URLs:"
echo "   • Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
echo "   • Database: $SUPABASE_URL"
echo "   • Medusa Admin: http://localhost:9000/admin"
echo "   • FitFoot Store: http://localhost:3005"
EOF 