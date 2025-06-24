#!/bin/bash

# Check FitFoot Deployment Monitor Status

echo "📊 FitFoot Deployment Monitor Status"
echo "===================================="

# Check if monitor is running
if pgrep -f "deployment-monitor.js" > /dev/null; then
    PID=$(pgrep -f "deployment-monitor.js")
    echo "✅ Status: RUNNING (PID: $PID)"
    
    # Show process details
    echo "📋 Process Details:"
    ps -p $PID -o pid,ppid,cmd,etime,pcpu,pmem
    
else
    echo "❌ Status: NOT RUNNING"
fi

echo ""

# Check log files
if [ -f "logs/deployment-monitor.log" ]; then
    echo "📋 Recent Log Entries (last 10 lines):"
    echo "-------------------------------------"
    tail -10 logs/deployment-monitor.log
else
    echo "⚠️  No log file found"
fi

echo ""

# Check if there are any failure reports
if [ -f "logs/failure-report.json" ]; then
    echo "🚨 Latest Failure Report:"
    echo "------------------------"
    cat logs/failure-report.json | jq '.' 2>/dev/null || cat logs/failure-report.json
else
    echo "✅ No failure reports found"
fi

echo ""
echo "📁 Log Files:"
echo "-------------"
ls -la logs/ 2>/dev/null || echo "No logs directory found" 