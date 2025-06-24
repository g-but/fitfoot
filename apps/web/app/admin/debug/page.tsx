'use client';

import { useEffect, useState } from 'react';

export default function AdminDebug() {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      addResult('🚀 Starting admin dashboard connection test...');
      setStep(1);

      // Step 1: Test Next.js API
      addResult('Step 1: Testing Next.js internal API...');
      try {
        const apiResponse = await fetch('/api/health');
        addResult(`Step 1 result: ${apiResponse.status} - ${apiResponse.statusText}`);
      } catch (apiError) {
        addResult(`Step 1 warning: ${apiError} (This is expected if no API route exists)`);
      }
      setStep(2);

      // Step 2: Test enhanced server health
      addResult('Step 2: Testing Enhanced Server health endpoint...');
      const healthResponse = await fetch('http://localhost:9000/health', {
        mode: 'cors',
      });
      addResult(`Step 2 result: ${healthResponse.status} - ${healthResponse.statusText}`);
      const healthData = await healthResponse.json();
      addResult(`Step 2 data: ${JSON.stringify(healthData)}`);
      setStep(3);

      // Step 3: Test products endpoint
      addResult('Step 3: Testing products endpoint...');
      const productsResponse = await fetch('http://localhost:9000/store/products', {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      addResult(`Step 3 result: ${productsResponse.status} - ${productsResponse.statusText}`);
      
      const productsData = await productsResponse.json();
      addResult(`Step 3 data: Found ${productsData.products?.length || 0} products`);
      
      if (productsData.products?.length > 0) {
        addResult(`First product: ${productsData.products[0].title} - CHF ${(productsData.products[0].price / 100).toFixed(2)}`);
      }
      setStep(4);

      // Step 4: Test debug endpoint
      addResult('Step 4: Testing debug endpoint...');
      try {
        const debugResponse = await fetch('http://localhost:9000/admin/debug', {
          mode: 'cors',
        });
        const debugData = await debugResponse.json();
        addResult(`Step 4 data: ${JSON.stringify(debugData)}`);
      } catch (debugError) {
        addResult(`Step 4 warning: ${debugError} (Debug endpoint may not be available)`);
      }

      addResult('✅ All tests completed successfully!');
      addResult('🎉 Admin dashboard should work properly!');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addResult(`❌ Error at step ${step}: ${errorMsg}`);
      setError(errorMsg);
      addResult('💡 This error explains why the admin dashboard is stuck loading.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">🔧 FitFoot Admin Debug Tool</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Progress: Step {step}/4</h2>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{width: `${(step / 4) * 100}%`}}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <h3 className="font-semibold text-red-800 mb-2">🚨 Connection Error Detected</h3>
              <p className="text-red-700 mb-3">{error}</p>
              <button 
                onClick={() => {
                  setResults([]);
                  setError(null);
                  setStep(0);
                  testConnection();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                🔄 Retry Test
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">📋 Test Results:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
              {results.length === 0 ? (
                <p className="text-gray-400">Initializing tests...</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => {
                setResults([]);
                setError(null);
                setStep(0);
                testConnection();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
            >
              🔄 Run Test Again
            </button>
            <a 
              href="/admin" 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
            >
              🎯 Go to Admin Dashboard
            </a>
            <a 
              href="http://localhost:9000" 
              target="_blank"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
            >
              🔧 Open Enhanced Server
            </a>
            <a 
              href="/beta-shop" 
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-center"
            >
              🛍️ View Beta Shop
            </a>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold text-blue-800 mb-2">🔍 What this debug tool checks:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
              <li>Next.js application health and API connectivity</li>
              <li>Enhanced Medusa Server availability (port 9000)</li>
              <li>Products API endpoint functionality and data</li>
              <li>CORS configuration and cross-origin requests</li>
              <li>JSON parsing and data structure validation</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="font-semibold text-yellow-800 mb-2">💡 Common issues and solutions:</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
              <li><strong>Enhanced Server not running:</strong> <code>cd packages/medusa && node enhanced-server.js</code></li>
              <li><strong>CORS errors:</strong> Server already configured for localhost:3005</li>
              <li><strong>Network timeouts:</strong> Check if ports 3005 and 9000 are available</li>
              <li><strong>JSON parsing errors:</strong> Server may be returning HTML instead of JSON</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 