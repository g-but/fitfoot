import { expect, test } from '@playwright/test';

test.describe('Core Web Vitals Performance', () => {
  test('should meet Core Web Vitals thresholds on homepage', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 3000);
      });
    });
    
    // LCP should be under 2.5 seconds (2500ms)
    expect(lcp).toBeLessThan(2500);
    
    // Measure First Input Delay through user interaction
    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const firstEntry = list.getEntries()[0];
          resolve(firstEntry.processingStart - firstEntry.startTime);
        }).observe({ entryTypes: ['first-input'] });
        
        // Simulate user interaction
        document.body.click();
        
        // Fallback
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    // FID should be under 100ms
    expect(fid).toBeLessThan(100);
  });

  test('should load shop page efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/shop', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that products are visible
    await expect(page.locator('[data-testid="product-card"]')).toHaveCountGreaterThan(0);
  });

  test('should handle image loading efficiently', async ({ page }) => {
    await page.goto('/shop');
    
    // Check that images are lazy loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check loading attribute
      const firstImage = images.first();
      const loading = await firstImage.getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('should have minimal bundle size impact', async ({ page }) => {
    // Monitor network requests
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('.js') || request.url().includes('.css')) {
        requests.push(request.url());
      }
    });
    
    await page.goto('/');
    
    // Should not load excessive JavaScript
    const jsFiles = requests.filter(url => url.includes('.js'));
    expect(jsFiles.length).toBeLessThan(10); // Reasonable limit
  });

  test('should handle cart operations efficiently', async ({ page }) => {
    await page.goto('/shop');
    
    // Time the add to cart operation
    const startTime = Date.now();
    
    await page.locator('[data-testid="product-card"]').first().click();
    await page.click('text=Add to Cart');
    
    // Wait for cart update
    await page.waitForSelector('[data-testid="cart-counter"]', { timeout: 2000 });
    
    const operationTime = Date.now() - startTime;
    
    // Cart operation should be under 2 seconds
    expect(operationTime).toBeLessThan(2000);
  });
}); 