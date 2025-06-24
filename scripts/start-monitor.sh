#!/bin/bash

# FitFoot Deployment Monitor Startup Script
# This script starts the automated deployment monitoring service

set -e

echo "🚀 Starting FitFoot Deployment Monitor..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if monitor is already running
if pgrep -f "deployment-monitor.js" > /dev/null; then
    echo "⚠️  Monitor is already running. Stopping existing process..."
    pkill -f "deployment-monitor.js"
    sleep 2
fi

# Start the monitor in the background
echo "🔄 Starting deployment monitor..."
nohup node scripts/deployment-monitor.js > logs/monitor-output.log 2>&1 &

# Get the process ID
MONITOR_PID=$!
echo $MONITOR_PID > logs/monitor.pid

echo "✅ Deployment monitor started with PID: $MONITOR_PID"
echo "📋 Logs: logs/deployment-monitor.log"
echo "📊 Output: logs/monitor-output.log"
echo ""
echo "To stop the monitor, run: ./scripts/stop-monitor.sh"
echo "To check status, run: ./scripts/monitor-status.sh"

# Wait a moment to ensure it started successfully
sleep 3

if ps -p $MONITOR_PID > /dev/null; then
    echo "🎉 Monitor is running successfully!"
else
    echo "❌ Monitor failed to start. Check logs/monitor-output.log for details."
    exit 1
fi 