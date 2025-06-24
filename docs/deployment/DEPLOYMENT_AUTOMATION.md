# FitFoot Deployment Automation Guide

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Created comprehensive deployment automation with monitoring and repetitive task management

---

## 🚀 **Deployment Automation Overview**

This guide covers automated deployment processes, monitoring setup, and repetitive task automation for FitFoot production environments.

## 🎯 **Deployment Strategies**

### **Strategy 1: Zero-Downtime Deployment (Recommended)**
```bash
# Automated deployment with health checks
./scripts/deploy-production.sh --strategy=zero-downtime
```

### **Strategy 2: Blue-Green Deployment**
```bash
# Deploy to staging, then switch traffic
./scripts/deploy-production.sh --strategy=blue-green
```

### **Strategy 3: Rolling Deployment**
```bash
# Gradual rollout with monitoring
./scripts/deploy-production.sh --strategy=rolling
```

## 🔧 **Automated Deployment Scripts**

### **Production Deployment Script**
```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "🚀 Starting FitFoot Production Deployment"

# Environment validation
source scripts/validate-environment.sh

# Pre-deployment checks
echo "📋 Running pre-deployment checks..."
npm run test:production
npm run lint:production
npm run security:scan

# Database migration (if needed)
echo "🗄️ Running database migrations..."
npm run db:migrate:production

# Build applications
echo "🏗️ Building applications..."
npm run build:web
npm run build:medusa

# Deploy to production
echo "🌐 Deploying to production..."
case "$1" in
  --strategy=zero-downtime)
    source scripts/deploy-zero-downtime.sh
    ;;
  --strategy=blue-green)
    source scripts/deploy-blue-green.sh
    ;;
  --strategy=rolling)
    source scripts/deploy-rolling.sh
    ;;
  *)
    echo "Using default zero-downtime deployment"
    source scripts/deploy-zero-downtime.sh
    ;;
esac

# Post-deployment verification
echo "✅ Running post-deployment verification..."
source scripts/verify-deployment.sh

# Update monitoring
echo "📊 Updating monitoring dashboards..."
source scripts/update-monitoring.sh

echo "🎉 Deployment completed successfully!"
```

### **Zero-Downtime Deployment**
```bash
#!/bin/bash
# scripts/deploy-zero-downtime.sh

echo "🔄 Executing zero-downtime deployment..."

# Health check endpoint
HEALTH_URL="https://api.fitfoot.ch/health"

# Deploy new version alongside current
docker-compose -f docker-compose.prod.yml up -d --scale web=2 --scale api=2

# Wait for new instances to be healthy
echo "⏳ Waiting for new instances to be healthy..."
for i in {1..30}; do
  if curl -f $HEALTH_URL > /dev/null 2>&1; then
    echo "✅ New instances are healthy"
    break
  fi
  echo "⏳ Waiting... ($i/30)"
  sleep 10
done

# Remove old instances
echo "🔄 Removing old instances..."
docker-compose -f docker-compose.prod.yml up -d --scale web=1 --scale api=1

# Final health check
curl -f $HEALTH_URL || {
  echo "❌ Deployment failed - rolling back"
  source scripts/rollback-deployment.sh
  exit 1
}

echo "✅ Zero-downtime deployment completed"
```

## 📊 **Monitoring Setup**

### **Automated Monitoring Configuration**
```bash
#!/bin/bash
# scripts/setup-monitoring.sh

echo "📊 Setting up production monitoring..."

# Sentry configuration
export SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
export SENTRY_ENVIRONMENT="production"

# Uptime monitoring
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -d "api_key=$UPTIMEROBOT_API_KEY" \
  -d "format=json" \
  -d "type=1" \
  -d "url=https://fitfoot.ch" \
  -d "friendly_name=FitFoot Main Site"

curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -d "api_key=$UPTIMEROBOT_API_KEY" \
  -d "format=json" \
  -d "type=1" \
  -d "url=https://api.fitfoot.ch/health" \
  -d "friendly_name=FitFoot API Health"

# Performance monitoring
echo "🚀 Configuring performance monitoring..."
npm run setup:performance-monitoring

# Log aggregation
echo "📝 Setting up log aggregation..."
npm run setup:log-aggregation

echo "✅ Monitoring setup completed"
```

### **Health Check Automation**
```bash
#!/bin/bash
# scripts/health-check-automation.sh

# Comprehensive health checks
check_frontend() {
  echo "🌐 Checking frontend health..."
  curl -f https://fitfoot.ch > /dev/null 2>&1
}

check_api() {
  echo "🛒 Checking API health..."
  curl -f https://api.fitfoot.ch/health > /dev/null 2>&1
}

check_database() {
  echo "🗄️ Checking database health..."
  npm run db:health-check
}

check_cms() {
  echo "📝 Checking CMS health..."
  curl -f https://fitfoot.sanity.studio > /dev/null 2>&1
}

# Run all checks
run_health_checks() {
  local failed=0
  
  check_frontend || ((failed++))
  check_api || ((failed++))
  check_database || ((failed++))
  check_cms || ((failed++))
  
  if [ $failed -eq 0 ]; then
    echo "✅ All systems healthy"
    return 0
  else
    echo "❌ $failed systems unhealthy"
    return 1
  fi
}

# Automated recovery
attempt_recovery() {
  echo "🔧 Attempting automated recovery..."
  
  # Restart services
  docker-compose restart
  
  # Clear cache
  npm run cache:clear
  
  # Verify recovery
  sleep 30
  run_health_checks
}

# Main execution
if ! run_health_checks; then
  echo "🚨 Health check failed - attempting recovery"
  attempt_recovery || {
    echo "🚨 Recovery failed - alerting team"
    source scripts/alert-team.sh
  }
fi
```

## 🔄 **Repetitive Task Automation**

### **Daily Maintenance Tasks**
```bash
#!/bin/bash
# scripts/daily-maintenance.sh

echo "🧹 Running daily maintenance tasks..."

# Database maintenance
echo "🗄️ Database maintenance..."
npm run db:vacuum
npm run db:analyze
npm run db:backup

# Log rotation
echo "📝 Log rotation..."
find /var/log/fitfoot -name "*.log" -mtime +7 -delete
docker system prune -f

# Performance optimization
echo "⚡ Performance optimization..."
npm run cache:warm
npm run images:optimize

# Security updates
echo "🔒 Security updates..."
npm audit fix --production
npm run security:scan

# Monitoring data cleanup
echo "📊 Monitoring cleanup..."
npm run monitoring:cleanup-old-data

echo "✅ Daily maintenance completed"
```

### **Weekly Tasks**
```bash
#!/bin/bash
# scripts/weekly-maintenance.sh

echo "📅 Running weekly maintenance tasks..."

# Full database backup
echo "💾 Full database backup..."
npm run db:backup:full

# Performance analysis
echo "📈 Performance analysis..."
npm run analytics:weekly-report

# Dependency updates
echo "📦 Dependency updates..."
npm run deps:check-updates
npm run deps:security-audit

# SSL certificate check
echo "🔒 SSL certificate check..."
npm run ssl:check-expiry

# Load testing
echo "🧪 Load testing..."
npm run test:load

echo "✅ Weekly maintenance completed"
```

### **Monthly Tasks**
```bash
#!/bin/bash
# scripts/monthly-maintenance.sh

echo "📆 Running monthly maintenance tasks..."

# Comprehensive backup
echo "💾 Comprehensive backup..."
npm run backup:full-system

# Performance review
echo "📊 Performance review..."
npm run analytics:monthly-report

# Security audit
echo "🔒 Security audit..."
npm run security:full-audit

# Cost optimization
echo "💰 Cost optimization..."
npm run cost:analyze
npm run cost:optimize

# Documentation update
echo "📚 Documentation update..."
npm run docs:update-status
npm run docs:generate-api

echo "✅ Monthly maintenance completed"
```

## 🚨 **Automated Alerting**

### **Alert Configuration**
```bash
#!/bin/bash
# scripts/setup-alerts.sh

echo "🚨 Setting up automated alerts..."

# Slack webhook for critical alerts
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Email configuration
ALERT_EMAIL="alerts@fitfoot.ch"

# Alert thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=2000

# Create alert rules
cat > monitoring/alert-rules.yml << EOF
groups:
  - name: fitfoot.rules
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage > $CPU_THRESHOLD
        for: 5m
        annotations:
          summary: "High CPU usage detected"
          
      - alert: HighMemoryUsage
        expr: memory_usage > $MEMORY_THRESHOLD
        for: 5m
        annotations:
          summary: "High memory usage detected"
          
      - alert: HighDiskUsage
        expr: disk_usage > $DISK_THRESHOLD
        for: 2m
        annotations:
          summary: "High disk usage detected"
          
      - alert: SlowResponseTime
        expr: response_time > $RESPONSE_TIME_THRESHOLD
        for: 3m
        annotations:
          summary: "Slow response time detected"
EOF

echo "✅ Alert setup completed"
```

### **Alert Handlers**
```bash
#!/bin/bash
# scripts/alert-team.sh

send_slack_alert() {
  local message="$1"
  local severity="$2"
  
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚨 FitFoot Alert [$severity]: $message\"}" \
    $SLACK_WEBHOOK
}

send_email_alert() {
  local message="$1"
  local severity="$2"
  
  echo "$message" | mail -s "FitFoot Alert [$severity]" $ALERT_EMAIL
}

# Usage examples
send_slack_alert "API response time > 2s" "WARNING"
send_email_alert "Database connection failed" "CRITICAL"
```

## 📈 **Performance Monitoring Automation**

### **Automated Performance Testing**
```bash
#!/bin/bash
# scripts/performance-testing.sh

echo "🚀 Running automated performance tests..."

# Load testing with k6
k6 run --vus 10 --duration 30s performance-tests/load-test.js

# Lighthouse CI for web vitals
npx lhci autorun

# API performance testing
npm run test:api-performance

# Database performance
npm run test:db-performance

# Generate performance report
npm run report:performance

echo "✅ Performance testing completed"
```

### **Core Web Vitals Monitoring**
```bash
#!/bin/bash
# scripts/monitor-web-vitals.sh

echo "📊 Monitoring Core Web Vitals..."

# Automated Lighthouse runs
lighthouse https://fitfoot.ch \
  --chrome-flags="--headless" \
  --output=json \
  --output-path=./reports/lighthouse-$(date +%Y%m%d).json

# Extract key metrics
node scripts/extract-web-vitals.js

# Update monitoring dashboard
npm run dashboard:update-web-vitals

echo "✅ Web vitals monitoring completed"
```

## 🔄 **Continuous Integration/Deployment**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Build applications
        run: npm run build
        
      - name: Deploy to production
        run: ./scripts/deploy-production.sh --strategy=zero-downtime
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          
      - name: Run post-deployment tests
        run: npm run test:production
        
      - name: Notify team
        if: failure()
        run: ./scripts/alert-team.sh "Deployment failed" "CRITICAL"
```

## 🔧 **Environment Management**

### **Environment Synchronization**
```bash
#!/bin/bash
# scripts/sync-environments.sh

echo "🔄 Synchronizing environments..."

# Sync staging with production data (sanitized)
npm run db:sync-staging

# Update environment configurations
npm run env:update-staging
npm run env:update-development

# Deploy to staging
npm run deploy:staging

# Run integration tests
npm run test:integration:staging

echo "✅ Environment synchronization completed"
```

## 📚 **Runbook Integration**

### **Automated Runbook Execution**
```bash
#!/bin/bash
# scripts/execute-runbook.sh

RUNBOOK="$1"

case "$RUNBOOK" in
  "high-traffic")
    echo "📈 Executing high-traffic runbook..."
    source runbooks/high-traffic.sh
    ;;
  "database-issue")
    echo "🗄️ Executing database issue runbook..."
    source runbooks/database-issue.sh
    ;;
  "security-incident")
    echo "🔒 Executing security incident runbook..."
    source runbooks/security-incident.sh
    ;;
  *)
    echo "❌ Unknown runbook: $RUNBOOK"
    exit 1
    ;;
esac
```

## 🎯 **Deployment Checklist Automation**

### **Pre-Deployment Checklist**
```bash
#!/bin/bash
# scripts/pre-deployment-checklist.sh

echo "📋 Running pre-deployment checklist..."

checklist=(
  "npm run test:all"
  "npm run lint:all"
  "npm run security:scan"
  "npm run build:production"
  "npm run db:migration:dry-run"
  "npm run env:validate"
)

failed=0
for check in "${checklist[@]}"; do
  echo "⏳ Running: $check"
  if $check; then
    echo "✅ Passed: $check"
  else
    echo "❌ Failed: $check"
    ((failed++))
  fi
done

if [ $failed -eq 0 ]; then
  echo "✅ All pre-deployment checks passed"
  exit 0
else
  echo "❌ $failed checks failed - deployment blocked"
  exit 1
fi
```

## 📊 **Monitoring Dashboard Setup**

### **Automated Dashboard Configuration**
```bash
#!/bin/bash
# scripts/setup-dashboard.sh

echo "📊 Setting up monitoring dashboards..."

# Grafana dashboard import
curl -X POST \
  http://admin:admin@grafana.fitfoot.ch/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @monitoring/dashboards/fitfoot-overview.json

# Custom metrics setup
npm run metrics:setup

# Alert rules import
npm run alerts:import

echo "✅ Dashboard setup completed"
```

---

## 🎯 **Quick Reference**

### **Daily Commands**
```bash
# Health check
./scripts/health-check-automation.sh

# Performance check
./scripts/performance-testing.sh

# Maintenance
./scripts/daily-maintenance.sh
```

### **Deployment Commands**
```bash
# Production deployment
./scripts/deploy-production.sh --strategy=zero-downtime

# Rollback if needed
./scripts/rollback-deployment.sh

# Environment sync
./scripts/sync-environments.sh
```

### **Emergency Commands**
```bash
# Execute runbook
./scripts/execute-runbook.sh security-incident

# Alert team
./scripts/alert-team.sh "Emergency situation" "CRITICAL"

# System recovery
./scripts/system-recovery.sh
```

---

**💡 This automation framework ensures reliable, monitored, and maintainable deployments with minimal manual intervention while providing comprehensive observability into your production systems.** 