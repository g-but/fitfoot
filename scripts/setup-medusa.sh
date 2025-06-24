#!/bin/bash

echo "🛒 FitFoot Medusa Backend Setup"
echo "================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first:"
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    exit 1
fi

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis first:"
    echo "   Ubuntu/Debian: sudo apt-get install redis-server"
    echo "   macOS: brew install redis"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start services if not running
echo "🔧 Starting required services..."

# Start PostgreSQL (if not running)
if ! pgrep -x "postgres" > /dev/null; then
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql 2>/dev/null || brew services start postgresql 2>/dev/null
fi

# Start Redis (if not running)  
if ! pgrep -x "redis-server" > /dev/null; then
    echo "Starting Redis..."
    sudo systemctl start redis-server 2>/dev/null || brew services start redis 2>/dev/null
fi

# Create database
echo "🗄️  Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE fitfoot_medusa;" 2>/dev/null || echo "Database may already exist"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || echo "User may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fitfoot_medusa TO postgres;" 2>/dev/null

# Run Medusa build and migrations
echo "🏗️  Building Medusa backend..."
cd apps/medusa
npm run build

echo "🔄 Running database migrations..."
npx medusa db:migrate

echo "🌱 Seeding database with sample data..."
npm run seed

echo "✅ Medusa setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev-medusa' to start the backend"
echo "2. Visit http://localhost:9000/app for the admin panel"
echo "3. Use 'npm run dev-dashboard' to start all services"
echo ""
echo "🎉 Happy coding!" 