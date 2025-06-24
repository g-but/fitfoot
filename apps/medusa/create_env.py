#!/usr/bin/env python3

# Create .env file with proper formatting
DB_URL = "postgresql://postgres.ghsnckaygyjsebgrvdwv:fitfoot2025@aws-0-us-east-2.pooler.supabase.com:6543/postgres"

env_vars = [
    "# === FitFoot Medusa Backend Environment Configuration ===",
    "",
    f"DATABASE_URL={DB_URL}",
    "JWT_SECRET=fitfoot-jwt-secret-super-secure-2025",
    "COOKIE_SECRET=fitfoot-cookie-secret-super-secure-2025",
    "PORT=9000",
    "NODE_ENV=development",
    "STORE_CORS=http://localhost:3005",
    "ADMIN_CORS=http://localhost:3005,http://localhost:9000",
    "REDIS_URL="
]

with open('.env', 'w') as f:
    for line in env_vars:
        f.write(line + '\n')

print("✅ .env file created successfully")
print("Database URL length:", len(DB_URL)) 