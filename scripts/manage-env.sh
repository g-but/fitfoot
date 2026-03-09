#!/bin/bash

# FitFoot Environment Management Script
# Uses MCP agents for GitHub, Vercel, and Supabase management

set -e

echo "🔧 FitFoot Environment Management"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if MCP servers are available
check_mcp_servers() {
    print_status "Checking MCP server availability..."

    # Check Supabase MCP
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_status "✓ Supabase MCP server available"
        SUPABASE_MCP_AVAILABLE=true
    else
        print_warning "⚠ Supabase MCP server not available"
        SUPABASE_MCP_AVAILABLE=false
    fi

    # Check GitHub MCP (placeholder - would need actual MCP server)
    if command -v gh &> /dev/null; then
        print_status "✓ GitHub CLI available (MCP integration needed)"
        GITHUB_MCP_AVAILABLE=true
    else
        print_warning "⚠ GitHub CLI not available"
        GITHUB_MCP_AVAILABLE=false
    fi

    # Check Vercel MCP (placeholder - would need actual MCP server)
    if command -v vercel &> /dev/null; then
        print_status "✓ Vercel CLI available (MCP integration needed)"
        VERCEL_MCP_AVAILABLE=true
    else
        print_warning "⚠ Vercel CLI not available"
        VERCEL_MCP_AVAILABLE=false
    fi
}

# Function to setup Supabase via MCP
setup_supabase() {
    print_status "Setting up Supabase configuration..."

    if [ "$SUPABASE_MCP_AVAILABLE" = true ]; then
        # Use MCP to get Supabase configuration
        print_status "Using Supabase MCP to get configuration..."

        # Get project URL
        SUPABASE_URL=$(curl -s http://localhost:3000/api/project-url 2>/dev/null || echo "")
        if [ -z "$SUPABASE_URL" ]; then
            SUPABASE_URL="https://your-project.supabase.co"
            print_warning "Using default Supabase URL: $SUPABASE_URL"
        fi

        # Get anon key
        SUPABASE_ANON_KEY=$(curl -s http://localhost:3000/api/publishable-keys 2>/dev/null | grep -o '"anon":"[^"]*"' | cut -d'"' -f4 || echo "")
        if [ -z "$SUPABASE_ANON_KEY" ]; then
            SUPABASE_ANON_KEY="your-supabase-anon-key"
            print_warning "Using default Supabase anon key"
        fi

        # Get service role key (for backend)
        SUPABASE_SERVICE_KEY=$(curl -s http://localhost:3000/api/service-keys 2>/dev/null | grep -o '"service_role":"[^"]*"' | cut -d'"' -f4 || echo "")
        if [ -z "$SUPABASE_SERVICE_KEY" ]; then
            print_warning "Service role key not available via MCP - will use placeholder"
            SUPABASE_SERVICE_KEY="your-service-role-key-placeholder"
        fi

    else
        print_warning "Supabase MCP not available - using defaults"
        SUPABASE_URL="https://your-project.supabase.co"
        SUPABASE_ANON_KEY="your-supabase-anon-key"
        SUPABASE_SERVICE_KEY="your-service-role-key-placeholder"
    fi
}

# Function to setup GitHub via MCP (placeholder)
setup_github() {
    print_status "Setting up GitHub configuration..."

    if [ "$GITHUB_MCP_AVAILABLE" = true ]; then
        print_status "GitHub MCP integration available"

        # Get repository info
        GITHUB_REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "fitfoot/fitfoot")
        GITHUB_TOKEN=$(gh auth token 2>/dev/null || echo "")

        if [ -n "$GITHUB_TOKEN" ]; then
            print_status "GitHub token found"
        else
            print_warning "GitHub token not found - run 'gh auth login'"
        fi

    else
        print_warning "GitHub MCP not available - manual setup needed"
        GITHUB_REPO="fitfoot/fitfoot"
    fi
}

# Function to setup Vercel via MCP (placeholder)
setup_vercel() {
    print_status "Setting up Vercel configuration..."

    if [ "$VERCEL_MCP_AVAILABLE" = true ]; then
        print_status "Vercel MCP integration available"

        # Get Vercel project info
        VERCEL_PROJECT=$(vercel project ls 2>/dev/null | grep fitfoot | awk '{print $2}' || echo "")
        VERCEL_TOKEN=$(vercel auth token 2>/dev/null || echo "")

        if [ -n "$VERCEL_TOKEN" ]; then
            print_status "Vercel token found"
        else
            print_warning "Vercel token not found - run 'vercel auth login'"
        fi

    else
        print_warning "Vercel MCP not available - manual setup needed"
    fi
}

# Function to generate environment files
generate_env_files() {
    print_status "Generating environment files..."

    # Generate root .env.local
    cat > .env.local << EOF
# === FitFoot Environment Configuration ===
# Managed by MCP agents for GitHub, Vercel, and Supabase

# === Frontend / Next.js ===
NEXT_PUBLIC_SITE_URL=http://localhost:3005
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# === Supabase Configuration ===
# Managed by Supabase MCP Agent
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# === Sanity CMS ===
NEXT_PUBLIC_SANITY_PROJECT_ID=m6r6y2se
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-27

# === Error Tracking & Monitoring ===
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=

# === Performance Monitoring ===
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# === Development Settings ===
NODE_ENV=development
EOF

    # Generate apps/web/.env.local
    mkdir -p apps/web
    cat > apps/web/.env.local << EOF
# Next.js Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your-medusa-publishable-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=m6r6y2se
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Sentry Configuration (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=fitfoot-web
SENTRY_AUTH_TOKEN=

# Development
NODE_ENV=development
NEXT_PUBLIC_VERCEL_ENV=development

# Security
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3005
EOF

    # Generate apps/medusa/.env
    mkdir -p apps/medusa
    cat > apps/medusa/.env << EOF
# Supabase Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# Redis (optional - use Supabase or external Redis)
REDIS_URL=redis://localhost:6379

# JWT & Security
JWT_SECRET=your-super-secure-jwt-secret-here
COOKIE_SECRET=your-super-secure-cookie-secret-here

# CORS Configuration
STORE_CORS=http://localhost:3005
ADMIN_CORS=http://localhost:3005,http://localhost:9000
AUTH_CORS=http://localhost:3005

# Worker Mode
WORKER_MODE=shared
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# File Storage (Supabase Storage)
SUPABASE_STORAGE_BUCKET=fitfoot-products

# Email Configuration (optional)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@fitfoot.ch

# Development
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
EOF

    print_status "Environment files generated successfully"
}

# Function to validate environment setup
validate_env() {
    print_status "Validating environment setup..."

    # Check if required files exist
    local files=(".env.local" "apps/web/.env.local" "apps/medusa/.env")
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_status "✓ $file exists"
        else
            print_error "✗ $file missing"
        fi
    done

    # Check for placeholder values
    if grep -q "your-" .env.local; then
        print_warning "⚠ .env.local contains placeholder values that need to be replaced"
    fi

    if grep -q "your-" apps/web/.env.local; then
        print_warning "⚠ apps/web/.env.local contains placeholder values that need to be replaced"
    fi

    if grep -q "your-" apps/medusa/.env; then
        print_warning "⚠ apps/medusa/.env contains placeholder values that need to be replaced"
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."

    if [ "$VERCEL_MCP_AVAILABLE" = true ]; then
        print_status "Using Vercel MCP for deployment..."

        # Set environment variables for Vercel
        vercel env add NEXT_PUBLIC_SUPABASE_URL production 2>/dev/null || print_warning "NEXT_PUBLIC_SUPABASE_URL already set"
        vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production 2>/dev/null || print_warning "NEXT_PUBLIC_SUPABASE_ANON_KEY already set"
        vercel env add SUPABASE_SERVICE_ROLE_KEY production 2>/dev/null || print_warning "SUPABASE_SERVICE_ROLE_KEY already set"

        # Deploy
        vercel --prod

    else
        print_warning "Vercel MCP not available - manual deployment needed"
        echo "Run: vercel --prod"
    fi
}

# Function to setup GitHub Actions
setup_github_actions() {
    print_status "Setting up GitHub Actions..."

    if [ "$GITHUB_MCP_AVAILABLE" = true ]; then
        print_status "Using GitHub MCP for Actions setup..."

        # Create GitHub Actions workflow
        mkdir -p .github/workflows
        cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db push
      - run: echo "Deploy to Vercel via webhook"
EOF

        # Setup repository secrets (would need MCP integration)
        print_warning "GitHub repository secrets need to be configured manually:"
        echo "  - SUPABASE_ACCESS_TOKEN"
        echo "  - VERCEL_TOKEN"
        echo "  - SENTRY_AUTH_TOKEN"

    else
        print_warning "GitHub MCP not available - manual Actions setup needed"
    fi
}

# Main execution
case "${1:-help}" in
    "check")
        check_mcp_servers
        ;;
    "setup")
        check_mcp_servers
        setup_supabase
        setup_github
        setup_vercel
        generate_env_files
        validate_env
        ;;
    "supabase")
        setup_supabase
        ;;
    "github")
        setup_github
        ;;
    "vercel")
        setup_vercel
        ;;
    "deploy")
        deploy_vercel
        ;;
    "validate")
        validate_env
        ;;
    "actions")
        setup_github_actions
        ;;
    "help"|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  check     - Check MCP server availability"
        echo "  setup     - Setup all environment variables"
        echo "  supabase  - Setup Supabase configuration"
        echo "  github    - Setup GitHub configuration"
        echo "  vercel    - Setup Vercel configuration"
        echo "  deploy    - Deploy to Vercel"
        echo "  validate  - Validate environment setup"
        echo "  actions   - Setup GitHub Actions"
        echo "  help      - Show this help"
        ;;
esac