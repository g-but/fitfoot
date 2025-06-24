#!/bin/bash

# Stop FitFoot Deployment Monitor

echo "🛑 Stopping FitFoot Deployment Monitor..."

# Check if PID file exists
if [ -f "logs/monitor.pid" ]; then
    PID=$(cat logs/monitor.pid)
    
    if ps -p $PID > /dev/null; then
        echo "🔄 Stopping monitor process (PID: $PID)..."
        kill $PID
        
        # Wait for graceful shutdown
        sleep 3
        
        # Force kill if still running
        if ps -p $PID > /dev/null; then
            echo "⚠️  Force stopping monitor..."
            kill -9 $PID
        fi
        
        echo "✅ Monitor stopped successfully"
    else
        echo "⚠️  Monitor process not found (PID: $PID)"
    fi
    
    # Clean up PID file
    rm -f logs/monitor.pid
else
    echo "⚠️  No PID file found. Attempting to kill by process name..."
    
    if pgrep -f "deployment-monitor.js" > /dev/null; then
        pkill -f "deployment-monitor.js"
        echo "✅ Monitor stopped successfully"
    else
        echo "ℹ️  No monitor process found"
    fi
fi

echo "🏁 Monitor shutdown complete" 