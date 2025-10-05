import { useState } from "react";
import { useToolApi } from "../hooks/useToolApi";

export default function UnitConverter() {
  const api = useToolApi("/tools/converters/unit");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convert() {
    if (!value || value <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post<{ result: number }>("/convert", { value, from, to });
      setResult(res.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Unit Converter</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(+e.target.value)}
            className="input w-full"
            placeholder="Enter value"
            min="0"
            step="any"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="select w-full">
              <option value="m">Meters (m)</option>
              <option value="km">Kilometers (km)</option>
              <option value="ft">Feet (ft)</option>
              <option value="mi">Miles (mi)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="select w-full">
              <option value="m">Meters (m)</option>
              <option value="km">Kilometers (km)</option>
              <option value="ft">Feet (ft)</option>
              <option value="mi">Miles (mi)</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={convert} 
          disabled={loading}
          className="btn w-full"
        >
          {loading ? "Converting..." : "Convert"}
        </button>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {result !== null && !error && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              <strong>Result:</strong> {result.toLocaleString()} {to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}