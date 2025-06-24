#!/bin/bash

# 🚀 FitFoot Infrastructure Setup Script
# Sets up PostgreSQL, Redis, and initializes Medusa backend

set -e  # Exit on any error

echo "🚀 FitFoot Infrastructure Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    DISTRO=$(lsb_release -i | cut -f2)
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

print_step "Detected OS: $OS"

# Check if running as root (not recommended)
if [[ $EUID -eq 0 ]]; then
    print_warning "Running as root. Some operations may behave differently."
fi

# Step 1: Install PostgreSQL
print_step "1. Setting up PostgreSQL..."

if command -v psql &> /dev/null; then
    print_success "PostgreSQL already installed"
else
    print_step "Installing PostgreSQL..."
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "Ubuntu" ]] || [[ "$DISTRO" == "Debian" ]]; then
            sudo apt-get update
            sudo apt-get install -y postgresql postgresql-contrib
        elif [[ "$DISTRO" == "Fedora" ]] || [[ "$DISTRO" == "CentOS" ]]; then
            sudo yum install -y postgresql postgresql-server postgresql-contrib
            sudo postgresql-setup initdb
        fi
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    elif [[ "$OS" == "macos" ]]; then
        brew install postgresql
        brew services start postgresql
    fi
    print_success "PostgreSQL installed"
fi

# Step 2: Install Redis
print_step "2. Setting up Redis..."

if command -v redis-cli &> /dev/null; then
    print_success "Redis already installed"
else
    print_step "Installing Redis..."
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "Ubuntu" ]] || [[ "$DISTRO" == "Debian" ]]; then
            sudo apt-get install -y redis-server
        elif [[ "$DISTRO" == "Fedora" ]] || [[ "$DISTRO" == "CentOS" ]]; then
            sudo yum install -y redis
        fi
        sudo systemctl start redis
        sudo systemctl enable redis
    elif [[ "$OS" == "macos" ]]; then
        brew install redis
        brew services start redis
    fi
    print_success "Redis installed"
fi

# Step 3: Start Services
print_step "3. Starting services..."

# Start PostgreSQL
if [[ "$OS" == "linux" ]]; then
    sudo systemctl start postgresql || print_warning "PostgreSQL may already be running"
elif [[ "$OS" == "macos" ]]; then
    brew services start postgresql || print_warning "PostgreSQL may already be running"
fi

# Start Redis
if [[ "$OS" == "linux" ]]; then
    sudo systemctl start redis || print_warning "Redis may already be running"
elif [[ "$OS" == "macos" ]]; then
    brew services start redis || print_warning "Redis may already be running"
fi

# Wait for services to be ready
print_step "Waiting for services to be ready..."
sleep 3

# Step 4: Create Database
print_step "4. Setting up FitFoot database..."

# Create database and user
if [[ "$OS" == "linux" ]]; then
    sudo -u postgres psql -c "CREATE DATABASE fitfoot_medusa;" 2>/dev/null || print_warning "Database may already exist"
    sudo -u postgres psql -c "CREATE USER fitfoot_user WITH PASSWORD 'fitfoot_password';" 2>/dev/null || print_warning "User may already exist"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fitfoot_medusa TO fitfoot_user;" 2>/dev/null || true
    sudo -u postgres psql -c "ALTER USER fitfoot_user CREATEDB;" 2>/dev/null || true
elif [[ "$OS" == "macos" ]]; then
    createdb fitfoot_medusa 2>/dev/null || print_warning "Database may already exist"
    psql -d postgres -c "CREATE USER fitfoot_user WITH PASSWORD 'fitfoot_password';" 2>/dev/null || print_warning "User may already exist"
    psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE fitfoot_medusa TO fitfoot_user;" 2>/dev/null || true
    psql -d postgres -c "ALTER USER fitfoot_user CREATEDB;" 2>/dev/null || true
fi

print_success "Database setup complete"

# Step 5: Test Connections
print_step "5. Testing connections..."

# Test PostgreSQL
if pg_isready &> /dev/null; then
    print_success "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
    exit 1
fi

# Test Redis
if redis-cli ping &> /dev/null; then
    print_success "Redis is ready"
else
    print_error "Redis is not ready"
    exit 1
fi

# Step 6: Configure Medusa Environment
print_step "6. Configuring Medusa environment..."

# Create environment file for Medusa
ENV_FILE="apps/medusa/.env.local"
cat > "$ENV_FILE" << EOF
# FitFoot Medusa Backend Configuration
NODE_ENV=development
PORT=9000

# Database Configuration
DATABASE_URL=postgres://fitfoot_user:fitfoot_password@localhost:5432/fitfoot_medusa

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT & Security
JWT_SECRET=fitfoot-super-secret-jwt-key-development-only
COOKIE_SECRET=fitfoot-super-secret-cookie-key-development-only

# CORS Configuration
STORE_CORS=http://localhost:3000,http://localhost:3005
ADMIN_CORS=http://localhost:3000,http://localhost:3005,http://localhost:9000
AUTH_CORS=http://localhost:3000,http://localhost:3005

# Admin Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=

# File Storage (local development)
STORAGE_LOCATION=./uploads

# Logging
LOG_LEVEL=debug
EOF

print_success "Environment configuration created"

# Step 7: Install Medusa Dependencies
print_step "7. Installing Medusa dependencies..."
cd apps/medusa
npm install
print_success "Medusa dependencies installed"

# Step 8: Build and Initialize Medusa
print_step "8. Building Medusa..."
npm run build

print_step "9. Running Medusa migrations..."
npx medusa db:migrate

print_step "10. Creating admin user..."
# Create admin user non-interactively
npx medusa user --email admin@fitfoot.com --password fitfoot123 --invite || print_warning "Admin user may already exist"

print_step "11. Seeding sample data..."
npm run seed || print_warning "Seed data may already exist"

print_success "Medusa backend fully initialized"

# Return to project root
cd ../..

# Step 9: Update Development Scripts
print_step "12. Updating development scripts..."

# Create a comprehensive development script
cat > scripts/dev-full.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting FitFoot Development Environment"
echo "=========================================="

# Check prerequisites
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL is not ready. Run './scripts/setup-infrastructure.sh' first"
    exit 1
fi

if ! redis-cli ping &> /dev/null; then
    echo "❌ Redis is not ready. Run './scripts/setup-infrastructure.sh' first"
    exit 1
fi

echo "✅ All prerequisites ready"
echo ""

# Start the enhanced dashboard
npm run dev-dashboard
EOF

chmod +x scripts/dev-full.sh

print_success "Development scripts updated"

# Step 10: Create Quick Service Commands
print_step "13. Creating service management commands..."

# Service status script
cat > scripts/check-services.sh << 'EOF'
#!/bin/bash

echo "🔍 FitFoot Service Status Check"
echo "==============================="
echo ""

# Check PostgreSQL
if pg_isready &> /dev/null; then
    echo "✅ PostgreSQL: Running"
else
    echo "❌ PostgreSQL: Not running"
fi

# Check Redis
if redis-cli ping &> /dev/null; then
    echo "✅ Redis: Running"  
else
    echo "❌ Redis: Not running"
fi

# Check if Medusa process is running
if pgrep -f "medusa develop" > /dev/null; then
    echo "✅ Medusa Backend: Running"
else
    echo "⚠️ Medusa Backend: Not running"
fi

# Check if Next.js is running
if pgrep -f "next dev" > /dev/null; then
    echo "✅ Next.js Frontend: Running"
else
    echo "⚠️ Next.js Frontend: Not running"
fi

# Check if Sanity is running
if pgrep -f "sanity dev" > /dev/null; then
    echo "✅ Sanity CMS: Running"
else
    echo "⚠️ Sanity CMS: Not running"
fi

echo ""
echo "📊 Service Ports:"
echo "   Frontend:     http://localhost:3005"
echo "   Medusa API:   http://localhost:9000"
echo "   Medusa Admin: http://localhost:9000/app"
echo "   Sanity CMS:   http://localhost:3334"
EOF

chmod +x scripts/check-services.sh

print_success "Service management scripts created"

# Final success message
echo ""
echo "🎉 FitFoot Infrastructure Setup Complete!"
echo "========================================"
echo ""
echo "📋 What was set up:"
echo "   ✅ PostgreSQL database server"
echo "   ✅ Redis cache server"
echo "   ✅ FitFoot database created"
echo "   ✅ Medusa backend configured"
echo "   ✅ Admin user created (admin@fitfoot.com / fitfoot123)"
echo "   ✅ Sample data seeded"
echo "   ✅ Development scripts created"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run dev-dashboard    (start all services with dashboard)"
echo "   2. Visit: http://localhost:9000/app (Medusa admin)"
echo "   3. Login with: admin@fitfoot.com / fitfoot123"
echo ""
echo "🔧 Useful commands:"
echo "   ./scripts/check-services.sh      - Check service status"
echo "   ./scripts/dev-full.sh           - Start development environment"
echo "   npm run dev-medusa               - Start only Medusa backend"
echo ""
print_success "Ready for development! 🎉" 