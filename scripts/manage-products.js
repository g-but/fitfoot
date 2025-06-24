#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:9000';

// Sample product templates
const productTemplates = {
  new_shoe: {
    title: 'New Sustainable Shoe',
    description: 'Premium eco-friendly footwear',
    price: 25000, // CHF 250.00
    product_type: 'new',
    sustainability_data: {
      materials: ['recycled_polyester', 'organic_cotton'],
      carbon_footprint_kg: 5.2,
      recyclability_score: 85,
      ethical_sourcing: true
    }
  },
  refurbished_shoe: {
    title: 'Refurbished Athletic Shoe',
    description: 'Professionally restored running shoe',
    price: 18000, // CHF 180.00
    product_type: 'refurbished',
    condition_grade: 'excellent',
    environmental_impact: {
      carbon_footprint_saved_kg: 6.5,
      water_saved_liters: 2000,
      waste_diverted_kg: 0.7
    }
  }
};

async function listProducts() {
  try {
    const response = await fetch(`${API_BASE}/store/products`);
    const data = await response.json();
    
    console.log('📦 Current Products:');
    console.log('==================');
    
    if (data.products && data.products.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Type: ${product.product_type}`);
        console.log(`   Price: CHF ${(product.price / 100).toFixed(2)}`);
        console.log(`   Description: ${product.description}`);
        console.log('   ---');
      });
    } else {
      console.log('No products found.');
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
  }
}

async function addProduct(template) {
  try {
    const productData = productTemplates[template];
    if (!productData) {
      console.error(`❌ Template "${template}" not found. Available: ${Object.keys(productTemplates).join(', ')}`);
      return;
    }

    const response = await fetch(`${API_BASE}/store/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Product added successfully!');
      console.log(`   ID: ${result.id}`);
      console.log(`   Title: ${result.title}`);
      console.log(`   Price: CHF ${(result.price / 100).toFixed(2)}`);
    } else {
      console.error('❌ Error adding product:', result);
    }
  } catch (error) {
    console.error('❌ Error adding product:', error.message);
  }
}

async function addCustomProduct(title, description, price, type = 'new') {
  try {
    const productData = {
      title,
      description,
      price: Math.round(parseFloat(price) * 100), // Convert to cents
      product_type: type,
      sustainability_data: {
        materials: ['eco_friendly'],
        carbon_footprint_kg: 4.0,
        recyclability_score: 80,
        ethical_sourcing: true
      }
    };

    const response = await fetch(`${API_BASE}/store/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Custom product added successfully!');
      console.log(`   ID: ${result.id}`);
      console.log(`   Title: ${result.title}`);
      console.log(`   Price: CHF ${(result.price / 100).toFixed(2)}`);
    } else {
      console.error('❌ Error adding custom product:', result);
    }
  } catch (error) {
    console.error('❌ Error adding custom product:', error.message);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_BASE}/store/products/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log(`✅ Product ${productId} deleted successfully!`);
    } else {
      console.error('❌ Error deleting product:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
  }
}

async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Medusa server is running');
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
    } else {
      console.log('❌ Medusa server is not responding properly');
    }
  } catch (error) {
    console.error('❌ Cannot reach Medusa server:', error.message);
    console.log('💡 Make sure to start the server with: cd packages/medusa && node enhanced-server.js');
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'list':
    listProducts();
    break;
  
  case 'add':
    if (args[1]) {
      addProduct(args[1]);
    } else {
      console.log('Usage: node manage-products.js add <template>');
      console.log('Available templates:', Object.keys(productTemplates).join(', '));
    }
    break;
  
  case 'custom':
    if (args[1] && args[2] && args[3]) {
      addCustomProduct(args[1], args[2], args[3], args[4] || 'new');
    } else {
      console.log('Usage: node manage-products.js custom "Product Title" "Description" 199.99 [new|refurbished]');
    }
    break;
  
  case 'delete':
    if (args[1]) {
      deleteProduct(args[1]);
    } else {
      console.log('Usage: node manage-products.js delete <product-id>');
    }
    break;
  
  case 'health':
    checkHealth();
    break;
  
  default:
    console.log('🛠️  FitFoot Product Management CLI');
    console.log('===============================');
    console.log('');
    console.log('Available commands:');
    console.log('  list                    - List all products');
    console.log('  add <template>          - Add product from template');
    console.log('  custom <title> <desc> <price> [type] - Add custom product');
    console.log('  delete <id>             - Delete product by ID');
    console.log('  health                  - Check server status');
    console.log('');
    console.log('Examples:');
    console.log('  node manage-products.js list');
    console.log('  node manage-products.js add new_shoe');
    console.log('  node manage-products.js custom "Swiss Hiking Boot" "Waterproof boot" 299.99 new');
    console.log('  node manage-products.js health');
    console.log('');
    console.log('Available templates:', Object.keys(productTemplates).join(', '));
} 