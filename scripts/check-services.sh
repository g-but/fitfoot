#!/bin/bash

echo "🚀 Fitfoot Services Status Check"
echo "================================"

# Check Next.js Frontend
echo -n "Frontend (Next.js): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3005 | grep -q "200"; then
    echo "✅ Running on http://localhost:3005"
else
    echo "❌ Not responding"
fi

# Check Medusa Backend
echo -n "Medusa Backend: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/health 2>/dev/null | grep -q "200"; then
    echo "✅ Running on http://localhost:9000"
else
    echo "❌ Not responding (may still be starting up)"
fi

# Check Medusa Admin
echo -n "Medusa Admin: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:7001 2>/dev/null | grep -q "200"; then
    echo "✅ Running on http://localhost:7001"
else
    echo "❌ Not responding (may still be starting up)"
fi

# Check MCP Server
echo -n "MCP Server: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200"; then
    echo "✅ Running on http://localhost:3000"
else
    echo "❌ Not responding (may still be starting up)"
fi

echo ""
echo "🔗 Quick Links:"
echo "   Frontend: http://localhost:3005"
echo "   Shop: http://localhost:3005/shop"
echo "   Medusa Admin: http://localhost:7001"
echo "   Medusa API: http://localhost:9000"
echo "   MCP Server: http://localhost:3000"
echo ""
echo "📊 Process Status:"
ps aux | grep -E "(medusa|next)" | grep -v grep | awk '{print "   " $11 " (PID: " $2 ")"}' 