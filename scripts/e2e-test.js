#!/usr/bin/env node

const fetch = require('node-fetch');
const { spawn } = require('child_process');

// Test configuration
const config = {
  frontend: 'http://localhost:3005',
  backend: 'http://localhost:9000',
  sanity: 'http://localhost:3334',
  timeout: 5000
};

// Test results storage
const testResults = {
  buyer: [],
  admin: [],
  api: [],
  overall: { passed: 0, failed: 0, total: 0 }
};

// Utility functions
function logTest(category, name, status, details = '') {
  const emoji = status === 'PASS' ? '✅' : '❌';
  const result = { name, status, details, timestamp: new Date().toISOString() };
  
  testResults[category].push(result);
  testResults.overall.total++;
  if (status === 'PASS') testResults.overall.passed++;
  else testResults.overall.failed++;
  
  console.log(`${emoji} [${category.toUpperCase()}] ${name}${details ? ` - ${details}` : ''}`);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Browser automation helper (headless)
function openBrowser(url) {
  console.log(`🌐 Opening browser: ${url}`);
  spawn('xdg-open', [url], { stdio: 'ignore' });
}

// Test suites
async function testBackendAPI() {
  console.log('\n🚀 Testing Backend API...');
  
  try {
    // Health check
    const health = await fetchWithTimeout(`${config.backend}/health`);
    if (health.ok) {
      const data = await health.json();
      logTest('api', 'Health Check', 'PASS', data.message);
    } else {
      logTest('api', 'Health Check', 'FAIL', `Status: ${health.status}`);
    }
  } catch (error) {
    logTest('api', 'Health Check', 'FAIL', error.message);
  }

  try {
    // Products API
    const products = await fetchWithTimeout(`${config.backend}/store/products`);
    if (products.ok) {
      const data = await products.json();
      logTest('api', 'Products API', 'PASS', `${data.products.length} products found`);
    } else {
      logTest('api', 'Products API', 'FAIL', `Status: ${products.status}`);
    }
  } catch (error) {
    logTest('api', 'Products API', 'FAIL', error.message);
  }

  try {
    // Cart creation
    const cart = await fetchWithTimeout(`${config.backend}/store/carts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (cart.ok) {
      const data = await cart.json();
      logTest('api', 'Cart Creation', 'PASS', `Cart ID: ${data.cart.id}`);
      return data.cart.id;
    } else {
      logTest('api', 'Cart Creation', 'FAIL', `Status: ${cart.status}`);
    }
  } catch (error) {
    logTest('api', 'Cart Creation', 'FAIL', error.message);
  }

  try {
    // Admin products endpoint
    const adminProducts = await fetchWithTimeout(`${config.backend}/admin/products`);
    if (adminProducts.ok) {
      const data = await adminProducts.json();
      logTest('api', 'Admin Products API', 'PASS', `${data.products.length} products available`);
    } else {
      logTest('api', 'Admin Products API', 'FAIL', `Status: ${adminProducts.status}`);
    }
  } catch (error) {
    logTest('api', 'Admin Products API', 'FAIL', error.message);
  }
}

async function testFrontendPages() {
  console.log('\n🌐 Testing Frontend Pages...');
  
  const pages = [
    { path: '/', name: 'Home Page' },
    { path: '/shop', name: 'Shop Page' },
    { path: '/about', name: 'About Page' },
    { path: '/admin', name: 'Admin Panel' },
    { path: '/cart', name: 'Cart Page' },
    { path: '/auth/login', name: 'Login Page' },
    { path: '/dashboard', name: 'Dashboard' }
  ];

  for (const page of pages) {
    try {
      const response = await fetchWithTimeout(`${config.frontend}${page.path}`);
      if (response.ok) {
        logTest('buyer', page.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('buyer', page.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('buyer', page.name, 'FAIL', error.message);
    }
  }
}

async function testBuyerExperience() {
  console.log('\n👤 Testing Buyer Experience...');
  
  // Test product browsing
  try {
    const shopPage = await fetchWithTimeout(`${config.frontend}/shop`);
    logTest('buyer', 'Shop Page Load', shopPage.ok ? 'PASS' : 'FAIL', `Status: ${shopPage.status}`);
  } catch (error) {
    logTest('buyer', 'Shop Page Load', 'FAIL', error.message);
  }

  // Test individual product page
  try {
    const productPage = await fetchWithTimeout(`${config.frontend}/shop/classic-running-shoe`);
    logTest('buyer', 'Product Detail Page', productPage.ok ? 'PASS' : 'FAIL', `Status: ${productPage.status}`);
  } catch (error) {
    logTest('buyer', 'Product Detail Page', 'FAIL', error.message);
  }

  // Test API integration
  try {
    const apiProducts = await fetchWithTimeout(`${config.frontend}/api/products`);
    logTest('buyer', 'Frontend API Integration', apiProducts.ok ? 'PASS' : 'FAIL', `Status: ${apiProducts.status}`);
  } catch (error) {
    logTest('buyer', 'Frontend API Integration', 'FAIL', error.message);
  }

  // Open browser for manual testing
  console.log('\n🔍 Opening browser for manual buyer testing...');
  openBrowser(`${config.frontend}/shop`);
}

async function testAdminExperience() {
  console.log('\n⚙️ Testing Admin Experience...');
  
  // Test admin panel access
  try {
    const adminPage = await fetchWithTimeout(`${config.frontend}/admin`);
    logTest('admin', 'Admin Panel Access', adminPage.ok ? 'PASS' : 'FAIL', `Status: ${adminPage.status}`);
  } catch (error) {
    logTest('admin', 'Admin Panel Access', 'FAIL', error.message);
  }

  // Test admin API endpoints
  const adminEndpoints = [
    { path: '/api/admin/products', name: 'Admin Products API' },
    { path: '/api/admin/orders', name: 'Admin Orders API' }
  ];

  for (const endpoint of adminEndpoints) {
    try {
      const response = await fetchWithTimeout(`${config.frontend}${endpoint.path}`);
      logTest('admin', endpoint.name, response.ok ? 'PASS' : 'FAIL', `Status: ${response.status}`);
    } catch (error) {
      logTest('admin', endpoint.name, 'FAIL', error.message);
    }
  }

  // Test Sanity Studio
  try {
    const sanityPage = await fetchWithTimeout(config.sanity);
    logTest('admin', 'Sanity Studio', sanityPage.ok ? 'PASS' : 'FAIL', `Status: ${sanityPage.status}`);
  } catch (error) {
    logTest('admin', 'Sanity Studio', 'FAIL', error.message);
  }

  // Open browser for manual admin testing
  console.log('\n🔍 Opening browser for manual admin testing...');
  openBrowser(`${config.frontend}/admin`);
  openBrowser(config.sanity);
}

async function testCartAndCheckout() {
  console.log('\n🛒 Testing Cart & Checkout Flow...');
  
  try {
    // Test cart page
    const cartPage = await fetchWithTimeout(`${config.frontend}/cart`);
    logTest('buyer', 'Cart Page', cartPage.ok ? 'PASS' : 'FAIL', `Status: ${cartPage.status}`);
    
    // Test checkout page
    const checkoutPage = await fetchWithTimeout(`${config.frontend}/checkout`);
    logTest('buyer', 'Checkout Page', checkoutPage.ok ? 'PASS' : 'FAIL', `Status: ${checkoutPage.status}`);
    
    // Test cart API
    const cartAPI = await fetchWithTimeout(`${config.frontend}/api/cart`);
    logTest('buyer', 'Cart API', cartAPI.ok ? 'PASS' : 'FAIL', `Status: ${cartAPI.status}`);
    
  } catch (error) {
    logTest('buyer', 'Cart & Checkout', 'FAIL', error.message);
  }
}

function generateTestReport() {
  console.log('\n📊 TEST REPORT');
  console.log('='.repeat(50));
  
  const { passed, failed, total } = testResults.overall;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  console.log(`
📈 SUMMARY
  Total Tests: ${total}
  Passed: ${passed} ✅
  Failed: ${failed} ❌
  Pass Rate: ${passRate}%
  
🔧 API TESTS (${testResults.api.length})
${testResults.api.map(t => `  ${t.status === 'PASS' ? '✅' : '❌'} ${t.name}`).join('\n')}

👤 BUYER TESTS (${testResults.buyer.length})
${testResults.buyer.map(t => `  ${t.status === 'PASS' ? '✅' : '❌'} ${t.name}`).join('\n')}

⚙️ ADMIN TESTS (${testResults.admin.length})
${testResults.admin.map(t => `  ${t.status === 'PASS' ? '✅' : '❌'} ${t.name}`).join('\n')}
  `);

  console.log('\n🎯 MANUAL TESTING CHECKLIST');
  console.log('━'.repeat(50));
  console.log(`
BUYER EXPERIENCE:
□ Browse products on ${config.frontend}/shop
□ View individual product details
□ Add products to cart
□ Update cart quantities
□ Proceed through checkout
□ Test responsive design on mobile
□ Test search functionality

ADMIN EXPERIENCE:
□ Access admin panel at ${config.frontend}/admin
□ View and manage products
□ View orders and customer data
□ Add new products via ${config.sanity}
□ Edit existing content
□ Test user permissions
□ Monitor analytics dashboard

API TESTING:
□ All backend endpoints responding
□ Proper error handling
□ Data validation working
□ Authentication flows
  `);

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS REQUIRE ATTENTION:');
    [...testResults.api, ...testResults.buyer, ...testResults.admin]
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`  • ${t.name}: ${t.details}`));
  }
}

// Main execution
async function runE2ETests() {
  console.log('🚀 FITFOOT END-TO-END TESTING');
  console.log('='.repeat(50));
  console.log(`
🌐 Frontend: ${config.frontend}
🛒 Backend:  ${config.backend}
📝 Sanity:   ${config.sanity}
  `);

  // Wait for services to be ready
  console.log('⏳ Waiting for services to be ready...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Run all test suites
  await testBackendAPI();
  await testFrontendPages();
  await testBuyerExperience();
  await testAdminExperience();
  await testCartAndCheckout();

  // Generate report
  generateTestReport();
  
  console.log('\n✨ Testing complete! Check browser windows for manual testing.');
  console.log('💡 Use Ctrl+C to exit when manual testing is done.');
}

// Run tests
runE2ETests().catch(console.error); 