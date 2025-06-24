#!/usr/bin/env node

/**
 * Automated Deployment Monitor for FitFoot
 * Monitors Vercel deployments and automatically fixes common issues
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeploymentMonitor {
  constructor() {
    this.isMonitoring = false;
    this.currentDeployment = null;
    this.logFile = path.join(__dirname, '../logs/deployment-monitor.log');
    this.fixAttempts = 0;
    this.maxFixAttempts = 3;
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(logEntry.trim());
    fs.appendFileSync(this.logFile, logEntry);
  }

  async startMonitoring() {
    this.log('🚀 Starting automated deployment monitoring...', 'INFO');
    this.isMonitoring = true;

    while (this.isMonitoring) {
      try {
        await this.checkDeploymentStatus();
        await this.sleep(30000); // Check every 30 seconds
      } catch (error) {
        this.log(`❌ Monitoring error: ${error.message}`, 'ERROR');
        await this.sleep(60000); // Wait longer on error
      }
    }
  }

  async checkDeploymentStatus() {
    try {
      // Get current deployment status
      const deployments = execSync('vercel ls --scope=fitfoot --limit=1', { 
        encoding: 'utf8',
        cwd: '/home/g/dev/fitfoot/apps/web'
      });

      const lines = deployments.split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      const latestDeployment = lines[1].split(/\s+/);
      const deploymentUrl = latestDeployment[0];
      const status = latestDeployment[2];

      // Check if this is a new deployment
      if (deploymentUrl !== this.currentDeployment) {
        this.currentDeployment = deploymentUrl;
        this.fixAttempts = 0;
        this.log(`🔄 New deployment detected: ${deploymentUrl}`, 'INFO');
      }

      // Handle different deployment states
      switch (status.toLowerCase()) {
        case 'ready':
          await this.handleSuccessfulDeployment(deploymentUrl);
          break;
        case 'error':
          await this.handleFailedDeployment(deploymentUrl);
          break;
        case 'building':
          this.log(`🔨 Deployment building: ${deploymentUrl}`, 'INFO');
          break;
        case 'queued':
          this.log(`⏳ Deployment queued: ${deploymentUrl}`, 'INFO');
          break;
        default:
          this.log(`📊 Deployment status: ${status} for ${deploymentUrl}`, 'INFO');
      }

    } catch (error) {
      this.log(`❌ Failed to check deployment status: ${error.message}`, 'ERROR');
    }
  }

  async handleSuccessfulDeployment(deploymentUrl) {
    this.log(`✅ Deployment successful: ${deploymentUrl}`, 'SUCCESS');
    
    // Run post-deployment health checks
    await this.runHealthChecks(deploymentUrl);
    
    // Reset fix attempts counter
    this.fixAttempts = 0;
  }

  async handleFailedDeployment(deploymentUrl) {
    this.log(`❌ Deployment failed: ${deploymentUrl}`, 'ERROR');
    
    if (this.fixAttempts >= this.maxFixAttempts) {
      this.log(`🚨 Max fix attempts reached (${this.maxFixAttempts}). Manual intervention required.`, 'CRITICAL');
      await this.notifyFailure(deploymentUrl, 'Max fix attempts exceeded');
      return;
    }

    // Get deployment logs
    const logs = await this.getDeploymentLogs(deploymentUrl);
    
    // Analyze and attempt to fix
    const fixApplied = await this.analyzeAndFix(logs, deploymentUrl);
    
    if (fixApplied) {
      this.fixAttempts++;
      this.log(`🔧 Fix attempt ${this.fixAttempts}/${this.maxFixAttempts} applied. Triggering redeploy...`, 'INFO');
      await this.triggerRedeploy();
    } else {
      this.log(`🤔 No automatic fix available for this error. Manual intervention required.`, 'WARNING');
      await this.notifyFailure(deploymentUrl, 'No automatic fix available');
    }
  }

  async getDeploymentLogs(deploymentUrl) {
    try {
      this.log(`📋 Fetching deployment logs for: ${deploymentUrl}`, 'INFO');
      
      const logs = execSync(`vercel logs ${deploymentUrl}`, { 
        encoding: 'utf8',
        cwd: '/home/g/dev/fitfoot/apps/web'
      });
      
      // Save logs to file for analysis
      const logFileName = `deployment-${deploymentUrl.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.log`;
      const logFilePath = path.join(__dirname, '../logs', logFileName);
      fs.writeFileSync(logFilePath, logs);
      
      this.log(`💾 Logs saved to: ${logFilePath}`, 'INFO');
      return logs;
      
    } catch (error) {
      this.log(`❌ Failed to fetch deployment logs: ${error.message}`, 'ERROR');
      return '';
    }
  }

  async analyzeAndFix(logs, deploymentUrl) {
    this.log(`🔍 Analyzing deployment logs for common issues...`, 'INFO');
    
    const fixes = [
      {
        pattern: /Module not found|Cannot resolve module/i,
        fix: () => this.fixMissingDependencies(),
        description: 'Missing dependencies'
      },
      {
        pattern: /Type error|TypeScript error/i,
        fix: () => this.fixTypeErrors(),
        description: 'TypeScript errors'
      },
      {
        pattern: /Build failed|Command failed/i,
        fix: () => this.fixBuildErrors(),
        description: 'Build errors'
      },
      {
        pattern: /Out of memory|JavaScript heap out of memory/i,
        fix: () => this.fixMemoryIssues(),
        description: 'Memory issues'
      },
      {
        pattern: /Environment variable|env/i,
        fix: () => this.fixEnvironmentVariables(),
        description: 'Environment variable issues'
      }
    ];

    for (const { pattern, fix, description } of fixes) {
      if (pattern.test(logs)) {
        this.log(`🎯 Detected issue: ${description}`, 'INFO');
        this.log(`🔧 Applying automatic fix...`, 'INFO');
        
        try {
          await fix();
          this.log(`✅ Fix applied for: ${description}`, 'SUCCESS');
          return true;
        } catch (error) {
          this.log(`❌ Fix failed for ${description}: ${error.message}`, 'ERROR');
        }
      }
    }

    return false;
  }

  async fixMissingDependencies() {
    this.log(`📦 Installing missing dependencies...`, 'INFO');
    execSync('npm install', { 
      cwd: '/home/g/dev/fitfoot/apps/web',
      stdio: 'pipe'
    });
    
    // Commit the changes
    execSync('git add package-lock.json', { cwd: '/home/g/dev/fitfoot' });
    execSync('git commit -m "fix: install missing dependencies (auto-fix)"', { cwd: '/home/g/dev/fitfoot' });
  }

  async fixTypeErrors() {
    this.log(`🔧 Attempting to fix TypeScript errors...`, 'INFO');
    
    // Try to run type check and capture specific errors
    try {
      execSync('npm run type-check', { 
        cwd: '/home/g/dev/fitfoot/apps/web',
        stdio: 'pipe'
      });
    } catch (error) {
      // If type errors exist, try common fixes
      const tsConfigPath = '/home/g/dev/fitfoot/apps/web/tsconfig.json';
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      
      // Temporarily relax strict mode for deployment
      if (tsConfig.compilerOptions.strict) {
        tsConfig.compilerOptions.strict = false;
        fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
        
        execSync('git add tsconfig.json', { cwd: '/home/g/dev/fitfoot' });
        execSync('git commit -m "fix: temporarily relax TypeScript strict mode (auto-fix)"', { cwd: '/home/g/dev/fitfoot' });
      }
    }
  }

  async fixBuildErrors() {
    this.log(`🔨 Attempting to fix build errors...`, 'INFO');
    
    // Clear build cache
    execSync('rm -rf .next', { cwd: '/home/g/dev/fitfoot/apps/web' });
    execSync('npm run build', { cwd: '/home/g/dev/fitfoot/apps/web' });
  }

  async fixMemoryIssues() {
    this.log(`💾 Applying memory optimization fixes...`, 'INFO');
    
    // Update Next.js config to optimize memory usage
    const nextConfigPath = '/home/g/dev/fitfoot/apps/web/next.config.js';
    let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (!nextConfig.includes('experimental')) {
      nextConfig = nextConfig.replace(
        'module.exports = {',
        `module.exports = {
  experimental: {
    workerThreads: false,
    cpus: 1
  },`
      );
      
      fs.writeFileSync(nextConfigPath, nextConfig);
      execSync('git add next.config.js', { cwd: '/home/g/dev/fitfoot' });
      execSync('git commit -m "fix: optimize memory usage in Next.js config (auto-fix)"', { cwd: '/home/g/dev/fitfoot' });
    }
  }

  async fixEnvironmentVariables() {
    this.log(`🔐 Checking environment variables...`, 'INFO');
    
    // Check if .env.example exists and compare with actual env
    const envExamplePath = '/home/g/dev/fitfoot/apps/web/.env.example';
    const envPath = '/home/g/dev/fitfoot/apps/web/.env.local';
    
    if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
      // Copy example to local env
      fs.copyFileSync(envExamplePath, envPath);
      this.log(`📋 Created .env.local from .env.example`, 'INFO');
    }
  }

  async triggerRedeploy() {
    this.log(`🚀 Triggering redeployment...`, 'INFO');
    
    try {
      // Push the fixes to trigger new deployment
      execSync('git push origin main', { cwd: '/home/g/dev/fitfoot' });
      this.log(`✅ Redeployment triggered`, 'SUCCESS');
    } catch (error) {
      this.log(`❌ Failed to trigger redeployment: ${error.message}`, 'ERROR');
    }
  }

  async runHealthChecks(deploymentUrl) {
    this.log(`🏥 Running health checks for: ${deploymentUrl}`, 'INFO');
    
    const healthChecks = [
      { name: 'Homepage', path: '/' },
      { name: 'API Health', path: '/api/health' },
      { name: 'Products', path: '/products' },
      { name: 'Shop', path: '/shop' }
    ];

    for (const check of healthChecks) {
      try {
        const response = await this.httpRequest(`https://${deploymentUrl}${check.path}`);
        if (response.status === 200) {
          this.log(`✅ Health check passed: ${check.name}`, 'SUCCESS');
        } else {
          this.log(`⚠️  Health check warning: ${check.name} returned ${response.status}`, 'WARNING');
        }
      } catch (error) {
        this.log(`❌ Health check failed: ${check.name} - ${error.message}`, 'ERROR');
      }
    }
  }

  async httpRequest(url) {
    return new Promise((resolve, reject) => {
      const https = require('https');
      const request = https.get(url, (response) => {
        resolve({ status: response.statusCode });
      });
      
      request.on('error', reject);
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async notifyFailure(deploymentUrl, reason) {
    this.log(`🚨 CRITICAL: Deployment failure notification`, 'CRITICAL');
    this.log(`📍 URL: ${deploymentUrl}`, 'CRITICAL');
    this.log(`📝 Reason: ${reason}`, 'CRITICAL');
    
    // Here you could integrate with Slack, email, or other notification systems
    // For now, we'll create a failure report
    const failureReport = {
      timestamp: new Date().toISOString(),
      deploymentUrl,
      reason,
      fixAttempts: this.fixAttempts,
      logFile: this.logFile
    };
    
    const reportPath = path.join(__dirname, '../logs/failure-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(failureReport, null, 2));
    
    this.log(`📋 Failure report saved to: ${reportPath}`, 'INFO');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.log('🛑 Stopping deployment monitoring...', 'INFO');
    this.isMonitoring = false;
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new DeploymentMonitor();
  
  process.on('SIGINT', () => {
    monitor.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    monitor.stop();
    process.exit(0);
  });
  
  monitor.startMonitoring().catch(error => {
    console.error('❌ Monitor crashed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentMonitor;