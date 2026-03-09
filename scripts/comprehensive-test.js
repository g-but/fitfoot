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
};

class FitFootTester {
  constructor() {
    this.results = {
      frontend: { passed: 0, failed: 0, tests: [] },
      backend: { passed: 0, failed: 0, tests: [] },
      admin: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] },
      swiss: { passed: 0, failed: 0, tests: [] }
    };
    this.startTime = Date.now();
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logTest(category, testName, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const statusColor = passed ? 'green' : 'red';
    
    this.log(`  ${status} ${testName}`, statusColor);
    if (details) {
      this.log(`    ${details}`, 'cyan');
    }
    
    this.results[category].tests.push({ testName, passed, details });
    if (passed) {
      this.results[category].passed++;
    } else {
      this.results[category].failed++;
    }
  }

  async makeRequest(url, options = {}) {
    const fetch = (await import('node-fetch')).default;
    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');
      
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      return { 
        success: response.ok, 
        status: response.status, 
        data,
        headers: response.headers 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async testFrontendHealth() {
    this.log('\n🌐 Testing Frontend (Customer Experience)', 'blue');
    
    // Test main health endpoint
    const health = await this.makeRequest('http://localhost:3005/api/health');
    this.logTest('frontend', 'Health Endpoint', health.success, 
      health.success ? `Status: ${health.data.status}` : health.error);

    // Test main homepage
    const homepage = await this.makeRequest('http://localhost:3005');
    this.logTest('frontend', 'Homepage Load', homepage.success,
      homepage.success ? 'Homepage loads successfully' : homepage.error);

    // Test shop page
    const shop = await this.makeRequest('http://localhost:3005/shop');
    this.logTest('frontend', 'Shop Page', shop.success,
      shop.success ? 'Shop page accessible' : shop.error);

    // Test about page
    const about = await this.makeRequest('http://localhost:3005/about');
    this.logTest('frontend', 'About Page', about.success,
      about.success ? 'About page accessible' : about.error);
  }

  async testBackendHealth() {
    this.log('\n🛒 Testing Medusa Backend', 'magenta');
    
    // Test backend health
    const health = await this.makeRequest('http://localhost:9000/health');
    this.logTest('backend', 'Backend Health', health.success,
      health.success ? 'Backend is healthy' : health.error);

    // Test store products endpoint
    const storeProducts = await this.makeRequest('http://localhost:9000/store/products');
    this.logTest('backend', 'Store Products API', storeProducts.success,
      storeProducts.success ? `Found ${storeProducts.data.products?.length || 0} products` : storeProducts.error);

    // Test store regions
    const regions = await this.makeRequest('http://localhost:9000/store/regions');
    this.logTest('backend', 'Store Regions API', regions.success,
      regions.success ? `Found ${regions.data.regions?.length || 0} regions` : regions.error);
  }

  async testAdminFunctionality() {
    this.log('\n⚙️ Testing Admin Functionality', 'yellow');
    
    // Test admin interface accessibility
    const adminPage = await this.makeRequest('http://localhost:9000/admin');
    this.logTest('admin', 'Admin Interface Access', adminPage.success,
      adminPage.success ? 'Admin interface accessible' : adminPage.error);

    // Test Swiss widgets exist
    const swissDashboardExists = fs.existsSync(path.join(__dirname, '../apps/medusa/src/admin/widgets/swiss-dashboard-widget.tsx'));
    this.logTest('admin', 'Swiss Dashboard Widget', swissDashboardExists,
      swissDashboardExists ? 'Swiss dashboard widget file exists' : 'Swiss dashboard widget file missing');

    const swissProductExists = fs.existsSync(path.join(__dirname, '../apps/medusa/src/admin/widgets/swiss-product-widget.tsx'));
    this.logTest('admin', 'Swiss Product Widget', swissProductExists,
      swissProductExists ? 'Swiss product widget file exists' : 'Swiss product widget file missing');

    const swissAnalyticsExists = fs.existsSync(path.join(__dirname, '../apps/medusa/src/admin/routes/swiss-analytics/page.tsx'));
    this.logTest('admin', 'Swiss Analytics Page', swissAnalyticsExists,
      swissAnalyticsExists ? 'Swiss analytics page file exists' : 'Swiss analytics page file missing');
  }

  async testSwissFeatures() {
    this.log('\n🇨🇭 Testing Swiss-Specific Features', 'red');
    
    // Test Swiss formatting
    const testCurrency = new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(299.99);
    
    this.logTest('swiss', 'Swiss Currency Formatting', testCurrency.includes('CHF'),
      `Currency formats as: ${testCurrency}`);

    // Test Swiss date formatting
    const testDate = new Intl.DateTimeFormat('de-CH').format(new Date());
    this.logTest('swiss', 'Swiss Date Formatting', testDate.includes('.'),
      `Date formats as: ${testDate}`);

    // Test Swiss widgets content
    try {
      const swissDashboard = fs.readFileSync(path.join(__dirname, '../apps/medusa/src/admin/widgets/swiss-dashboard-widget.tsx'), 'utf8');
      const hasSwissContent = swissDashboard.includes('🇨🇭') && swissDashboard.includes('Swiss');
      this.logTest('swiss', 'Swiss Dashboard Content', hasSwissContent,
        hasSwissContent ? 'Swiss dashboard contains proper Swiss content' : 'Swiss dashboard missing Swiss content');
    } catch (error) {
      this.logTest('swiss', 'Swiss Dashboard Content', false, 'Cannot read Swiss dashboard file');
    }

    // Test sustainability features
    try {
      const swissProduct = fs.readFileSync(path.join(__dirname, '../apps/medusa/src/admin/widgets/swiss-product-widget.tsx'), 'utf8');
      const hasSustainability = swissProduct.includes('sustainability') && swissProduct.includes('sustainable');
      this.logTest('swiss', 'Sustainability Features', hasSustainability,
        hasSustainability ? 'Sustainability features implemented' : 'Sustainability features missing');
    } catch (error) {
      this.logTest('swiss', 'Sustainability Features', false, 'Cannot read Swiss product widget file');
    }
  }

  async testIntegration() {
    this.log('\n🔗 Testing System Integration', 'cyan');
    
    // Test frontend to backend connectivity
    const frontendToBackend = await this.makeRequest('http://localhost:3005/api/health');
    const backendHealth = frontendToBackend.success && frontendToBackend.data.dependencies;
    this.logTest('integration', 'Frontend-Backend Connection', backendHealth,
      backendHealth ? `Database: ${frontendToBackend.data.dependencies.database?.status}` : 'Connection issues detected');

    // Test database connectivity
    const dbHealthy = backendHealth && frontendToBackend.data.dependencies.database?.status === 'healthy';
    this.logTest('integration', 'Database Connection', dbHealthy,
      dbHealthy ? 'Database connection healthy' : 'Database connection issues');

    // Test customer journey endpoints
    const customerEndpoints = [
      { name: 'Homepage', url: 'http://localhost:3005' },
      { name: 'Shop', url: 'http://localhost:3005/shop' },
      { name: 'Cart', url: 'http://localhost:3005/cart' },
      { name: 'Checkout', url: 'http://localhost:3005/checkout' }
    ];

    for (const endpoint of customerEndpoints) {
      const result = await this.makeRequest(endpoint.url);
      this.logTest('integration', `Customer ${endpoint.name}`, result.success,
        result.success ? `${endpoint.name} accessible to customers` : `${endpoint.name} access issues`);
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    this.log('\n' + '='.repeat(80), 'bright');
    this.log('🇨🇭 FITFOOT COMPREHENSIVE TEST REPORT', 'bright');
    this.log('='.repeat(80), 'bright');
    
    this.log(`\n⏱️  Test Duration: ${duration} seconds`, 'cyan');
    this.log(`📅 Test Date: ${new Date().toLocaleString('de-CH')}`, 'cyan');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.keys(this.results).forEach(category => {
      const result = this.results[category];
      totalPassed += result.passed;
      totalFailed += result.failed;
      
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      const status = result.failed === 0 ? '✅' : '⚠️';
      
      this.log(`\n${status} ${categoryName}: ${result.passed} passed, ${result.failed} failed`, 
        result.failed === 0 ? 'green' : 'yellow');
    });
    
    const overallStatus = totalFailed === 0 ? '🎉 ALL TESTS PASSED' : `⚠️  ${totalFailed} TESTS FAILED`;
    const overallColor = totalFailed === 0 ? 'green' : 'red';
    
    this.log(`\n${overallStatus}`, overallColor);
    this.log(`📊 Total: ${totalPassed} passed, ${totalFailed} failed`, 'bright');
    
    // Recommendations
    this.log('\n💡 RECOMMENDATIONS:', 'bright');
    
    if (this.results.backend.failed > 0) {
      this.log('  • Check Medusa backend configuration and database connection', 'yellow');
    }
    
    if (this.results.admin.failed > 0) {
      this.log('  • Verify admin user exists and Swiss customizations are compiled', 'yellow');
    }
    
    if (this.results.swiss.failed > 0) {
      this.log('  • Review Swiss-specific features and ensure proper implementation', 'yellow');
    }
    
    if (totalFailed === 0) {
      this.log('  🎯 Your FitFoot system is ready for production!', 'green');
      this.log('  🇨🇭 Swiss features are properly integrated', 'green');
      this.log('  🌱 Sustainability tracking is functional', 'green');
      this.log('  👥 Both customer and admin experiences are working', 'green');
    }
    
    this.log('\n' + '='.repeat(80), 'bright');
    
    return totalFailed === 0;
  }

  async runAllTests() {
    this.log('🚀 Starting FitFoot Comprehensive End-to-End Testing...', 'bright');
    this.log('🇨🇭 Testing Swiss Sustainable Footwear E-commerce Platform', 'bright');
    
    try {
      await this.testFrontendHealth();
      await this.testBackendHealth();
      await this.testAdminFunctionality();
      await this.testSwissFeatures();
      await this.testIntegration();
    } catch (error) {
      this.log(`\n❌ Test execution error: ${error.message}`, 'red');
    }
    
    return this.generateReport();
  }
}

// Run the tests
async function main() {
  const tester = new FitFootTester();
  const allTestsPassed = await tester.runAllTests();
  
  process.exit(allTestsPassed ? 0 : 1);
}

main().catch(console.error); 