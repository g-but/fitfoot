'use client';

import { useEffect, useState } from 'react';

export default function SimpleDebug() {
  const [step, setStep] = useState(1);
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
      addResult('Starting connection test...');
      setStep(1);

      // Step 1: Test basic fetch
      addResult('Step 1: Testing basic fetch capability');
      const testResponse = await fetch('/api/health');
      addResult(`Step 1 result: ${testResponse.status} - ${testResponse.statusText}`);
      setStep(2);

      // Step 2: Test enhanced server health
      addResult('Step 2: Testing enhanced server health');
      const healthResponse = await fetch('http://localhost:9000/health', {
        mode: 'cors',
      });
      addResult(`Step 2 result: ${healthResponse.status} - ${healthResponse.statusText}`);
      const healthData = await healthResponse.json();
      addResult(`Step 2 data: ${JSON.stringify(healthData)}`);
      setStep(3);

      // Step 3: Test products endpoint
      addResult('Step 3: Testing products endpoint');
      const productsResponse = await fetch('http://localhost:9000/store/products', {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      addResult(`Step 3 result: ${productsResponse.status} - ${productsResponse.statusText}`);
      
      const productsData = await productsResponse.json();
      addResult(`Step 3 data: Found ${productsData.products?.length || 0} products`);
      setStep(4);

      addResult('✅ All tests completed successfully!');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addResult(`❌ Error at step ${step}: ${errorMsg}`);
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔧 Admin Dashboard Debug Tool</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Current Step: {step}/4</h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{width: `${(step / 4) * 100}%`}}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Error Detected:</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => {
                  setResults([]);
                  setError(null);
                  setStep(1);
                  testConnection();
                }}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry Test
              </button>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">Running tests...</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button 
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Test Again
            </button>
            <a 
              href="/admin" 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Admin Dashboard
            </a>
            <a 
              href="http://localhost:9000" 
              target="_blank"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Open Enhanced Server
            </a>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>What this test does:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Tests basic Next.js API connectivity</li>
              <li>Tests Enhanced Server health endpoint</li>
              <li>Tests Enhanced Server products endpoint</li>
              <li>Reports any CORS or connection issues</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 