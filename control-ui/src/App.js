import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('Ready');
  const [hvacId, setHvacId] = useState('hvac-ct-x100');

  const handleStart = async () => {
    try {
      const res = await axios.get('http://localhost:3000/control/start');
      setStatus(res.data.message || 'HVAC started.');
    } catch (err) {
      setStatus('Failed to start HVAC.');
    }
  };

  const handleStop = async () => {
    try {
      const res = await axios.get('http://localhost:3000/control/stop');
      setStatus(res.data.message || 'HVAC stopped.');
    } catch (err) {
      setStatus('Failed to stop HVAC.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow rounded p-6 w-full max-w-xl">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Smart HVAC Remote Control
        </h1>
        
        <div className="mb-4">
          <label htmlFor="hvac-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select HVAC ID:
          </label>
          <select
            id="hvac-select"
            className="border p-2 w-full rounded"
            value={hvacId}
            onChange={(e) => setHvacId(e.target.value)}
          >
            <option value="hvac-ct-x100">hvac-ct-x100</option>
          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
          >
            Start HVAC
          </button>
          <button
            onClick={handleStop}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
          >
            Stop HVAC
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-700 font-medium">Status: {status}</p>
      </div>
    </div>
  );
}

export default App;