import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";

const EVENT_HUB_API = "/api/events";

export default function SmartHVACApp() {
  const [twinId, setTwinId] = useState("hvac-ct-x100");
  const [twinData, setTwinData] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const fetchTwinData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/twin/${twinId}`);
      const data = await response.json();
      setTwinData(data);
    } catch (error) {
      console.error("Error fetching twin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePower = async () => {
    try {
      await axios.post(`/api/twin/${twinId}/toggle-power`);
      console.log("✅ Power toggle command sent");
    } catch (error) {
      console.error("Error sending toggle command:", error);
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  useEffect(() => {
    if (telemetry.length > 0) {
      const latest = telemetry[0];
      if (latest.location) setLocation(latest.location);
    }
  }, [telemetry]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(EVENT_HUB_API);
        const data = await response.json();
        if (data && data.timestamp) {
          setTelemetry((prev) => [data, ...prev.slice(0, 19)]);
        }
      } catch (error) {
        console.error("Event fetch error:", error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Smart HVAC Dashboard - Group 7</h1>

      <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
        <div className="flex gap-2">
          <select
            className="border p-2 flex-grow rounded"
            value={twinId}
            onChange={(e) => setTwinId(e.target.value)}
          >
            <option value="hvac-ct-x100">hvac-ct-x100</option>
          </select>
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

      <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Digital Twin</h2>
        <div className="flex justify-center items-center gap-12">
          {/* Power Icon */}
          <div className="flex flex-col items-center">
            <img
              src="/power.svg"
              className="w-10 h-10"
              style={{
                filter: telemetry[0]?.status === 'OK'
                  ? 'invert(58%) sepia(75%) saturate(600%) hue-rotate(90deg)' // green
                  : 'invert(28%) sepia(95%) saturate(950%) hue-rotate(-25deg)' // red
              }}
            />
            <p className="text-sm text-gray-600 mt-1">Power</p>
          </div>
          {/* Fan Icon */}
          <div className="flex flex-col items-center">
            <img
              src="/fan.svg"
              className={`w-10 h-10 ${telemetry[0]?.status === 'OK' ? 'animate-spin' : ''}`}
              style={{
                filter: (() => {
                  const t = telemetry[0]?.temperature;
                  if (t === undefined) return 'invert(0%)';
                  return t <= 21
                    ? 'invert(25%) sepia(100%) saturate(700%) hue-rotate(-50deg)'
                    : 'invert(40%) sepia(100%) saturate(1000%) hue-rotate(190deg)';
                })()
              }}
            />
            <p className="text-sm text-gray-600 mt-1">Fan</p>
          </div>
          {/* Humidity Icon */}
          <div className="flex flex-col items-center">
            <img
              src="/humidity.svg"
              className="w-10 h-10"
              style={{
                filter: (() => {
                  const h = telemetry[0]?.humidity;
                  if (h === undefined) return 'invert(0%)';
                  return h <= 50
                    ? 'invert(70%) sepia(50%) saturate(1000%) hue-rotate(90deg)' // green
                    : 'invert(60%) sepia(70%) saturate(800%) hue-rotate(10deg)'; // darker green
                })()
              }}
            />
            <p className="text-sm text-gray-600 mt-1">Humidifier</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleTogglePower}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Toggle Power
          </button>
        </div>
      </div>

      {location && (
        <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lon}</p>
          <iframe
            className="mt-2 w-full h-64"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lon-0.01}%2C${location.lat-0.01}%2C${location.lon+0.01}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lon}`}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}

      <div className="bg-white shadow rounded p-4 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Live Telemetry</h2>
        {telemetry.length === 0 ? (
          <p className="text-gray-500">Waiting for events...</p>
        ) : (
          <ul className="text-sm">
            {telemetry.map((e, i) => (
              <li key={i} className="mb-2 border-b pb-2">
                <div><strong>Time:</strong> {e.timestamp}</div>
                <div><strong>Temperature:</strong> {e.temperature}&#8451;</div>
                <div><strong>Humidity:</strong> {e.humidity}%</div>
                <div><strong>Status:</strong> {e.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="mt-4 text-blue-600">Loading...</p>}
    </div>
  );
}