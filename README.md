# FitFoot

Swiss sustainable footwear e-commerce platform built with Next.js and TypeScript.

## About

FitFoot connects conscious consumers with sustainably produced footwear from Swiss and European manufacturers. The platform emphasizes transparency in sourcing, materials, and production.

## Tech Stack

- **Framework**: Next.js / React
- **Language**: TypeScript
- **Deployment**: Vercel

## Development

```bash
npm install
npm run dev
```

## Deployment Monitoring

Automated deployment monitoring is available for production:

```bash
./scripts/monitor-status.sh   # Check status
./scripts/start-monitor.sh    # Start monitoring
tail -f logs/deployment-monitor.log  # Real-time logs
```

When active, the system handles deployment monitoring automatically with zero manual intervention.
