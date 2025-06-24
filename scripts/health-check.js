#!/usr/bin/env node

/**
 * FitFoot Quick Health Check
 * Rapid verification that all services are running
 */

const http = require('http');

const services = [
  { name: 'Next.js Frontend', url: 'http://localhost:3005', required: true },
  { name: 'Medusa Backend', url: 'http://localhost:9000/health', required: true },
  { name: 'Sanity CMS', url: 'http://localhost:3334', required: false }
];

async function checkService(service) {
  return new Promise((resolve) => {
    const req = http.request(service.url, { timeout: 5000 }, (res) => {
      const isHealthy = res.statusCode >= 200 && res.statusCode < 400;
      resolve({
        ...service,
        status: isHealthy ? 'UP' : 'DOWN',
        statusCode: res.statusCode
      });
    });

    req.on('error', () => {
      resolve({
        ...service,
        status: 'DOWN',
        statusCode: 'ERR'
      });
    });

    req.on('timeout', () => {
      resolve({
        ...service,
        status: 'DOWN',
        statusCode: 'TIMEOUT'
      });
    });

    req.end();
  });
}

async function healthCheck() {
  console.log('🏥 FitFoot Health Check\n');
  
  const results = await Promise.all(services.map(checkService));
  
  let allGood = true;
  
  results.forEach(result => {
    const icon = result.status === 'UP' ? '✅' : '❌';
    const required = result.required ? '(Required)' : '(Optional)';
    
    console.log(`${icon} ${result.name} ${required}`);
    console.log(`   Status: ${result.status} (${result.statusCode})`);
    console.log(`   URL: ${result.url}\n`);
    
    if (result.required && result.status !== 'UP') {
      allGood = false;
    }
  });
  
  if (allGood) {
    console.log('🎉 All required services are healthy!');
    console.log('🔗 URLs:');
    console.log('   • Frontend: http://localhost:3005');
    console.log('   • Admin: http://localhost:9000/admin');
    console.log('   • API: http://localhost:9000');
    console.log('   • CMS: http://localhost:3334');
  } else {
    console.log('🚨 Some required services are down!');
    console.log('💡 Try: npm run dev');
  }
  
  return allGood;
}

if (require.main === module) {
  healthCheck()
    .then(success => process.exit(success ? 0 : 1))
    .catch(console.error);
}

module.exports = healthCheck; 