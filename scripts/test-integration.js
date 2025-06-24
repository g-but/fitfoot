#!/usr/bin/env node

/**
 * FitFoot E2E Integration Test Suite
 * Tests the complete MedusaJS + Supabase + Next.js stack
 */

const https = require('https');
const http = require('http');

class FitFootIntegrationTester {
  constructor() {
    this.baseUrls = {
      frontend: 'http://localhost:3005',
      medusa: 'http://localhost:9000',
      sanity: 'http://localhost:3334'
    };
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const symbol = {
      info: 'ℹ️',
      success: '✅', 
      error: '❌',
      warning: '⚠️'
    }[type];
    
    console.log(`${symbol} [${timestamp}] ${message}`);
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https:') ? https : http;
      
      const req = client.request(url, {
        method: 'GET',
        timeout: 10000,
        ...options
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end(options.body);
    });
  }

  async testServiceHealth(name, url) {
    try {
      const response = await this.makeRequest(url);
      const isHealthy = response.statusCode >= 200 && response.statusCode < 400;
      
      this.testResults.push({
        test: `${name} Health Check`,
        status: isHealthy ? 'PASS' : 'FAIL',
        details: `Status: ${response.statusCode}`,
        url: url
      });

      if (isHealthy) {
        this.log(`${name} is healthy (${response.statusCode})`, 'success');
      } else {
        this.log(`${name} health check failed (${response.statusCode})`, 'error');
      }

      return isHealthy;
    } catch (error) {
      this.testResults.push({
        test: `${name} Health Check`,
        status: 'FAIL',
        details: error.message,
        url: url
      });
      this.log(`${name} is not accessible: ${error.message}`, 'error');
      return false;
    }
  }

  async testMedusaAPI() {
    this.log('Testing Medusa API endpoints...', 'info');
    
    const endpoints = [
      { name: 'Health Check', path: '/health' },
      { name: 'Store API', path: '/store/products' },
      { name: 'Admin API', path: '/admin/products' },
      { name: 'Regions', path: '/store/regions' },
      { name: 'Collections', path: '/store/collections' }
    ];

    for (const endpoint of endpoints) {
      try {
        const url = `${this.baseUrls.medusa}${endpoint.path}`;
        const response = await this.makeRequest(url);
        const isSuccess = response.statusCode >= 200 && response.statusCode < 400;
        
        this.testResults.push({
          test: `Medusa ${endpoint.name}`,
          status: isSuccess ? 'PASS' : 'FAIL',
          details: `${endpoint.path} -> ${response.statusCode}`,
          url: url
        });

        if (isSuccess) {
          this.log(`✓ ${endpoint.name}: ${response.statusCode}`, 'success');
        } else {
          this.log(`✗ ${endpoint.name}: ${response.statusCode}`, 'error');
        }
      } catch (error) {
        this.testResults.push({
          test: `Medusa ${endpoint.name}`,
          status: 'FAIL',
          details: error.message,
          url: `${this.baseUrls.medusa}${endpoint.path}`
        });
        this.log(`✗ ${endpoint.name}: ${error.message}`, 'error');
      }
    }
  }

  async testDatabaseConnection() {
    this.log('Testing database connection through Medusa...', 'info');
    
    try {
      // Test products endpoint to verify database connectivity
      const response = await this.makeRequest(`${this.baseUrls.medusa}/store/products`);
      const isConnected = response.statusCode === 200;
      
      if (isConnected) {
        const data = JSON.parse(response.data);
        const productCount = data.products ? data.products.length : 0;
        
        this.testResults.push({
          test: 'Database Connection',
          status: 'PASS',
          details: `Connected - ${productCount} products found`,
          url: `${this.baseUrls.medusa}/store/products`
        });
        
        this.log(`Database connected - ${productCount} products available`, 'success');
        return true;
      } else {
        this.testResults.push({
          test: 'Database Connection',
          status: 'FAIL',
          details: `Status: ${response.statusCode}`,
          url: `${this.baseUrls.medusa}/store/products`
        });
        
        this.log(`Database connection failed: ${response.statusCode}`, 'error');
        return false;
      }
    } catch (error) {
      this.testResults.push({
        test: 'Database Connection',
        status: 'FAIL',
        details: error.message,
        url: `${this.baseUrls.medusa}/store/products`
      });
      
      this.log(`Database connection error: ${error.message}`, 'error');
      return false;
    }
  }

  async testFrontendIntegration() {
    this.log('Testing frontend integration...', 'info');
    
    const pages = [
      { name: 'Homepage', path: '/' },
      { name: 'Shop Page', path: '/shop' },
      { name: 'Products API', path: '/api/products' },
      { name: 'Health API', path: '/api/health' }
    ];

    for (const page of pages) {
      try {
        const url = `${this.baseUrls.frontend}${page.path}`;
        const response = await this.makeRequest(url);
        const isSuccess = response.statusCode >= 200 && response.statusCode < 400;
        
        this.testResults.push({
          test: `Frontend ${page.name}`,
          status: isSuccess ? 'PASS' : 'FAIL',
          details: `${page.path} -> ${response.statusCode}`,
          url: url
        });

        if (isSuccess) {
          this.log(`✓ ${page.name}: ${response.statusCode}`, 'success');
        } else {
          this.log(`✗ ${page.name}: ${response.statusCode}`, 'error');
        }
      } catch (error) {
        this.testResults.push({
          test: `Frontend ${page.name}`,
          status: 'FAIL',
          details: error.message,
          url: `${this.baseUrls.frontend}${page.path}`
        });
        this.log(`✗ ${page.name}: ${error.message}`, 'error');
      }
    }
  }

  async testE2EWorkflow() {
    this.log('Testing end-to-end e-commerce workflow...', 'info');
    
    try {
      // 1. Get products
      this.log('Step 1: Fetching products...', 'info');
      const productsResponse = await this.makeRequest(`${this.baseUrls.medusa}/store/products`);
      
      if (productsResponse.statusCode !== 200) {
        throw new Error(`Products fetch failed: ${productsResponse.statusCode}`);
      }
      
      const products = JSON.parse(productsResponse.data);
      if (!products.products || products.products.length === 0) {
        throw new Error('No products found in database');
      }
      
      this.log(`✓ Found ${products.products.length} products`, 'success');
      
      // 2. Create cart
      this.log('Step 2: Creating cart...', 'info');
      const cartResponse = await this.makeRequest(`${this.baseUrls.medusa}/store/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (cartResponse.statusCode !== 200) {
        throw new Error(`Cart creation failed: ${cartResponse.statusCode}`);
      }
      
      const cart = JSON.parse(cartResponse.data);
      this.log(`✓ Cart created: ${cart.cart.id}`, 'success');
      
      // 3. Get regions
      this.log('Step 3: Fetching regions...', 'info');
      const regionsResponse = await this.makeRequest(`${this.baseUrls.medusa}/store/regions`);
      
      if (regionsResponse.statusCode !== 200) {
        throw new Error(`Regions fetch failed: ${regionsResponse.statusCode}`);
      }
      
      const regions = JSON.parse(regionsResponse.data);
      if (!regions.regions || regions.regions.length === 0) {
        throw new Error('No regions configured');
      }
      
      this.log(`✓ Found ${regions.regions.length} regions`, 'success');
      
      this.testResults.push({
        test: 'E2E Workflow',
        status: 'PASS',
        details: 'Complete workflow: Products → Cart → Regions',
        url: 'Multiple endpoints'
      });
      
      this.log('✓ End-to-end workflow completed successfully', 'success');
      return true;
      
    } catch (error) {
      this.testResults.push({
        test: 'E2E Workflow',
        status: 'FAIL',
        details: error.message,
        url: 'Multiple endpoints'
      });
      
      this.log(`✗ E2E workflow failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testSupabaseIntegration() {
    this.log('Testing Supabase integration through Medusa...', 'info');
    
    try {
      // Test if we can read data (indicates Supabase connection works)
      const response = await this.makeRequest(`${this.baseUrls.medusa}/store/products`);
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        
        // Check if we have real persistent data (not mock)
        const hasProducts = data.products && data.products.length > 0;
        const hasRealData = hasProducts && data.products.some(p => 
          p.title && p.handle && p.description
        );
        
        this.testResults.push({
          test: 'Supabase Integration',
          status: hasRealData ? 'PASS' : 'FAIL',
          details: hasRealData ? 
            `Connected - ${data.products.length} products in Supabase` : 
            'No persistent data found',
          url: `${this.baseUrls.medusa}/store/products`
        });
        
        if (hasRealData) {
          this.log(`✓ Supabase integration working - ${data.products.length} products`, 'success');
          return true;
        } else {
          this.log('✗ Supabase integration issue - no persistent data', 'warning');
          return false;
        }
      } else {
        throw new Error(`API request failed: ${response.statusCode}`);
      }
    } catch (error) {
      this.testResults.push({
        test: 'Supabase Integration',
        status: 'FAIL',
        details: error.message,
        url: `${this.baseUrls.medusa}/store/products`
      });
      
      this.log(`✗ Supabase integration failed: ${error.message}`, 'error');
      return false;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 FITFOOT INTEGRATION TEST RESULTS');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(t => t.status === 'PASS').length;
    const failed = this.testResults.filter(t => t.status === 'FAIL').length;
    const total = this.testResults.length;
    
    console.log(`\n📊 Summary: ${passed}/${total} tests passed (${failed} failed)\n`);
    
    // Group by status
    const passedTests = this.testResults.filter(t => t.status === 'PASS');
    const failedTests = this.testResults.filter(t => t.status === 'FAIL');
    
    if (passedTests.length > 0) {
      console.log('✅ PASSED TESTS:');
      passedTests.forEach(test => {
        console.log(`   ✓ ${test.test}: ${test.details}`);
      });
      console.log('');
    }
    
    if (failedTests.length > 0) {
      console.log('❌ FAILED TESTS:');
      failedTests.forEach(test => {
        console.log(`   ✗ ${test.test}: ${test.details}`);
        console.log(`     URL: ${test.url}`);
      });
      console.log('');
    }
    
    // Overall status
    if (failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Your FitFoot stack is working perfectly.');
      console.log('🚀 Ready for production deployment!');
    } else if (failed < total / 2) {
      console.log('⚠️  SOME ISSUES DETECTED. Please fix the failed tests.');
      console.log('💡 Most of your stack is working - you\'re almost there!');
    } else {
      console.log('🚨 MULTIPLE FAILURES DETECTED. Please check your setup.');
      console.log('🔧 Run: npm run setup-production');
    }
    
    console.log('\n' + '='.repeat(60));
    
    return failed === 0;
  }

  async runAllTests() {
    console.log('🧪 Starting FitFoot Integration Tests...\n');
    
    // Service health checks
    await this.testServiceHealth('Next.js Frontend', this.baseUrls.frontend);
    await this.testServiceHealth('Medusa Backend', this.baseUrls.medusa);
    await this.testServiceHealth('Sanity CMS', this.baseUrls.sanity);
    
    console.log('');
    
    // Detailed API tests
    await this.testMedusaAPI();
    await this.testDatabaseConnection();
    await this.testSupabaseIntegration();
    await this.testFrontendIntegration();
    await this.testE2EWorkflow();
    
    return this.printSummary();
  }
}

// Run the tests
async function main() {
  const tester = new FitFootIntegrationTester();
  const success = await tester.runAllTests();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FitFootIntegrationTester; 