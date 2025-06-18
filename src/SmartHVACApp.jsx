// src/SmartHVACApp.jsx
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const EVENT_HUB_API = "/api/events"; // TODO: replace with actual API route if applicable

export default function SmartHVACApp() {
  const [twinId, setTwinId] = useState("hvac-ct-x100");
  const [twinData, setTwinData] = useState(null);
  const [telemetry, setTelemetry] = useState([]);

  const fetchTwinData = async () => {
    try {
      const response = await fetch(`/api/twin/${twinId}`);
      const data = await response.json();
      setTwinData(data);
    } catch (error) {
      console.error("Error fetching twin data:", error);
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(EVENT_HUB_API);
        const data = await res.json();
        if (data && data.timestamp) {
          setTelemetry((prev) => {
            const updated = [...prev, data];
            return updated.slice(-10); // limit to 10 entries
          });
        }
      } catch (error) {
        console.error("Failed to fetch telemetry:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Smart HVAC Dashboard</h1>

      <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
        <div className="flex gap-2">
          <input
            className="border p-2 flex-grow rounded"
            value={twinId}
            onChange={(e) => setTwinId(e.target.value)}
            placeholder="Enter Twin ID"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={fetchTwinData}
          >
            Fetch
          </button>
        </div>
      </div>

      {twinData && (
        <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
          <h2 className="text-xl font-semibold mb-2">Digital Product Passport</h2>
          <p><strong>Manufacturer:</strong> {twinData.manufacturer}</p>
          <p><strong>Model:</strong> {twinData.model}</p>
          <p><strong>Serial Number:</strong> {twinData.serialNumber}</p>
          <p><strong>Energy Rating:</strong> {twinData.energyEfficiencyRating}</p>
          <p><strong>Firmware:</strong> {twinData.firmwareVersion}</p>
          <p><strong>Installation Date:</strong> {twinData.installationDate}</p>
          <p><strong>Recyclability:</strong> {twinData.recyclability}</p>
          <div className="mt-4">
            <QRCode value={twinId} size={100} />
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded p-4 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Live Telemetry</h2>
        {telemetry.length === 0 ? (
          <p className="text-gray-500">Waiting for events...</p>
        ) : (
          <ul className="space-y-2">
            {telemetry.map((entry, idx) => (
              <li key={idx} className="text-sm font-mono">
                🕒 {entry.timestamp} | 🌡 Temp: {entry.temperature}°C | 💧 Humidity: {entry.humidity}% | Status: {entry.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}