module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/about',
        'http://localhost:3000/shop',
        'http://localhost:3000/contact',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': 'off',
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        
        // Performance budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 500000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 1000000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 2000000 }],
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        
        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'canonical': 'warn',
        'robots-txt': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
} 