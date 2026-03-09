# FitFoot Deployment Commands Reference

**Created**: 2025-06-24  
**Last Modified**: 2025-06-24  
**Last Modified Summary**: Quick reference for all deployment commands

## 🚀 Primary Deployment

### One-Button Deploy
```bash
./w
```
**What it does**: Complete deployment workflow with version control, monitoring, and automated fixes.

## 🤖 Monitor Management

### Check Monitor Status
```bash
npm run monitor:status
```

### Start Monitor
```bash
npm run monitor:start
# OR
./scripts/start-monitor.sh
```

### Stop Monitor
```bash
npm run monitor:stop
# OR
./scripts/stop-monitor.sh
```

### View Live Logs
```bash
npm run monitor:logs
# OR
tail -f logs/deployment-monitor.log
```

### Ensure Always Running
```bash
./scripts/ensure-monitor-running.sh
```

## 🔧 Maintenance Commands

### Auto-Fix Linting Issues
```bash
./scripts/auto-fix-linting.sh
```

### Manual Build Test
```bash
cd apps/web
npm run build
```

### Check Vercel Status
```bash
cd apps/web
vercel ls fitfoot --scope orangecat
```

### Check Deployment Health
```bash
npm run deployment:check
```

## 🚨 Emergency Commands

### Force Monitor Restart
```bash
./scripts/stop-monitor.sh
sleep 5
./scripts/start-monitor.sh
```

### Check All Services
```bash
./scripts/check-services.sh
```

### Manual Vercel Deploy (Emergency Only)
```bash
cd apps/web
vercel --prod --scope orangecat
```

## 📊 Status Commands

### Git Status
```bash
git status
git log --oneline -5
```

### Process Status
```bash
ps aux | grep deployment-monitor
```

### Log Files
```bash
ls -la logs/
```

---

**Primary Command**: Always use `./w` for deployments. Other commands are for monitoring and maintenance only. 