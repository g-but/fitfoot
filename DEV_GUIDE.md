# Development Guide

## Quick Start

Your development servers should now start cleanly without verbose Sentry logging cluttering the terminal.

### One Command Setup
```bash
npm run dev
```
This starts both:
- **Frontend**: http://localhost:3000
- **Sanity Studio**: http://localhost:3333

### Individual Services
If you need to run services separately:
```bash
npm run dev:web      # Just the Next.js frontend
npm run dev:sanity   # Just Sanity Studio
npm run dev:clean    # Force clean rebuild
```

## What's Fixed

✅ **Sentry disabled in development** - No more terminal spam  
✅ **Clean console output** - Only important messages show  
✅ **No missing file errors** - All configs properly set up  
✅ **Stable dev server** - Should not crash randomly  

## Development Workflow

1. **Start development**: `npm run dev`
2. **Frontend**: http://localhost:3000 (your website)
3. **CMS**: http://localhost:3333 (edit content)
4. **Edit code**: Changes auto-reload
5. **Edit content**: Use Sanity Studio, changes sync immediately

## Environment

- **Development**: Sentry is completely disabled for cleaner experience
- **Production**: Sentry is enabled for error tracking
- **Sanity**: Connected to production dataset (m6r6y2se)

## Troubleshooting

- **If servers won't start**: Try `npm run dev:clean`
- **If ports are busy**: Kill processes with `pkill -f "node.*3000\|node.*3333"`
- **If Sanity asks to upgrade**: Choose "Yes" (it's safe)

## Pages Structure

- `/` - Home page (connected to Sanity)
- `/products` - Products page (connected to Sanity)  
- `/about` - About page (connected to Sanity)
- `/contact` - Contact page (connected to Sanity) 