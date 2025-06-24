# FitFoot Development Scripts

**Created:** 2024-12-19  
**Last Modified:** 2024-12-19  
**Last Modified Summary:** Added development dashboard and alias setup scripts

## Overview

This directory contains development scripts to streamline the FitFoot development workflow.

## 🚀 Quick Setup

### Option 1: One-time Setup (Recommended)
```bash
# Setup the 'd' command alias
npm run setup-dev

# Reload your shell
source ~/.bashrc  # or source ~/.zshrc

# Now you can use 'd' from anywhere in the project
d
```

### Option 2: Direct Usage
```bash
# Run the dashboard directly
npm run dev-dashboard

# Or run the script directly
node scripts/dev-dashboard.js
```

## 📝 Scripts

### `dev-dashboard.js`
**The Ultimate Development Experience**

A comprehensive development dashboard that:
- Starts all services (Next.js, Medusa, Sanity) in parallel
- Provides real-time health monitoring
- Shows interactive dashboard with service status
- Includes testing guidelines and quick links
- Offers keyboard shortcuts for management

**Features:**
```
🌐 Next.js Frontend    → http://localhost:3005
🛒 Medusa Backend     → http://localhost:9000  
📝 Sanity Studio     → http://localhost:3334
⚙️ Admin Panel       → http://localhost:3005/admin
🛍️ Shop Frontend     → http://localhost:3005/shop
```

**Interactive Commands:**
- `[h]` - Show/hide dashboard
- `[r]` - Restart all services
- `[s]` - Check service status
- `[l]` - View service logs
- `[q]` - Quit all services
- `[Ctrl+C]` - Emergency exit

### `setup-dev-alias.sh`
**One-time Setup Script**

Automatically detects your shell and adds the `d` alias:
- **Bash**: Adds to `~/.bashrc`
- **Zsh**: Adds to `~/.zshrc`
- **Fish**: Creates function in `~/.config/fish/functions/`

## 🎛️ Dashboard Preview

When you run `d`, you'll see:

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🚀 FITFOOT DEVELOPMENT DASHBOARD                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 SERVICE STATUS

🌐 Next.js Frontend
   🟢 Status: Healthy
   🔗 URL: http://localhost:3005
   📋 Main e-commerce frontend

🛒 Medusa Backend  
   🟢 Status: Healthy
   🔗 URL: http://localhost:9000
   📋 E-commerce backend API

📝 Sanity Studio
   🟢 Status: Healthy
   🔗 URL: http://localhost:3334
   📋 Content management system

🎛️ ADMIN INTERFACES

⚙️ FitFoot Admin Panel
   🔗 http://localhost:3005/admin
   📋 Product & order management

🔧 Medusa Admin
   🔗 http://localhost:9000/app
   📋 Medusa backend admin

🧪 TESTING GUIDELINES

🌐 Next.js Frontend Tests
   ✓ Shop page loads with Medusa products
   ✓ Admin panel shows live dashboard
   ✓ Cart functionality works
   ✓ Responsive design on mobile

🛒 Medusa Backend Tests
   ✓ Health endpoint responds
   ✓ Products API returns data
   ✓ Admin login works
   ✓ Database connection stable

📝 Sanity Studio Tests
   ✓ Studio loads correctly
   ✓ Content editing works
   ✓ Image uploads function
   ✓ Schema validation passes
```

## 🔧 Technical Details

### Service Configuration
Each service is configured with:
- **Health Check Endpoints**: Automatic monitoring
- **Port Detection**: Conflict detection and warnings
- **Process Management**: Graceful startup and shutdown
- **Error Handling**: Comprehensive error reporting

### Health Monitoring
- **Periodic Checks**: Every 30 seconds
- **Visual Status**: Color-coded indicators
- **Error Tracking**: Detailed error logging
- **Recovery Actions**: Automatic restart options

### Process Management
- **Parallel Startup**: All services start simultaneously
- **Graceful Shutdown**: SIGTERM followed by SIGKILL
- **PID Tracking**: Process monitoring and management
- **Log Aggregation**: Centralized logging display

## 🎯 Usage Examples

### Start Development Environment
```bash
# Setup once
npm run setup-dev
source ~/.bashrc

# Use daily
d
```

### Check Service Health
```bash
# While dashboard is running
press 's'  # Check health of all services
```

### Restart All Services
```bash
# While dashboard is running  
press 'r'  # Restart all services
```

### Quick Development Links
- **Shop**: [localhost:3005/shop](http://localhost:3005/shop)
- **Admin**: [localhost:3005/admin](http://localhost:3005/admin)
- **API**: [localhost:9000/health](http://localhost:9000/health)
- **Medusa Admin**: [localhost:9000/app](http://localhost:9000/app)
- **Sanity**: [localhost:3334](http://localhost:3334)

## 🐛 Troubleshooting

### Common Issues

**"Command 'd' not found"**
```bash
# Re-run setup
npm run setup-dev
source ~/.bashrc
```

**"Port already in use"**
```bash
# Check what's using the port
lsof -i :3005
lsof -i :9000
lsof -i :3334

# Kill processes if needed
kill -9 <PID>
```

**"Service health check failed"**
```bash
# Check individual services
npm run dev-web
npm run dev-medusa
npm run dev-sanity
```

**"Node.js not found"**
```bash
# Install Node.js (version 20+)
# Visit https://nodejs.org
```

### Manual Service Management
```bash
# Start individual services
npm run dev-web      # Frontend only
npm run dev-medusa   # Backend only
npm run dev-sanity   # CMS only

# Traditional start all
npm run dev          # All services via turbo
```

## 📊 Performance Tips

### Optimization
- **SSD Storage**: Faster file watching and rebuilds
- **Sufficient RAM**: 8GB+ recommended for all services
- **Node.js Version**: Use Node.js 20+ for best performance

### Resource Monitoring
- **CPU Usage**: Monitor during development
- **Memory Usage**: Watch for memory leaks
- **Disk I/O**: Use SSD for better performance

## 🔄 Updates

To update the development scripts:
```bash
# Pull latest changes
git pull origin main

# Re-run setup if needed
npm run setup-dev
```

---

## Document History

| Date | Version | Changes | Author |
|------|---------|---------|---------|
| 2024-12-19 | 1.0 | Initial development scripts | System |

---

*These scripts are designed to provide the best possible development experience for FitFoot contributors.* 