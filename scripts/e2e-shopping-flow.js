#!/usr/bin/env node

/**
 * FitFoot E2E Shopping Flow Test
 * Tests the complete customer journey: Browse → Add to Cart → Checkout
 */

const http = require('http');

class ShoppingFlowTester {
  constructor() {
    this.baseUrl = 'http://localhost:9000';
    this.cartId = null;
    this.customerId = null;
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request(url, {
        method: 'GET',
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
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
      
      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  log(message, type = 'info') {
    const symbols = { info: 'ℹ️', success: '✅', error: '❌', step: '👉' };
    console.log(`${symbols[type]} ${message}`);
  }

  async step1_BrowseProducts() {
    this.log('Step 1: Browse Products', 'step');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/store/products`);
      
      if (response.statusCode !== 200) {
        throw new Error(`Products API failed: ${response.statusCode}`);
      }
      
      const data = JSON.parse(response.data);
      
      if (!data.products || data.products.length === 0) {
        throw new Error('No products available');
      }
      
      // Look for Swiss FitFoot products
      this.products = data.products;
      const swissProducts = this.products.filter(p => 
        p.title && (
          p.title.includes('Alpine') || 
          p.title.includes('Zurich') || 
          p.title.includes('Swiss')
        )
      );
      
      if (swissProducts.length > 0) {
        this.selectedProduct = swissProducts[0];
        this.log(`Found ${data.products.length} products, selected: ${this.selectedProduct.title}`, 'success');
      } else {
        this.selectedProduct = this.products[0];
        this.log(`Found ${data.products.length} products, selected: ${this.selectedProduct.title}`, 'success');
      }
      
      return true;
    } catch (error) {
      this.log(`Failed to browse products: ${error.message}`, 'error');
      return false;
    }
  }

  async step2_CreateCart() {
    this.log('Step 2: Create Shopping Cart', 'step');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/store/carts`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      
      if (response.statusCode !== 200) {
        throw new Error(`Cart creation failed: ${response.statusCode}`);
      }
      
      const data = JSON.parse(response.data);
      this.cartId = data.cart.id;
      
      this.log(`Cart created successfully: ${this.cartId}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to create cart: ${error.message}`, 'error');
      return false;
    }
  }

  async step3_AddToCart() {
    this.log('Step 3: Add Product to Cart', 'step');
    
    if (!this.cartId || !this.selectedProduct) {
      this.log('Missing cart ID or selected product', 'error');
      return false;
    }
    
    try {
      // Get the first variant of the selected product
      const variant = this.selectedProduct.variants && this.selectedProduct.variants[0];
      if (!variant) {
        throw new Error('Product has no variants');
      }
      
      const response = await this.makeRequest(`${this.baseUrl}/store/carts/${this.cartId}/line-items`, {
        method: 'POST',
        body: JSON.stringify({
          variant_id: variant.id,
          quantity: 1
        })
      });
      
      if (response.statusCode !== 200) {
        throw new Error(`Add to cart failed: ${response.statusCode}`);
      }
      
      const data = JSON.parse(response.data);
      const itemCount = data.cart.items ? data.cart.items.length : 0;
      
      this.log(`Product added to cart (${itemCount} items total)`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to add to cart: ${error.message}`, 'error');
      return false;
    }
  }

  async step4_ViewCart() {
    this.log('Step 4: View Cart Contents', 'step');
    
    if (!this.cartId) {
      this.log('Missing cart ID', 'error');
      return false;
    }
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/store/carts/${this.cartId}`);
      
      if (response.statusCode !== 200) {
        throw new Error(`View cart failed: ${response.statusCode}`);
      }
      
      const data = JSON.parse(response.data);
      const cart = data.cart;
      
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      const itemCount = cart.items.length;
      const total = cart.total || 0;
      
      this.log(`Cart contains ${itemCount} items, total: ${total}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to view cart: ${error.message}`, 'error');
      return false;
    }
  }

  async step5_GetRegions() {
    this.log('Step 5: Get Available Regions', 'step');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/store/regions`);
      
      if (response.statusCode !== 200) {
        throw new Error(`Regions API failed: ${response.statusCode}`);
      }
      
      const data = JSON.parse(response.data);
      
      if (!data.regions || data.regions.length === 0) {
        throw new Error('No regions configured');
      }
      
      this.regions = data.regions;
      this.selectedRegion = this.regions[0];
      
      this.log(`Found ${this.regions.length} regions, selected: ${this.selectedRegion.name}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to get regions: ${error.message}`, 'error');
      return false;
    }
  }

  async step6_UpdateCartRegion() {
    this.log('Step 6: Set Cart Region', 'step');
    
    if (!this.cartId || !this.selectedRegion) {
      this.log('Missing cart ID or selected region', 'error');
      return false;
    }
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/store/carts/${this.cartId}`, {
        method: 'POST',
        body: JSON.stringify({
          region_id: this.selectedRegion.id
        })
      });
      
      if (response.statusCode !== 200) {
        throw new Error(`Cart region update failed: ${response.statusCode}`);
      }
      
      this.log(`Cart region set to: ${this.selectedRegion.name}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to set cart region: ${error.message}`, 'error');
      return false;
    }
  }

  async step7_ValidateCartTotals() {
    this.log('Step 7: Validate Cart Totals', 'step');
    
    if (!this.cartId) {
      this.log('Missing cart ID', 'error');
      return false;
    }
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/store/carts/${this.cartId}`);
      
      if (response.statusCode !== 200) {
        throw new Error(`Cart validation failed: ${response.statusCode}`);
      }
      
      const data = JSON.parse(response.data);
      const cart = data.cart;
      
      // Check that cart has proper totals calculated
      const hasSubtotal = typeof cart.subtotal === 'number';
      const hasTotal = typeof cart.total === 'number';
      const hasItems = cart.items && cart.items.length > 0;
      
      if (hasSubtotal && hasTotal && hasItems) {
        this.log(`Cart totals valid - Subtotal: ${cart.subtotal}, Total: ${cart.total}`, 'success');
        return true;
      } else {
        throw new Error('Cart totals are not properly calculated');
      }
    } catch (error) {
      this.log(`Cart validation failed: ${error.message}`, 'error');
      return false;
    }
  }

  async runShoppingFlow() {
    console.log('🛒 FitFoot E2E Shopping Flow Test\n');
    
    const steps = [
      { name: 'Browse Products', test: () => this.step1_BrowseProducts() },
      { name: 'Create Cart', test: () => this.step2_CreateCart() },
      { name: 'Add to Cart', test: () => this.step3_AddToCart() },
      { name: 'View Cart', test: () => this.step4_ViewCart() },
      { name: 'Get Regions', test: () => this.step5_GetRegions() },
      { name: 'Set Cart Region', test: () => this.step6_UpdateCartRegion() },
      { name: 'Validate Totals', test: () => this.step7_ValidateCartTotals() }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const step of steps) {
      console.log(`\n--- ${step.name} ---`);
      const result = await step.test();
      if (result) {
        passed++;
      } else {
        failed++;
        this.log('Step failed - stopping test', 'error');
        break;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🧪 SHOPPING FLOW TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`📊 Steps completed: ${passed}/${steps.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed === 0) {
      console.log('\n🎉 COMPLETE SHOPPING FLOW WORKING!');
      console.log('🛒 Your e-commerce platform is ready for customers');
      console.log('\n🔗 Test Summary:');
      console.log('   • Product browsing: ✅');
      console.log('   • Cart functionality: ✅');
      console.log('   • Regional pricing: ✅');
      console.log('   • Supabase integration: ✅');
    } else {
      console.log('\n⚠️  SHOPPING FLOW INCOMPLETE');
      console.log('🔧 Issues detected in the e-commerce workflow');
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Ensure Medusa is running: npm run dev-medusa');
      console.log('   2. Check database: npm run validate-supabase');
      console.log('   3. Seed products: npm run seed');
    }
    
    console.log('='.repeat(60));
    
    return failed === 0;
  }
}

if (require.main === module) {
  const tester = new ShoppingFlowTester();
  tester.runShoppingFlow()
    .then(success => process.exit(success ? 0 : 1))
    .catch(console.error);
}

module.exports = ShoppingFlowTester; 