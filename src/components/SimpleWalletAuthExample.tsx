import React, { useState } from 'react';
import { useSimpleWalletAuth } from '../hooks/useSimpleWalletAuth';

const SimpleWalletAuthExample: React.FC = () => {
  const { makeAuthenticatedRequest, isConnected, walletAddress } = useSimpleWalletAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAffiliateCheck = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await makeAuthenticatedRequest(
        `/api/affiliate/check/${walletAddress}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testAcceptTerms = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await makeAuthenticatedRequest(
        '/api/affiliate/accept-terms',
        {
          method: 'POST',
          body: JSON.stringify({}),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Simple Wallet Authentication Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Wallet Status:</strong> {isConnected ? 'Connected' : 'Not Connected'}
        </p>
        {walletAddress && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Wallet Address:</strong> {walletAddress}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={testAffiliateCheck}
          disabled={!isConnected || loading}
          className="btn btn-primary mr-2"
        >
          {loading ? 'Loading...' : 'Test Affiliate Check'}
        </button>

        <button
          onClick={testAcceptTerms}
          disabled={!isConnected || loading}
          className="btn btn-secondary"
        >
          {loading ? 'Loading...' : 'Test Accept Terms'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Success:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• No signing required - just uses your connected wallet address</li>
          <li>• Validates the wallet address format on the server</li>
          <li>• Automatically includes the wallet address in request headers</li>
          <li>• Much simpler and faster than signature-based auth</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleWalletAuthExample;
