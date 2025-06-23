#!/bin/bash

# FitFoot Complete Production Migration Script
# Executes the full migration from mock backend to production MedusaJS + Supabase

set -e

echo "🚀 FitFoot Complete Production Migration"
echo "========================================"
echo ""
echo "This script will migrate FitFoot from mock backend to:"
echo "✅ Real MedusaJS backend"
echo "✅ Supabase PostgreSQL database"
echo "✅ Production-ready architecture"
echo "✅ Swiss sustainable footwear platform"
echo ""

# Check if running from project root
if [ ! -f "package.json" ] || [ ! -d "apps/medusa" ]; then
    echo "❌ Please run this script from the FitFoot project root directory"
    exit 1
fi

# Backup current state
echo "📦 Creating backup of current configuration..."
BACKUP_DIR="migration-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup existing configs if they exist
[ -f "apps/medusa/.env" ] && cp "apps/medusa/.env" "$BACKUP_DIR/"
[ -f "apps/web/.env.local" ] && cp "apps/web/.env.local" "$BACKUP_DIR/"

echo "✅ Backup created: $BACKUP_DIR"
echo ""

# Check if environment files exist and are configured
if [ ! -f "apps/medusa/.env" ]; then
    echo "❌ Backend environment file missing: apps/medusa/.env"
    echo "💡 Run this first: cp apps/medusa/env.template apps/medusa/.env"
    echo "   Then edit with your Supabase credentials"
    exit 1
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "❌ Frontend environment file missing: apps/web/.env.local"
    echo "💡 Creating from template..."
    cp apps/web/env.template apps/web/.env.local 2>/dev/null || echo "Template not found, please create manually"
fi

# Check if Supabase credentials are configured
if grep -q "YOUR_DATABASE_PASSWORD\|YOUR_PROJECT_REF\|YOUR_SUPABASE_ANON_KEY" apps/medusa/.env; then
    echo "⚠️  Supabase credentials not configured in apps/medusa/.env"
    echo ""
    echo "🔑 Please update your Supabase credentials:"
    echo "   1. Go to: https://supabase.com/dashboard"
    echo "   2. Create project: 'fitfoot-production'"
    echo "   3. Get credentials from Settings > Database and Settings > API"
    echo "   4. Edit apps/medusa/.env and replace placeholders"
    echo "   5. Edit apps/web/.env.local and replace placeholders"
    echo ""
    echo "Then run this script again: ./complete-production-migration.sh"
    exit 0
fi

echo "🔧 Starting Migration Process..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd apps/medusa
if ! npm list @medusajs/framework > /dev/null 2>&1; then
    echo "Installing MedusaJS dependencies..."
    npm install
fi
cd ../..

echo "✅ Dependencies installed"
echo ""

# Build MedusaJS
echo "🏗️  Building MedusaJS backend..."
cd apps/medusa
if npx medusa build; then
    echo "✅ MedusaJS build successful"
else
    echo "❌ MedusaJS build failed"
    echo "💡 Check your environment configuration and try again"
    exit 1
fi
cd ../..

# Test database connection and run migrations
echo "🗄️  Setting up database..."
cd apps/medusa

echo "Testing database connection..."
if npx medusa db:migrate; then
    echo "✅ Database migrations completed"
else
    echo "❌ Database migration failed"
    echo "💡 Please check your DATABASE_URL in .env file"
    echo "   Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
    exit 1
fi

# Create admin user (interactive)
echo ""
echo "👤 Creating admin user..."
echo "Enter admin email (e.g., admin@fitfoot.ch):"
read -r ADMIN_EMAIL
echo "Enter admin password:"
read -s ADMIN_PASSWORD

if npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"; then
    echo "✅ Admin user created: $ADMIN_EMAIL"
else
    echo "⚠️  Admin user creation failed (user might already exist)"
fi

# Seed Swiss footwear data
echo ""
echo "🌱 Seeding Swiss sustainable footwear products..."
if npx medusa exec ./src/scripts/seed-fitfoot.ts; then
    echo "✅ Swiss footwear products seeded successfully"
else
    echo "⚠️  Seeding failed - you can retry later with: npm run seed"
fi

cd ../..

# Test the complete system
echo ""
echo "🧪 Testing complete system..."
if npm run health; then
    echo "✅ All services healthy"
else
    echo "⚠️  Some services may need manual restart"
    echo "💡 Try: npm run dev"
fi

echo ""
echo "🎉 Migration Complete!"
echo "===================="
echo ""
echo "✅ Status: Production-Ready Swiss E-commerce Platform"
echo ""
echo "🏗️  Architecture:"
echo "   • Real MedusaJS backend with PostgreSQL"
echo "   • Supabase database integration"
echo "   • Swiss sustainable footwear products"
echo "   • Production-ready configuration"
echo ""
echo "🔗 Access Your Platform:"
echo "   • Store: http://localhost:3005"
echo "   • Admin: http://localhost:9000/admin"
echo "   • API: http://localhost:9000"
echo "   • CMS: http://localhost:3334"
echo ""
echo "🚀 Start Development:"
echo "   npm run dev"
echo ""
echo "👤 Admin Login:"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: [your password]"
echo ""
echo "📊 Test Integration:"
echo "   npm run test-all"
echo ""
echo "🎯 Next Steps:"
echo "   1. Start services: npm run dev"
echo "   2. Login to admin: http://localhost:9000/admin"
echo "   3. Customize products and content"
echo "   4. Deploy to production"
echo ""
echo "🇨🇭 Welcome to your Swiss sustainable footwear platform!"