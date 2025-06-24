#!/usr/bin/env node

/**
 * FitFoot Supabase Validation Script
 * Validates Supabase integration and data integrity
 */

const http = require('http');

class SupabaseValidator {
  constructor() {
    this.medusaUrl = 'http://localhost:9000';
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request(url, {
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

  async validateDatabaseConnection() {
    console.log('🔗 Testing Supabase database connection...');
    
    try {
      const response = await this.makeRequest(`${this.medusaUrl}/health`);
      
      if (response.statusCode === 200) {
        console.log('✅ Database connection: HEALTHY');
        return true;
      } else {
        console.log(`❌ Database connection failed: ${response.statusCode}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Database connection error: ${error.message}`);
      return false;
    }
  }

  async validateDataPersistence() {
    console.log('💾 Testing data persistence...');
    
    try {
      // Check if products exist and have proper structure
      const response = await this.makeRequest(`${this.medusaUrl}/store/products`);
      
      if (response.statusCode !== 200) {
        console.log(`❌ Products API failed: ${response.statusCode}`);
        return false;
      }
      
      const data = JSON.parse(response.data);
      
      if (!data.products || data.products.length === 0) {
        console.log('⚠️  No products found - database may be empty');
        console.log('💡 Run: npm run seed');
        return false;
      }
      
      // Check for Swiss FitFoot products
      const swissProducts = data.products.filter(p => 
        p.title && (
          p.title.includes('Alpine') || 
          p.title.includes('Zurich') || 
          p.title.includes('Basel') ||
          p.title.includes('Geneva') ||
          p.title.includes('Matterhorn')
        )
      );
      
      if (swissProducts.length > 0) {
        console.log(`✅ Data persistence: WORKING (${swissProducts.length} Swiss products found)`);
        console.log('   Products:', swissProducts.map(p => p.title).join(', '));
        return true;
      } else {
        console.log(`⚠️  Generic products found (${data.products.length}), but no Swiss FitFoot products`);
        console.log('💡 Run: npm run seed  # to add Swiss footwear products');
        return false;
      }
      
    } catch (error) {
      console.log(`❌ Data persistence check failed: ${error.message}`);
      return false;
    }
  }

  async validateMedusaIntegration() {
    console.log('🏪 Testing Medusa-Supabase integration...');
    
    const endpoints = [
      '/store/products',
      '/store/regions', 
      '/store/collections'
    ];
    
    let allPassed = true;
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(`${this.medusaUrl}${endpoint}`);
        
        if (response.statusCode === 200) {
          const data = JSON.parse(response.data);
          const hasData = Object.keys(data).length > 0;
          
          if (hasData) {
            console.log(`   ✅ ${endpoint}: WORKING`);
          } else {
            console.log(`   ⚠️  ${endpoint}: Empty response`);
            allPassed = false;
          }
        } else {
          console.log(`   ❌ ${endpoint}: Failed (${response.statusCode})`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint}: Error (${error.message})`);
        allPassed = false;
      }
    }
    
    if (allPassed) {
      console.log('✅ Medusa-Supabase integration: WORKING');
    } else {
      console.log('❌ Medusa-Supabase integration: ISSUES DETECTED');
    }
    
    return allPassed;
  }

  async validateAuthentication() {
    console.log('🔐 Testing authentication system...');
    
    try {
      // Test admin endpoint (should require auth)
      const response = await this.makeRequest(`${this.medusaUrl}/admin/products`);
      
      // We expect 401 (unauthorized) which means auth is working
      if (response.statusCode === 401) {
        console.log('✅ Authentication: WORKING (401 Unauthorized as expected)');
        return true;
      } else if (response.statusCode === 200) {
        console.log('⚠️  Authentication: May be misconfigured (200 without auth)');
        return false;
      } else {
        console.log(`❌ Authentication: Unexpected response (${response.statusCode})`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Authentication test failed: ${error.message}`);
      return false;
    }
  }

  async validateSwissBusinessLogic() {
    console.log('🇨🇭 Testing Swiss business logic...');
    
    try {
      const response = await this.makeRequest(`${this.medusaUrl}/store/products`);
      
      if (response.statusCode !== 200) {
        console.log('❌ Cannot test Swiss logic - products API failed');
        return false;
      }
      
      const data = JSON.parse(response.data);
      
      // Check for Swiss-specific features
      const swissFeatures = {
        sustainableProducts: 0,
        swissMade: 0,
        properPricing: 0
      };
      
      data.products.forEach(product => {
        // Check for sustainability tags/keywords
        const description = (product.description || '').toLowerCase();
        const title = (product.title || '').toLowerCase();
        
        if (description.includes('sustainable') || description.includes('eco') || 
            title.includes('sustainable') || title.includes('eco')) {
          swissFeatures.sustainableProducts++;
        }
        
        if (description.includes('swiss') || title.includes('swiss')) {
          swissFeatures.swissMade++;
        }
        
        // Check if products have proper pricing structure
        if (product.variants && product.variants.length > 0) {
          swissFeatures.properPricing++;
        }
      });
      
      const hasSwissFeatures = swissFeatures.sustainableProducts > 0 || swissFeatures.swissMade > 0;
      
      if (hasSwissFeatures) {
        console.log('✅ Swiss business logic: IMPLEMENTED');
        console.log(`   • Sustainable products: ${swissFeatures.sustainableProducts}`);
        console.log(`   • Swiss-made products: ${swissFeatures.swissMade}`);
        console.log(`   • Products with pricing: ${swissFeatures.properPricing}`);
        return true;
      } else {
        console.log('⚠️  Swiss business logic: NOT DETECTED');
        console.log('💡 Run: npm run seed  # to add Swiss footwear products');
        return false;
      }
      
    } catch (error) {
      console.log(`❌ Swiss business logic test failed: ${error.message}`);
      return false;
    }
  }

  async runValidation() {
    console.log('🔍 FitFoot Supabase Validation\n');
    
    const tests = [
      { name: 'Database Connection', test: () => this.validateDatabaseConnection() },
      { name: 'Data Persistence', test: () => this.validateDataPersistence() },
      { name: 'Medusa Integration', test: () => this.validateMedusaIntegration() },
      { name: 'Authentication', test: () => this.validateAuthentication() },
      { name: 'Swiss Business Logic', test: () => this.validateSwissBusinessLogic() }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
      console.log(`\n--- ${test.name} ---`);
      const result = await test.test();
      if (result) passed++;
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Validation Results: ${passed}/${total} passed`);
    
    if (passed === total) {
      console.log('🎉 ALL VALIDATIONS PASSED!');
      console.log('🚀 Your MedusaJS + Supabase integration is working perfectly!');
      console.log('\n🔗 Ready to use:');
      console.log('   • Frontend: http://localhost:3005');
      console.log('   • Admin: http://localhost:9000/admin');
      console.log('   • API: http://localhost:9000');
    } else {
      console.log('⚠️  SOME VALIDATIONS FAILED');
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Ensure all services are running: npm run dev');
      console.log('   2. Check environment variables in apps/medusa/.env');
      console.log('   3. Run database migration: npm run migrate');
      console.log('   4. Seed test data: npm run seed');
    }
    
    console.log('='.repeat(50));
    
    return passed === total;
  }
}

if (require.main === module) {
  const validator = new SupabaseValidator();
  validator.runValidation()
    .then(success => process.exit(success ? 0 : 1))
    .catch(console.error);
}

module.exports = SupabaseValidator; 