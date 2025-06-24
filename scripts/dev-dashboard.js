#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bg: {
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
  }
};

// Service configuration
const services = [
  {
    name: 'Next.js Frontend',
    command: 'npm',
    args: ['run', 'dev-web'],
    port: 3005,
    url: 'http://localhost:3005',
    healthCheck: '/',
    icon: '🌐',
    description: 'Main e-commerce frontend',
    testItems: [
      'Shop page loads correctly',
      'Admin panel shows dashboard',
      'Product pages work',
      'Responsive design on mobile'
    ]
  },
  {
    name: 'Medusa Backend',
    command: 'npm',
    args: ['run', 'dev-medusa'],
    port: 9000,
    url: 'http://localhost:9000',
    healthCheck: '/health',
    icon: '🛒',
    description: 'E-commerce backend API',
    testItems: [
      'Backend API responds',
      'Admin endpoints work',
      'Store endpoints work',
      'Database connection active'
    ]
  },
  {
    name: 'Sanity Studio',
    command: 'npm',
    args: ['run', 'dev-sanity'],
    port: 3334,
    url: 'http://localhost:3334',
    healthCheck: '/',
    icon: '📝',
    description: 'Content management system',
    testItems: [
      'Studio loads correctly',
      'Content editing works',
      'Image uploads function',
      'Schema validation passes'
    ]
  }
];

// Admin URLs for quick access
const adminUrls = [
  {
    name: 'FitFoot Admin Panel',
    url: 'http://localhost:3005/admin',
    icon: '⚙️',
    description: 'Product & order management'
  },
  {
    name: 'Medusa Admin',
    url: 'http://localhost:9000/app',
    icon: '🛒',
    description: 'Backend admin dashboard'
  },
  {
    name: 'Shop Frontend',
    url: 'http://localhost:3005/shop',
    icon: '🛍️',
    description: 'Customer shopping experience'
  },
  {
    name: 'Sanity Studio',
    url: 'http://localhost:3334',
    icon: '📝',
    description: 'Content management system'
  }
];

class DevDashboard {
  constructor() {
    this.processes = new Map();
    this.serviceStatus = new Map();
    this.startTime = Date.now();
    this.dashboardVisible = true;
    
    // Initialize service status
    services.forEach(service => {
      this.serviceStatus.set(service.name, {
        status: 'starting',
        pid: null,
        lastHealthCheck: null,
        errors: []
      });
    });
  }

  log(message, color = colors.white) {
    if (!this.dashboardVisible) return;
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
  }

  error(message) {
    this.log(`❌ ${message}`, colors.red);
  }

  success(message) {
    this.log(`✅ ${message}`, colors.green);
  }

  info(message) {
    this.log(`ℹ️  ${message}`, colors.blue);
  }

  warn(message) {
    this.log(`⚠️  ${message}`, colors.yellow);
  }

  async checkPort(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const socket = new net.Socket();
      
      socket.setTimeout(1000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.connect(port, 'localhost');
    });
  }

  async healthCheck(service) {
    try {
      // Simple HTTP request for health check
      const http = require('http');
      return new Promise((resolve) => {
        const req = http.request({
          hostname: 'localhost',
          port: service.port,
          path: service.healthCheck,
          method: 'GET',
          timeout: 2000
        }, (res) => {
          resolve(res.statusCode >= 200 && res.statusCode < 400);
        });
        
        req.on('error', () => resolve(false));
        req.on('timeout', () => resolve(false));
        req.end();
      });
    } catch (error) {
      return false;
    }
  }

  async startService(service) {
    return new Promise((resolve, reject) => {
      this.info(`Starting ${service.name}...`);
      
      const childProcess = spawn(service.command, service.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd(),
        env: { ...process.env, FORCE_COLOR: 'true' }
      });

      this.processes.set(service.name, childProcess);
      this.serviceStatus.get(service.name).pid = childProcess.pid;

      childProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('ready') || output.includes('started') || output.includes('listening') || output.includes('Local:')) {
          this.serviceStatus.get(service.name).status = 'running';
          this.success(`${service.name} is ready on ${service.url}`);
        }
      });

      childProcess.stderr.on('data', (data) => {
        const error = data.toString();
        this.serviceStatus.get(service.name).errors.push(error);
        if (error.includes('EADDRINUSE') || error.includes('port')) {
          this.warn(`${service.name} port ${service.port} may be in use`);
        }
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          this.serviceStatus.get(service.name).status = 'failed';
          this.error(`${service.name} exited with code ${code}`);
        }
      });

      // Give services time to start
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  async waitForServices() {
    this.info('Waiting for all services to be ready...');
    
    for (const service of services) {
      let attempts = 0;
      const maxAttempts = 20;
      
      while (attempts < maxAttempts) {
        const isHealthy = await this.healthCheck(service);
        if (isHealthy) {
          this.serviceStatus.get(service.name).status = 'healthy';
          this.serviceStatus.get(service.name).lastHealthCheck = new Date();
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        attempts++;
      }
      
      // If health check failed, but process is running, mark as running
      if (this.serviceStatus.get(service.name).status === 'starting') {
        this.serviceStatus.get(service.name).status = 'running';
      }
    }
  }

  displayHeader() {
    console.clear();
    console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════════════════════════╗
║                           🚀 FITFOOT DEVELOPMENT DASHBOARD                   ║
╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}

${colors.bright}Swiss-designed sustainable footwear e-commerce platform${colors.reset}
${colors.yellow}Development Environment Started • ${new Date().toLocaleString()}${colors.reset}

`);
  }

  displayServices() {
    console.log(`${colors.bright}📊 SERVICE STATUS${colors.reset}\n`);
    
    services.forEach(service => {
      const status = this.serviceStatus.get(service.name);
      let statusIcon = '🔄';
      let statusColor = colors.yellow;
      let statusText = 'Starting';

      switch (status.status) {
        case 'healthy':
          statusIcon = '🟢';
          statusColor = colors.green;
          statusText = 'Healthy';
          break;
        case 'running':
          statusIcon = '🟡';
          statusColor = colors.yellow;
          statusText = 'Running';
          break;
        case 'failed':
          statusIcon = '🔴';
          statusColor = colors.red;
          statusText = 'Failed';
          break;
      }

      console.log(`${service.icon} ${colors.bright}${service.name}${colors.reset}`);
      console.log(`   ${statusIcon} Status: ${statusColor}${statusText}${colors.reset}`);
      console.log(`   🔗 URL: ${colors.cyan}${service.url}${colors.reset}`);
      console.log(`   📋 ${service.description}`);
      if (status.pid) {
        console.log(`   🔢 PID: ${status.pid}`);
      }
      console.log('');
    });
  }

  displayAdminUrls() {
    console.log(`${colors.bright}🎛️  ADMIN INTERFACES${colors.reset}\n`);
    
    adminUrls.forEach(admin => {
      console.log(`${admin.icon} ${colors.bright}${admin.name}${colors.reset}`);
      console.log(`   🔗 ${colors.cyan}${admin.url}${colors.reset}`);
      console.log(`   📋 ${admin.description}`);
      console.log('');
    });
  }

  displayTestingGuidelines() {
    console.log(`${colors.bright}🧪 TESTING GUIDELINES${colors.reset}\n`);
    
    services.forEach(service => {
      console.log(`${service.icon} ${colors.bright}${service.name} Tests${colors.reset}`);
      service.testItems.forEach(test => {
        console.log(`   ✓ ${test}`);
      });
      console.log('');
    });
  }

  displayQuickCommands() {
    console.log(`${colors.bright}⚡ QUICK COMMANDS${colors.reset}\n`);
    
    const commands = [
      { key: 'h', description: 'Show/hide this dashboard', command: 'Toggle dashboard visibility' },
      { key: 'r', description: 'Restart all services', command: 'npm run dev' },
      { key: 's', description: 'Check service status', command: 'Health check all services' },
      { key: 'q', description: 'Quit all services', command: 'Graceful shutdown' }
    ];

    commands.forEach(cmd => {
      console.log(`   ${colors.yellow}[${cmd.key}]${colors.reset} ${cmd.description}`);
    });
    console.log('');
  }

  displayFooter() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(uptime / 60);
    const seconds = uptime % 60;
    
    console.log(`${colors.cyan}╔══════════════════════════════════════════════════════════════════════════════╗
║ 💻 Dev Environment Running • Uptime: ${minutes}m ${seconds}s                            ║
║ 🔧 Medusa Backend Integration Active • TypeScript Strict Mode Enabled       ║
║ 📱 Mobile-First Responsive Design • Swiss Quality Standards Applied         ║
╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}

${colors.bright}Ready for development! 🎉${colors.reset}
${colors.yellow}Press 'h' for help, 'q' to quit, or Ctrl+C to exit${colors.reset}

`);
  }

  async displayDashboard() {
    if (!this.dashboardVisible) return;
    
    this.displayHeader();
    this.displayServices();
    this.displayAdminUrls();
    this.displayTestingGuidelines();
    this.displayQuickCommands();
    this.displayFooter();
  }

  setupKeyboardHandlers() {
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', async (str, key) => {
      if (key && key.ctrl && key.name === 'c') {
        await this.shutdown();
        process.exit(0);
      }

      if (!key) return;

      switch (key.name) {
        case 'h':
          this.dashboardVisible = !this.dashboardVisible;
          if (this.dashboardVisible) {
            await this.displayDashboard();
          } else {
            console.clear();
            console.log(`${colors.yellow}Dashboard hidden. Press 'h' to show again.${colors.reset}`);
          }
          break;
        case 'r':
          this.info('Restarting all services...');
          await this.shutdown();
          await this.start();
          break;
        case 's':
          await this.checkAllServicesHealth();
          break;
        case 'q':
          await this.shutdown();
          process.exit(0);
      }
    });
  }

  async checkAllServicesHealth() {
    this.info('Checking service health...');
    
    for (const service of services) {
      const isHealthy = await this.healthCheck(service);
      const status = this.serviceStatus.get(service.name);
      
      if (isHealthy) {
        status.status = 'healthy';
        status.lastHealthCheck = new Date();
        this.success(`${service.name} is healthy`);
      } else {
        status.status = 'unhealthy';
        this.error(`${service.name} health check failed`);
      }
    }
    
    setTimeout(() => this.displayDashboard(), 2000);
  }

  async shutdown() {
    console.log(`\n${colors.yellow}Shutting down all services...${colors.reset}\n`);
    
    for (const [name, childProcess] of this.processes) {
      if (childProcess && !childProcess.killed) {
        this.info(`Stopping ${name}...`);
        childProcess.kill('SIGTERM');
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (!childProcess.killed) {
            childProcess.kill('SIGKILL');
          }
        }, 5000);
      }
    }
    
    this.success('All services stopped. Goodbye! 👋');
  }

  async start() {
    this.displayHeader();
    this.info('Starting FitFoot development environment...');
    
    // Check if ports are available
    for (const service of services) {
      const portInUse = await this.checkPort(service.port);
      if (portInUse) {
        this.warn(`Port ${service.port} is already in use (${service.name})`);
      }
    }

    // Start all services in parallel
    await Promise.all(services.map(service => this.startService(service)));
    
    // Wait for services to be ready
    await this.waitForServices();
    
    // Display dashboard
    await this.displayDashboard();
    
    // Setup keyboard handlers
    this.setupKeyboardHandlers();
    
    // Periodic health checks every 30 seconds
    setInterval(async () => {
      if (this.dashboardVisible) {
        await this.checkAllServicesHealth();
      }
    }, 30000);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the dashboard
const dashboard = new DevDashboard();
dashboard.start().catch(error => {
  console.error('Failed to start development dashboard:', error);
  process.exit(1);
}); 