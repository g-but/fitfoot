#!/bin/bash

# FitFoot Supabase Setup Script
# This script helps set up the Supabase database for production-ready MedusaJS

set -e

echo "🚀 FitFoot Supabase Setup"
echo "========================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.template .env
    echo "✅ .env file created. Please edit it with your Supabase credentials."
    echo ""
    echo "🔗 Get your Supabase credentials:"
    echo "   1. Go to https://supabase.com/dashboard"
    echo "   2. Create a new project named 'fitfoot-production'"
    echo "   3. Go to Settings > Database"
    echo "   4. Copy the connection string"
    echo "   5. Go to Settings > API"
    echo "   6. Copy the Project URL and anon key"
    echo ""
    echo "📝 Edit .env file and replace:"
    echo "   - [PASSWORD] with your database password"
    echo "   - [PROJECT_REF] with your project reference"
    echo "   - Add your Supabase keys"
    echo ""
    echo "Then run this script again: ./setup-supabase.sh"
    exit 0
fi

# Source environment variables
source .env

# Check if DATABASE_URL is set
if [[ $DATABASE_URL == *"[PASSWORD]"* ]] || [[ $DATABASE_URL == *"[PROJECT_REF]"* ]]; then
    echo "❌ Please update your .env file with real Supabase credentials"
    echo "   Edit the DATABASE_URL to replace [PASSWORD] and [PROJECT_REF]"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔄 Running database migrations..."
npx medusa migrations run

echo "👤 Creating admin user..."
echo "Enter admin email:"
read -r ADMIN_EMAIL
echo "Enter admin password:"
read -s ADMIN_PASSWORD

npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"

echo "🌱 Running FitFoot seed data..."
npx medusa exec ./src/scripts/seed-fitfoot.ts

echo ""
echo "✅ Supabase setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start the development server: npm run dev"
echo "   2. Visit http://localhost:9000/admin"
echo "   3. Login with your admin credentials"
echo "   4. Visit http://localhost:3005 for the storefront"
echo ""
echo "🔗 Useful URLs:"
echo "   - Medusa Admin: http://localhost:9000/admin"
echo "   - Store API: http://localhost:9000/store"
echo "   - Admin API: http://localhost:9000/admin"
echo "   - Supabase Dashboard: https://supabase.com/dashboard/project/[PROJECT_REF]" 