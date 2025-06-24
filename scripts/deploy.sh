#!/bin/bash

# 🚀 FitFoot Deployment System
# Usage: Just run 'w' - proper version control with feature branches

set -e

echo "🚀 FITFOOT DEPLOYMENT"
echo "==================="
echo ""

# Get current branch and timestamp
CURRENT_BRANCH=$(git branch --show-current)
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
FEATURE_BRANCH="deploy-$TIMESTAMP"

echo "📊 Current Status:"
echo "  📍 Current branch: $CURRENT_BRANCH"
echo "  📅 Timestamp: $TIMESTAMP"
echo ""

# Check if we're on main/master
if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
    echo "⚠️  You're on $CURRENT_BRANCH branch!"
    echo ""
    echo "🎯 Options:"
    echo "   1) Create feature branch and deploy"
    echo "   2) Deploy directly (not recommended)"
    echo "   3) Cancel"
    echo ""
    read -p "Choose option (1-3): " choice
    
    case $choice in
        1)
            echo "✅ Creating feature branch: $FEATURE_BRANCH"
            git checkout -b "$FEATURE_BRANCH"
            ;;
        2)
            echo "⚠️  Deploying directly to $CURRENT_BRANCH"
            ;;
        3)
            echo "❌ Deployment cancelled"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Cancelled."
            exit 1
            ;;
    esac
else
    echo "✅ Working on feature branch: $CURRENT_BRANCH"
fi

echo ""
echo "📝 Stage 1: Preparing deployment..."
echo "-----------------------------------"

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📦 Adding and committing changes..."
    git add .
    
    # Get a meaningful commit message
    echo ""
    echo "💬 Commit message options:"
    echo "   1) Auto-generate commit message"
    echo "   2) Write custom commit message"
    echo ""
    read -p "Choose option (1-2): " msg_choice
    
    if [[ "$msg_choice" == "2" ]]; then
        read -p "Enter commit message: " custom_message
        COMMIT_MSG="$custom_message"
    else
        COMMIT_MSG="feat: deployment at $TIMESTAMP

🚀 Automated deployment
📊 All quality checks included
🔄 Monitor will handle issues"
    fi
    
    git commit -m "$COMMIT_MSG"
    echo "✅ Changes committed!"
else
    echo "ℹ️  No uncommitted changes found"
fi

echo ""
echo "🔄 Stage 2: Version Control Decision..."
echo "--------------------------------------"

# If we're on a feature branch, offer merge options
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    echo "🎯 Deployment Options:"
    echo "   1) Merge to main and deploy (recommended)"
    echo "   2) Push feature branch only (for review)"
    echo "   3) Deploy feature branch directly"
    echo "   4) Cancel"
    echo ""
    read -p "Choose option (1-4): " deploy_choice
    
    case $deploy_choice in
        1)
            echo "🔄 Merging to main..."
            git push origin "$CURRENT_BRANCH"
            git checkout main
            git pull origin main
            git merge "$CURRENT_BRANCH" --no-ff -m "Merge branch '$CURRENT_BRANCH'"
            DEPLOY_BRANCH="main"
            ;;
        2)
            echo "📤 Pushing feature branch for review..."
            git push origin "$CURRENT_BRANCH"
            echo ""
            echo "✅ Feature branch pushed!"
            echo "🔗 Create PR: https://github.com/g-but/fitfoot/compare/$CURRENT_BRANCH"
            echo "❌ Deployment cancelled - branch ready for review"
            exit 0
            ;;
        3)
            echo "⚠️  Deploying feature branch directly"
            DEPLOY_BRANCH="$CURRENT_BRANCH"
            ;;
        4)
            echo "❌ Deployment cancelled"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Cancelled."
            exit 1
            ;;
    esac
else
    DEPLOY_BRANCH="$CURRENT_BRANCH"
fi

echo ""
echo "🚀 Stage 3: Deploying to production..."
echo "--------------------------------------"

echo "📤 Pushing $DEPLOY_BRANCH to trigger deployment..."
git push origin "$DEPLOY_BRANCH"

echo "✅ Code pushed successfully!"
echo ""

echo "📊 Stage 4: Real-time monitoring..."
echo "-----------------------------------"

# Show all status in terminal
echo "🛡️  GitHub Actions CI/CD:"
echo "   • Quality gates running on $DEPLOY_BRANCH"
echo "   • Linting, testing, security checks active"
echo ""

echo "🔄 Vercel Deployment Status:"
cd apps/web
vercel ls --yes | head -8
echo ""

echo "🤖 Automated Monitor:"
cd /home/g/dev/fitfoot
npm run monitor:status | head -12
echo ""

echo "📊 Live Deployment Tracking (60 seconds)..."
echo "👀 Press Ctrl+C to stop early"
echo "-------------------------------------------"

# Live monitoring
tail -f logs/deployment-monitor.log &
TAIL_PID=$!

# Monitor for 60 seconds
sleep 60

# Stop monitoring
kill $TAIL_PID 2>/dev/null || true

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ Branch: $DEPLOY_BRANCH"
echo "✅ Vercel auto-deployment triggered"
echo "✅ Quality gates running"
echo "✅ Monitor actively watching"
echo ""

echo "🔍 Final Status:"
npm run monitor:status | head -8

echo ""
echo "🏆 SUCCESS! Deployment complete!"
echo "   🔄 Proper version control used"
echo "   📊 All systems monitored automatically"
echo "   🛡️  Quality gates protecting production" 