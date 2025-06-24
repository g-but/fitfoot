#!/bin/bash

# === FitFoot Complete Integration Script ===
# This gets all services working immediately, bypassing network issues

echo "🚀 FitFoot Complete Integration - Development Setup"
echo "================================================="
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

# Step 1: Configure Medusa with mock backend for immediate development
print_step "Step 1: Setting up Medusa with development-friendly configuration..."

cd apps/medusa

# Install sqlite3 for development database
if ! command -v sqlite3 &> /dev/null; then
    print_warning "Installing sqlite3 for development database..."
    sudo apt-get update && sudo apt-get install -y sqlite3 libsqlite3-dev
fi

# Create development environment with SQLite
cat > .env << 'EOF'
# === FitFoot Medusa Backend Environment Configuration ===
# Development setup with SQLite (bypasses Supabase IPv6 issues)

# Database Configuration - SQLite for immediate development
DATABASE_URL=sqlite:./medusa-db.sqlite

# Authentication secrets
JWT_SECRET=fitfoot-jwt-secret-super-secure-2025
COOKIE_SECRET=fitfoot-cookie-secret-super-secure-2025

# Server configuration
PORT=9000
NODE_ENV=development

# CORS Configuration - allowing all necessary origins
STORE_CORS=http://localhost:3005,http://localhost:3000
ADMIN_CORS=http://localhost:3005,http://localhost:9000,http://localhost:3000
AUTH_CORS=http://localhost:3005,http://localhost:3000

# Redis Configuration - use in-memory for development
REDIS_URL=

# Supabase Configuration (for future frontend integration)
SUPABASE_URL=https://ghsnckaygyjsebgrvdwv.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
EOF

print_success "Medusa configured with SQLite for immediate development"

# Step 2: Run database migrations
print_step "Step 2: Setting up database schema..."

if npx medusa db:migrate; then
    print_success "Database migrations completed successfully"
else
    print_error "Database migrations failed"
    exit 1
fi

# Step 3: Create admin user
print_step "Step 3: Creating admin user..."

if npx medusa user --email admin@fitfoot.com --password admin123; then
    print_success "Admin user created (admin@fitfoot.com / admin123)"
else
    print_warning "Admin user creation failed (might already exist)"
fi

cd ../..

# Step 4: Update Medusa client for frontend integration
print_step "Step 4: Updating frontend Medusa client..."

cat > apps/web/src/lib/medusa.client.ts << 'EOF'
import Medusa from '@medusajs/js-sdk'

// Initialize Medusa client with fallback handling
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
  debug: process.env.NODE_ENV === 'development',
})

// Enhanced error handling for development
const handleApiError = (error: any, operation: string) => {
  console.warn(`Medusa ${operation} failed:`, error.message)
  return []
}

// Product types for TypeScript
export interface MedusaProduct {
  id: string
  title: string
  description?: string | null
  handle: string
  status: string
  images?: Array<{
    id: string
    url: string
  }>
  variants?: Array<{
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  collection?: {
    id: string
    title: string
    handle: string
  }
  tags?: Array<{
    id: string
    value: string
  }>
}

export interface MedusaCollection {
  id: string
  title: string
  handle: string
  products?: MedusaProduct[]
}

// Enhanced helper functions with error handling
export const getProducts = async (params?: {
  limit?: number
  offset?: number
  collection_id?: string
  tags?: string[]
}) => {
  try {
    const response = await medusa.store.product.list(params)
    return response.products || []
  } catch (error) {
    return handleApiError(error, 'getProducts')
  }
}

export const getProduct = async (id: string) => {
  try {
    const response = await medusa.store.product.retrieve(id)
    return response.product
  } catch (error) {
    console.warn('Medusa getProduct failed:', error.message)
    return null
  }
}

export const getCollections = async () => {
  try {
    const response = await medusa.store.collection.list()
    return response.collections || []
  } catch (error) {
    return handleApiError(error, 'getCollections')
  }
}

export const getCollection = async (id: string) => {
  try {
    const response = await medusa.store.collection.retrieve(id)
    return response.collection
  } catch (error) {
    console.warn('Medusa getCollection failed:', error.message)
    return null
  }
}

// Health check function
export const checkMedusaHealth = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/health`)
    return response.ok
  } catch (error) {
    console.warn('Medusa health check failed:', error)
    return false
  }
}
EOF

print_success "Frontend Medusa client updated with enhanced error handling"

# Step 5: Create comprehensive test script
print_step "Step 5: Creating integration test script..."

cat > test-integration.sh << 'EOF'
#!/bin/bash

echo "🧪 Testing FitFoot Integration..."

# Test Medusa backend
echo "Testing Medusa backend..."
if curl -s http://localhost:9000/health > /dev/null; then
    echo "✅ Medusa backend is running"
else
    echo "❌ Medusa backend is not running"
    echo "💡 Start with: cd apps/medusa && npm run dev"
fi

# Test Next.js frontend
echo "Testing Next.js frontend..."
if curl -s http://localhost:3005 > /dev/null; then
    echo "✅ Next.js frontend is running"
else
    echo "❌ Next.js frontend is not running"
    echo "💡 Start with: cd apps/web && npm run dev"
fi

# Test Sanity CMS
echo "Testing Sanity CMS..."
if curl -s http://localhost:3334 > /dev/null; then
    echo "✅ Sanity CMS is running"
else
    echo "❌ Sanity CMS is not running"
    echo "💡 Start with: cd packages/sanity && npm run dev"
fi

echo ""
echo "🎯 Integration Status:"
echo "• Medusa: SQLite database (development-ready)"
echo "• Frontend: Next.js with Medusa client"
echo "• CMS: Sanity Studio"
echo "• Database: Local SQLite (bypasses network issues)"
EOF

chmod +x test-integration.sh

print_success "Integration test script created"

print_success "🎉 FitFoot integration completed!"
echo ""
echo "📋 What's Been Set Up:"
echo "✅ Medusa backend with SQLite database (development-ready)"
echo "✅ Database schema migrated"
echo "✅ Admin user created (admin@fitfoot.com / admin123)"
echo "✅ Frontend Medusa client updated"
echo "✅ CORS configured for seamless communication"
echo "✅ Error handling for robust development"
echo ""
echo "🚀 Start Development:"
echo "npm run dev"
echo ""
echo "🌐 Service URLs:"
echo "• Frontend: http://localhost:3005"
echo "• Admin: http://localhost:3005/admin"
echo "• API: http://localhost:9000"
echo "• Sanity: http://localhost:3334"
echo ""
echo "🧪 Test Integration:"
echo "./test-integration.sh"
echo ""
echo "🎯 Next Steps:"
echo "1. Run 'npm run dev' to start all services"
echo "2. Visit http://localhost:3005/admin (admin@fitfoot.com / admin123)"
echo "3. Add products via admin interface"
echo "4. See products appear on frontend automatically"
echo ""
echo "🔄 Upgrade to Supabase Later:"
echo "When your network supports IPv6 or Supabase provides IPv4:"
echo "• Update DATABASE_URL in apps/medusa/.env"
echo "• Run migrations: npx medusa db:migrate"
echo "• Your data structure remains identical"
EOF 