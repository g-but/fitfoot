#!/usr/bin/env node

const fetch = require('node-fetch');

// Configuration
const BACKEND_URL = 'http://localhost:9000';
const FRONTEND_URL = 'http://localhost:3005';

// Test data
const testProduct = {
  title: 'TEST PRODUCT - Admin Created Shoe',
  description: 'This product was created via admin panel to test the data flow',
  handle: 'test-product-admin-created-shoe',
  status: 'published',
  images: [
    { id: 'test_img_1', url: '/images/test-shoe.jpg' }
  ],
  variants: [
    {
      id: 'test_variant_1',
      title: 'US 10 / Black',
      prices: [{ amount: 15000, currency_code: 'usd' }],
      inventory_quantity: 25
    }
  ],
  options: [
    { id: 'test_opt_1', title: 'Size', values: ['US 10'] },
    { id: 'test_opt_2', title: 'Color', values: ['Black'] }
  ],
  tags: ['test', 'admin-created', 'e2e-test'],
  product_type: 'new',
  brand: 'FitFoot Test',
  category: 'shoes'
};

async function testAdminToShopFlow() {
  console.log('🚀 TESTING ADMIN-TO-SHOP DATA FLOW');
  console.log('=' * 50);
  
  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  const runTest = (testName, condition, details = '') => {
    testResults.total++;
    if (condition) {
      console.log(`✅ ${testName} - PASS${details ? ` (${details})` : ''}`);
      testResults.passed++;
    } else {
      console.log(`❌ ${testName} - FAIL${details ? ` (${details})` : ''}`);
      testResults.failed++;
    }
  };

  // Test 1: Check backend API health
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    runTest('Backend API Health', healthResponse.ok, healthData.message);
  } catch (error) {
    runTest('Backend API Health', false, error.message);
  }

  // Test 2: Get initial product count
  let initialProductCount = 0;
  try {
    const productsResponse = await fetch(`${BACKEND_URL}/store/products`);
    const productsData = await productsResponse.json();
    initialProductCount = productsData.products.length;
    runTest('Initial Products Fetch', productsResponse.ok, `${initialProductCount} products found`);
  } catch (error) {
    runTest('Initial Products Fetch', false, error.message);
  }

  // Test 3: Create product via admin API
  let createdProductId = null;
  try {
    const createResponse = await fetch(`${BACKEND_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProduct)
    });
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      createdProductId = createData.product.id;
      runTest('Admin Product Creation', true, `Product ID: ${createdProductId}`);
    } else {
      const errorText = await createResponse.text();
      runTest('Admin Product Creation', false, `Status: ${createResponse.status}, Error: ${errorText}`);
    }
  } catch (error) {
    runTest('Admin Product Creation', false, error.message);
  }

  // Test 4: Verify product appears in admin list
  try {
    const adminResponse = await fetch(`${BACKEND_URL}/admin/products`);
    const adminData = await adminResponse.json();
    const testProductInAdmin = adminData.products.find(p => p.id === createdProductId);
    runTest('Product in Admin List', !!testProductInAdmin, `Found in admin with title: ${testProductInAdmin?.title}`);
  } catch (error) {
    runTest('Product in Admin List', false, error.message);
  }

  // Test 5: Verify product appears in customer store
  try {
    const storeResponse = await fetch(`${BACKEND_URL}/store/products`);
    const storeData = await storeResponse.json();
    const testProductInStore = storeData.products.find(p => p.id === createdProductId);
    runTest('Product in Customer Store', !!testProductInStore, `Found in store with title: ${testProductInStore?.title}`);
  } catch (error) {
    runTest('Product in Customer Store', false, error.message);
  }

  // Test 6: Verify product count increased
  try {
    const finalResponse = await fetch(`${BACKEND_URL}/store/products`);
    const finalData = await finalResponse.json();
    const finalProductCount = finalData.products.length;
    const countIncreased = finalProductCount > initialProductCount;
    runTest('Product Count Increased', countIncreased, `${initialProductCount} → ${finalProductCount}`);
  } catch (error) {
    runTest('Product Count Increased', false, error.message);
  }

  // Test 7: Frontend admin page accessibility
  try {
    const adminPageResponse = await fetch(`${FRONTEND_URL}/admin/products`);
    runTest('Admin Page Accessible', adminPageResponse.ok, `Status: ${adminPageResponse.status}`);
  } catch (error) {
    runTest('Admin Page Accessible', false, error.message);
  }

  // Test 8: Frontend shop page accessibility
  try {
    const shopPageResponse = await fetch(`${FRONTEND_URL}/shop`);
    runTest('Shop Page Accessible', shopPageResponse.ok, `Status: ${shopPageResponse.status}`);
  } catch (error) {
    runTest('Shop Page Accessible', false, error.message);
  }

  // Cleanup: Remove test product
  if (createdProductId) {
    try {
      const deleteResponse = await fetch(`${BACKEND_URL}/admin/products/${createdProductId}`, {
        method: 'DELETE'
      });
      console.log(`🧹 Cleanup: ${deleteResponse.ok ? 'Test product deleted' : 'Failed to delete test product'}`);
    } catch (error) {
      console.log(`🧹 Cleanup failed: ${error.message}`);
    }
  }

  // Test Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('=' * 30);
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Admin-to-Shop data flow is working perfectly!');
    console.log('\nManual Testing Steps:');
    console.log('1. Open http://localhost:3005/admin/products');
    console.log('2. Click "Add New Product" and create a product');
    console.log('3. Save the product');
    console.log('4. Open http://localhost:3005/shop');
    console.log('5. Verify your new product appears in the shop');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED - Please check the issues above');
    console.log('\nDebugging Steps:');
    console.log('1. Ensure Mock Medusa API is running on port 9000');
    console.log('2. Ensure Frontend is running on port 3005');
    console.log('3. Check browser console for any errors');
    console.log('4. Verify network requests in browser dev tools');
  }

  return testResults.failed === 0;
}

// Run the test
testAdminToShopFlow()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  }); 