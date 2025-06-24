#!/bin/bash

# Ensure FitFoot Deployment Monitor is Always Running
# This script checks if the monitor is running and starts it if needed

set -e

echo "🔍 Ensuring FitFoot Deployment Monitor is running..."

# Change to the correct directory
cd /home/g/dev/fitfoot

# Check if monitor is running
if pgrep -f "deployment-monitor.js" > /dev/null; then
    PID=$(pgrep -f "deployment-monitor.js")
    echo "✅ Monitor is already running (PID: $PID)"
    
    # Show brief status
    echo "📊 Quick Status:"
    ./scripts/monitor-status.sh | head -10
else
    echo "⚠️  Monitor is not running. Starting it now..."
    
    # Start the monitor
    ./scripts/start-monitor.sh
    
    echo ""
    echo "🎉 Monitor is now active and protecting your deployments!"
fi

echo ""
echo "📋 Remember: This system eliminates manual deployment monitoring forever!"
echo "💡 Quick commands:"
echo "   • Check status: npm run monitor:status"
echo "   • View logs: npm run monitor:logs"
echo "   • Restart: ./scripts/start-monitor.sh" 