#!/bin/bash

echo "🔧 Fixing Sanity CORS Configuration for Production..."
echo ""

# Navigate to Sanity package
cd packages/sanity

echo "📋 Current Sanity project configuration:"
echo "Project ID: m6r6y2se"
echo "Dataset: production"
echo "Production URL: https://www.fitfoot.ch"
echo ""

echo "🌐 Adding CORS origins for production domain..."

# Add CORS origins for your production domain
npx sanity cors add https://www.fitfoot.ch --credentials
npx sanity cors add https://fitfoot.ch --credentials

echo ""
echo "📋 Listing current CORS configuration:"
npx sanity cors list

echo ""
echo "✅ CORS configuration updated!"
echo ""
echo "🎯 Next steps:"
echo "1. Your site should now work without CORS errors"
echo "2. Test by visiting https://www.fitfoot.ch"
echo "3. Check browser console - CORS errors should be gone"
echo ""
echo "🔍 If you still see issues:"
echo "1. Clear browser cache and cookies"
echo "2. Try incognito/private browsing mode"
echo "3. Verify the exact domain in the error matches what you added" 