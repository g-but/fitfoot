# FitFoot Production Monitoring Guide

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Created comprehensive production monitoring and observability guide

---

## 📊 **Monitoring Overview**

This guide covers comprehensive monitoring, observability, and alerting for FitFoot production environments.

## 🎯 **Monitoring Stack**

### **Core Components**
- **Sentry**: Error tracking and performance monitoring
- **Uptime Robot**: Uptime and response time monitoring
- **Grafana**: Metrics visualization and dashboards
- **Prometheus**: Metrics collection and alerting
- **LogTail**: Log aggregation and analysis

### **Custom Monitoring**
- **Health Check API**: Internal service monitoring
- **Business Metrics**: E-commerce specific KPIs
- **Performance Tracking**: Core Web Vitals and API performance

## 🚨 **Alert Configuration**

### **Critical Alerts (Immediate Response)**
```yaml
# alerts/critical.yml
groups:
  - name: critical
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          
      - alert: DatabaseConnectionFailed
        expr: db_connections_failed > 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection failures detected"
          
      - alert: HighErrorRate
        expr: error_rate > 5
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "Error rate above 5% for 3 minutes"
```

### **Warning Alerts (Monitor Closely)**
```yaml
# alerts/warning.yml
groups:
  - name: warning
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU usage above 80% for 5 minutes"
          
      - alert: SlowResponseTime
        expr: response_time_p95 > 2000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile response time above 2s"
          
      - alert: LowDiskSpace
        expr: disk_free_percent < 20
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space below 20%"
```

## 📈 **Key Performance Indicators (KPIs)**

### **Technical KPIs**
```javascript
// monitoring/kpis.js
const technicalKPIs = {
  // Availability
  uptime: {
    target: 99.9,
    measurement: 'percentage',
    alert_threshold: 99.5
  },
  
  // Performance
  response_time_p95: {
    target: 1000, // ms
    measurement: 'milliseconds',
    alert_threshold: 2000
  },
  
  // Error Rate
  error_rate: {
    target: 0.1, // %
    measurement: 'percentage',
    alert_threshold: 1.0
  },
  
  // Database
  db_query_time_p95: {
    target: 100, // ms
    measurement: 'milliseconds',
    alert_threshold: 500
  }
}
```

### **Business KPIs**
```javascript
// monitoring/business-kpis.js
const businessKPIs = {
  // E-commerce Metrics
  conversion_rate: {
    target: 2.5, // %
    measurement: 'percentage',
    tracking: 'daily'
  },
  
  // Revenue Metrics
  revenue_per_visitor: {
    target: 15, // CHF
    measurement: 'currency',
    tracking: 'daily'
  },
  
  // Cart Metrics
  cart_abandonment_rate: {
    target: 65, // %
    measurement: 'percentage',
    tracking: 'daily'
  },
  
  // Customer Metrics
  customer_satisfaction: {
    target: 4.5, // out of 5
    measurement: 'rating',
    tracking: 'weekly'
  }
}
```

## 🔍 **Monitoring Dashboards**

### **System Overview Dashboard**
```json
{
  "dashboard": {
    "title": "FitFoot System Overview",
    "panels": [
      {
        "title": "Service Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"fitfoot-web\"}",
            "legendFormat": "Frontend"
          },
          {
            "expr": "up{job=\"fitfoot-api\"}",
            "legendFormat": "API"
          },
          {
            "expr": "up{job=\"fitfoot-db\"}",
            "legendFormat": "Database"
          }
        ]
      },
      {
        "title": "Response Times",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, http_request_duration_seconds_bucket)",
            "legendFormat": "50th percentile"
          }
        ]
      }
    ]
  }
}
```

### **Business Metrics Dashboard**
```json
{
  "dashboard": {
    "title": "FitFoot Business Metrics",
    "panels": [
      {
        "title": "Daily Revenue",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(revenue_total)",
            "legendFormat": "Total Revenue"
          }
        ]
      },
      {
        "title": "Conversion Funnel",
        "type": "bargauge",
        "targets": [
          {
            "expr": "visitors_total",
            "legendFormat": "Visitors"
          },
          {
            "expr": "cart_additions_total",
            "legendFormat": "Cart Additions"
          },
          {
            "expr": "checkouts_total",
            "legendFormat": "Checkouts"
          },
          {
            "expr": "orders_total",
            "legendFormat": "Orders"
          }
        ]
      }
    ]
  }
}
```

## 🔧 **Health Check Implementation**

### **Comprehensive Health Check API**
```typescript
// apps/web/src/app/api/health/route.ts
export async function GET() {
  const healthChecks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.APP_VERSION || 'unknown',
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      external_apis: await checkExternalAPIs(),
      disk_space: await checkDiskSpace(),
      memory: await checkMemory()
    }
  }

  const overallStatus = Object.values(healthChecks.checks)
    .every(check => check.status === 'healthy') ? 'healthy' : 'unhealthy'

  return Response.json({
    ...healthChecks,
    status: overallStatus
  }, {
    status: overallStatus === 'healthy' ? 200 : 503
  })
}

async function checkDatabase() {
  try {
    // Test database connection
    const result = await db.raw('SELECT 1')
    return {
      status: 'healthy',
      response_time: Date.now() - start,
      details: 'Database connection successful'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      details: 'Database connection failed'
    }
  }
}
```

### **Detailed Health Monitoring**
```bash
#!/bin/bash
# scripts/health-monitor.sh

# Comprehensive health monitoring script
check_all_services() {
  local services=(
    "https://fitfoot.ch/api/health"
    "https://api.fitfoot.ch/health"
    "https://admin.fitfoot.ch/health"
  )
  
  for service in "${services[@]}"; do
    echo "🔍 Checking $service"
    
    response=$(curl -s -w "%{http_code}:%{time_total}" "$service")
    http_code=$(echo "$response" | cut -d: -f1)
    time_total=$(echo "$response" | cut -d: -f2)
    
    if [ "$http_code" -eq 200 ]; then
      echo "✅ $service - Healthy (${time_total}s)"
    else
      echo "❌ $service - Unhealthy (HTTP $http_code)"
      alert_team "$service is unhealthy" "WARNING"
    fi
  done
}

# Run every minute
while true; do
  check_all_services
  sleep 60
done
```

## 📊 **Performance Monitoring**

### **Core Web Vitals Tracking**
```javascript
// apps/web/src/lib/performance-monitoring.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// Track all Core Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### **API Performance Monitoring**
```typescript
// apps/medusa/src/middleware/performance.ts
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    
    // Log performance metrics
    console.log({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      timestamp: new Date().toISOString()
    })
    
    // Send to monitoring
    sendMetric('api_request_duration', duration, {
      method: req.method,
      endpoint: req.route?.path || req.url,
      status: res.statusCode.toString()
    })
  })
  
  next()
}
```

## 🚨 **Incident Response**

### **Automated Incident Detection**
```bash
#!/bin/bash
# scripts/incident-detection.sh

detect_incidents() {
  # Check for high error rates
  error_rate=$(curl -s "http://prometheus:9090/api/v1/query?query=error_rate" | jq '.data.result[0].value[1]')
  
  if (( $(echo "$error_rate > 5" | bc -l) )); then
    create_incident "High Error Rate" "critical" "Error rate: $error_rate%"
  fi
  
  # Check for slow response times
  response_time=$(curl -s "http://prometheus:9090/api/v1/query?query=response_time_p95" | jq '.data.result[0].value[1]')
  
  if (( $(echo "$response_time > 2000" | bc -l) )); then
    create_incident "Slow Response Time" "warning" "P95 response time: ${response_time}ms"
  fi
}

create_incident() {
  local title="$1"
  local severity="$2"
  local description="$3"
  
  # Create incident in incident management system
  curl -X POST "https://api.pagerduty.com/incidents" \
    -H "Authorization: Token token=$PAGERDUTY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"incident\": {
        \"type\": \"incident\",
        \"title\": \"$title\",
        \"service\": {
          \"id\": \"$PAGERDUTY_SERVICE_ID\",
          \"type\": \"service_reference\"
        },
        \"urgency\": \"$severity\",
        \"body\": {
          \"type\": \"incident_body\",
          \"details\": \"$description\"
        }
      }
    }"
}
```

### **Incident Response Runbooks**
```bash
#!/bin/bash
# runbooks/high-error-rate.sh

echo "🚨 Executing High Error Rate Runbook"

# Step 1: Identify error sources
echo "🔍 Identifying error sources..."
curl -s "http://prometheus:9090/api/v1/query?query=errors_by_endpoint" | jq '.data.result'

# Step 2: Check recent deployments
echo "📋 Checking recent deployments..."
git log --oneline -10

# Step 3: Scale up resources if needed
echo "⚡ Scaling up resources..."
kubectl scale deployment fitfoot-web --replicas=5
kubectl scale deployment fitfoot-api --replicas=3

# Step 4: Enable circuit breaker
echo "🔄 Enabling circuit breaker..."
kubectl patch configmap app-config --patch '{"data":{"CIRCUIT_BREAKER_ENABLED":"true"}}'

# Step 5: Monitor recovery
echo "📊 Monitoring recovery..."
for i in {1..10}; do
  error_rate=$(curl -s "http://prometheus:9090/api/v1/query?query=error_rate" | jq '.data.result[0].value[1]')
  echo "Current error rate: $error_rate%"
  
  if (( $(echo "$error_rate < 1" | bc -l) )); then
    echo "✅ Error rate normalized"
    break
  fi
  
  sleep 30
done
```

## 📈 **Business Intelligence Monitoring**

### **E-commerce Metrics Tracking**
```sql
-- monitoring/business-queries.sql

-- Daily revenue tracking
CREATE VIEW daily_revenue AS
SELECT 
  DATE(created_at) as date,
  SUM(total) as revenue,
  COUNT(*) as orders,
  AVG(total) as avg_order_value
FROM orders 
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Conversion funnel
CREATE VIEW conversion_funnel AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as cart_additions,
  COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) as checkouts_started,
  COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders_completed
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Product performance
CREATE VIEW product_performance AS
SELECT 
  p.title,
  p.id,
  COUNT(oi.id) as units_sold,
  SUM(oi.quantity * oi.unit_price) as revenue,
  AVG(r.rating) as avg_rating
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN product_reviews r ON p.id = r.product_id
GROUP BY p.id, p.title
ORDER BY revenue DESC;
```

### **Automated Business Reports**
```bash
#!/bin/bash
# scripts/generate-business-reports.sh

echo "📊 Generating business intelligence reports..."

# Daily report
psql $DATABASE_URL -c "
  SELECT 
    'Daily Revenue: ' || TO_CHAR(SUM(revenue), 'L999,999.99') as metric
  FROM daily_revenue 
  WHERE date = CURRENT_DATE;
" > reports/daily-$(date +%Y%m%d).txt

# Weekly conversion report
psql $DATABASE_URL -c "
  SELECT 
    date,
    sessions,
    cart_additions,
    ROUND((cart_additions::numeric / sessions * 100), 2) as cart_conversion_rate,
    orders_completed,
    ROUND((orders_completed::numeric / sessions * 100), 2) as overall_conversion_rate
  FROM conversion_funnel 
  WHERE date >= CURRENT_DATE - INTERVAL '7 days'
  ORDER BY date;
" > reports/conversion-weekly-$(date +%Y%m%d).txt

# Send reports to team
mail -s "FitFoot Daily Business Report" team@fitfoot.ch < reports/daily-$(date +%Y%m%d).txt
```

## 🔄 **Continuous Monitoring Improvement**

### **Monitoring as Code**
```yaml
# monitoring/monitoring-config.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: monitoring-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "/etc/prometheus/rules/*.yml"
    
    scrape_configs:
      - job_name: 'fitfoot-web'
        static_configs:
          - targets: ['fitfoot-web:3005']
        metrics_path: '/api/metrics'
        
      - job_name: 'fitfoot-api'
        static_configs:
          - targets: ['fitfoot-api:9000']
        metrics_path: '/metrics'
        
      - job_name: 'postgres'
        static_configs:
          - targets: ['postgres-exporter:9187']
```

### **Monitoring Automation Tests**
```bash
#!/bin/bash
# tests/monitoring-tests.sh

echo "🧪 Testing monitoring infrastructure..."

# Test alert rules
promtool check rules monitoring/alerts/*.yml

# Test dashboard configurations
for dashboard in monitoring/dashboards/*.json; do
  echo "🔍 Validating $dashboard"
  jq empty "$dashboard" || {
    echo "❌ Invalid JSON in $dashboard"
    exit 1
  }
done

# Test health check endpoints
curl -f http://localhost:3005/api/health || {
  echo "❌ Frontend health check failed"
  exit 1
}

curl -f http://localhost:9000/health || {
  echo "❌ API health check failed"
  exit 1
}

echo "✅ All monitoring tests passed"
```

---

## 🎯 **Quick Reference**

### **Emergency Commands**
```bash
# Check system status
curl https://fitfoot.ch/api/health | jq

# View current alerts
curl http://prometheus:9090/api/v1/alerts | jq

# Execute incident runbook
./runbooks/high-error-rate.sh
```

### **Daily Monitoring Tasks**
```bash
# Generate business reports
./scripts/generate-business-reports.sh

# Check system health
./scripts/health-monitor.sh

# Review performance metrics
./scripts/performance-review.sh
```

### **Dashboard URLs**
- **System Overview**: http://grafana.fitfoot.ch/d/system-overview
- **Business Metrics**: http://grafana.fitfoot.ch/d/business-metrics
- **Error Tracking**: https://sentry.io/organizations/fitfoot/projects/
- **Uptime Monitoring**: https://uptimerobot.com/dashboard

---

**💡 This monitoring setup provides comprehensive observability into both technical performance and business metrics, enabling proactive issue detection and data-driven decision making.** 