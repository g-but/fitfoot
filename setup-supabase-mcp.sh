#!/bin/bash

# FitFoot Supabase MCP Server Setup
# This script helps set up the Supabase MCP server for direct database access

set -e

echo "🔗 FitFoot Supabase MCP Server Setup"
echo "===================================="

# Check if .mcpconfig.json exists
if [ ! -f ".mcpconfig.json" ]; then
    echo "❌ .mcpconfig.json not found!"
    exit 1
fi

echo "📋 To set up Supabase MCP server, you need:"
echo "   1. A Supabase account and project"
echo "   2. A Supabase Personal Access Token"
echo ""

echo "🔑 Getting your Supabase Personal Access Token:"
echo "   1. Go to https://supabase.com/dashboard/account/tokens"
echo "   2. Click 'Generate new token'"
echo "   3. Name: 'FitFoot MCP Server'"
echo "   4. Copy the generated token"
echo ""

echo "📝 Enter your Supabase Personal Access Token:"
read -s SUPABASE_TOKEN

if [ -z "$SUPABASE_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo "🔧 Updating .mcpconfig.json with your token..."

# Replace the placeholder token in the config file
sed -i "s/<personal-access-token>/$SUPABASE_TOKEN/g" .mcpconfig.json

echo "✅ Supabase MCP server configured!"
echo ""
echo "🔗 MCP Configuration:"
echo "   - Server: @supabase/mcp-server-supabase"  
echo "   - Access Token: [CONFIGURED]"
echo "   - Config File: .mcpconfig.json"
echo ""
echo "🚀 Next Steps:"
echo "   1. Restart your development environment"
echo "   2. The Supabase MCP server will be available"
echo "   3. You can now interact with Supabase directly"
echo "   4. Run 'npm run setup-production' to continue with migration"
echo ""
echo "🔗 Useful Commands:"
echo "   - Test MCP: npx @supabase/mcp-server-supabase --help"
echo "   - View projects: Available through MCP once connected"
echo "   - Manage database: Direct MCP access to your Supabase" 