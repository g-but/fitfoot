import { expect, test } from '@playwright/test';

test.describe('FitFoot Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate through complete shopping flow', async ({ page }) => {
    // Test homepage loads correctly
    await expect(page.locator('h1')).toContainText('FitFoot');
    
    // Navigate to shop
    await page.click('text=Shop');
    await page.waitForURL('**/shop');
    
    // Check products are displayed
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3, { timeout: 10000 });
    
    // Click on first product
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL('**/shop/**');
    
    // Add to cart
    await page.click('text=Add to Cart');
    
    // Check cart counter updates
    await expect(page.locator('[data-testid="cart-counter"]')).toContainText('1');
    
    // Go to cart
    await page.click('[data-testid="cart-link"]');
    await page.waitForURL('**/cart');
    
    // Verify item in cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    
    // Proceed to checkout
    await page.click('text=Checkout');
    await page.waitForURL('**/checkout');
    
    // Fill checkout form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="address"]', '123 Test Street');
    await page.fill('[name="city"]', 'Zurich');
    await page.fill('[name="postalCode"]', '8001');
    
    // Submit order
    await page.click('text=Place Order');
    
    // Check order confirmation
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('should handle authentication flow', async ({ page }) => {
    // Navigate to login
    await page.click('text=Login');
    await page.waitForURL('**/auth/login');
    
    // Test login form
    await page.fill('[name="email"]', 'test@fitfoot.ch');
    await page.fill('[name="password"]', 'testpassword');
    await page.click('text=Sign In');
    
    // Should redirect to dashboard or home
    await page.waitForURL(['**/dashboard', '**/']);
    
    // Check user is logged in
    await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await page.goto('/shop');
    
    // Use search functionality
    await page.fill('[data-testid="search-input"]', 'running');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Check search results
    await expect(page.locator('[data-testid="product-card"]')).toHaveCountGreaterThan(0);
    await expect(page.locator('text=running')).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Navigate using mobile menu
    await page.click('[data-testid="mobile-menu-shop"]');
    await page.waitForURL('**/shop');
    
    // Check products display properly on mobile
    await expect(page.locator('[data-testid="product-card"]')).toHaveCountGreaterThan(0);
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Navigate to non-existent product
    await page.goto('/shop/non-existent-product');
    
    // Should show 404 or error page
    await expect(page.locator('text=Not Found')).toBeVisible();
    
    // Test network error handling
    await page.route('**/api/products', route => route.abort());
    await page.goto('/shop');
    
    // Should show error message or fallback
    await expect(page.locator('text=Error loading products')).toBeVisible();
  });
});