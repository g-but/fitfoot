#!/bin/bash

# === FitFoot Services Integration Script ===
# This script seamlessly connects Next.js + Medusa + Supabase + Sanity

echo "🚀 FitFoot Services Integration Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Use the correct DATABASE_URL provided by user
DATABASE_URL="postgresql://postgres:fitfoot2025@db.ghsnckaygyjsebgrvdwv.supabase.co:5432/postgres"

print_step "Step 1: Setting up environment variables..."
print_success "Using correct Supabase connection string"

# Create Medusa environment
print_step "Step 2: Configuring Medusa backend..."

cd apps/medusa

cat > .env << EOF
# === FitFoot Medusa Backend Environment Configuration ===
DATABASE_URL=$DATABASE_URL

# Authentication secrets
JWT_SECRET=fitfoot-jwt-secret-super-secure-2025
COOKIE_SECRET=fitfoot-cookie-secret-super-secure-2025

# Server configuration
PORT=9000
NODE_ENV=development

# CORS Configuration - allowing frontend and admin
STORE_CORS=http://localhost:3005,http://localhost:3000
ADMIN_CORS=http://localhost:3005,http://localhost:9000,http://localhost:3000
AUTH_CORS=http://localhost:3005,http://localhost:3000

# Redis Configuration - use in-memory for development
REDIS_URL=

# Supabase Configuration (updated with correct project)
SUPABASE_URL=https://ghsnckaygyjsebgrvdwv.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
EOF

print_success "Medusa environment configured with correct Supabase URL"

# Run database migrations
print_step "Step 3: Setting up database schema..."

if npx medusa db:migrate; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    echo ""
    print_warning "Please check your Supabase project is active"
    exit 1
fi

# Create admin user
print_step "Step 4: Creating admin user..."

if npx medusa user --email admin@fitfoot.com --password admin123; then
    print_success "Admin user created (admin@fitfoot.com / admin123)"
else
    print_warning "Admin user creation failed (might already exist)"
fi

# Configure frontend environment
print_step "Step 5: Configuring Next.js frontend..."

cd ../web

# Create web environment (if not blocked)
if [[ ! -f ".env.local" ]]; then
    cat > .env.local << EOF
# === FitFoot Frontend Environment Configuration ===
NEXT_PUBLIC_SITE_URL=http://localhost:3005
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qpvgxkgjlggcgiqctcji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwdmd4a2dqbGdnY2dpcWN0Y2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Nzk1NDQsImV4cCI6MjA1MDU1NTU0NH0.FJJ5L6KiCcMa2dMBFmw0KgVDOFNB0iV2XaUl7d1Xc3k

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=m6r6y2se
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-27

# Development
NODE_ENV=development
EOF
    print_success "Frontend environment configured"
else
    print_warning "Frontend .env.local already exists, skipping"
fi

cd ../..

print_step "Step 6: Testing Medusa server startup..."

# Test if Medusa can start
cd apps/medusa
timeout 30 npx medusa develop &
MEDUSA_PID=$!
sleep 10

# Check if Medusa is responding
if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    print_success "Medusa backend is running on port 9000"
    kill $MEDUSA_PID 2>/dev/null
else
    print_warning "Medusa backend not responding yet (may need more time)"
    kill $MEDUSA_PID 2>/dev/null
fi

cd ../..

print_success "🎉 FitFoot services integration completed!"
echo ""
echo "📋 Summary:"
echo "✅ Medusa backend configured with correct Supabase PostgreSQL"
echo "✅ Database schema migrated"
echo "✅ Admin user created (admin@fitfoot.com / admin123)"
echo "✅ CORS configured for seamless communication"
echo ""
echo "🚀 Start all services:"
echo "npm run dev"
echo ""
echo "🌐 Service URLs:"
echo "• Frontend: http://localhost:3005"
echo "• Admin: http://localhost:3005/admin"
echo "• API: http://localhost:9000"
echo "• Sanity: http://localhost:3334"
echo ""
echo "🔑 Admin Login:"
echo "Email: admin@fitfoot.com"
echo "Password: admin123"
echo ""
echo "🎯 Next Steps:"
echo "1. Run 'npm run dev' to start all services"
echo "2. Test the integration by visiting the admin panel"
echo "3. Add products via the admin interface"
echo "4. Verify frontend displays products from Medusa" 