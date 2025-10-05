import { useState } from "react";
import { useToolApi } from "../hooks/useToolApi";

interface PingResult {
  rttMs: number;
  success: boolean;
  host: string;
  timestamp: string;
}

export default function NetworkPing() {
  const api = useToolApi("/tools/network/ping");
  const [host, setHost] = useState("google.com");
  const [count, setCount] = useState(4);
  const [results, setResults] = useState<PingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ping() {
    if (!host.trim()) {
      setError("Please enter a valid host");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const res = await api.post<PingResult>("/run", { 
        host: host.trim(), 
        count: Math.max(1, Math.min(10, count)) 
      });
      
      setResults([{
        ...res,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ping failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Network Ping</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Host
          </label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="input w-full"
            placeholder="e.g., google.com, 8.8.8.8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Count (1-10)
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(+e.target.value)}
            className="input w-full"
            min="1"
            max="10"
          />
        </div>
        
        <button 
          onClick={ping} 
          disabled={loading}
          className="btn w-full"
        >
          {loading ? "Pinging..." : "Ping"}
        </button>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Results:</h3>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                    {result.host}
                  </span>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                {result.success && (
                  <p className="text-sm text-green-700 mt-1">
                    RTT: {result.rttMs}ms
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}