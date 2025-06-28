import { useEffect, useState } from "react";
import axios from 'axios';
import QRCode from "react-qr-code";

const EVENT_HUB_API = "/api/events";

export default function SmartHVACApp() {
  const [twinId, setTwinId] = useState("hvac-ct-x100");
  const [twinData, setTwinData] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [controlMessage, setControlMessage] = useState('');
  const [dpp, setDpp] = useState(null);

  const handleStart = async () => {
    try {
      const res = await axios.get('http://localhost:3000/control/start');
      setControlMessage(res.data.message || 'Started!');
    } catch (err) {
      setControlMessage('Failed to start HVAC.');
    }
  };

  const handleStop = async () => {
    try {
      const res = await axios.get('http://localhost:3000/control/stop');
      setControlMessage(res.data.message || 'Stopped!');
    } catch (err) {
      setControlMessage('Failed to stop HVAC.');
    }
  };

  const fetchTwinData = async () => {
    try {
      const twinRes = await axios.get(`/api/twin/${twinId}`);
      setDpp(twinRes.data); // Store DPP in state
      setControlMessage("Twin data fetched successfully!");
    } catch (err) {
      console.error(err);
      setControlMessage("Failed to fetch twin data.");
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  useEffect(() => {
    if (telemetry.length > 0) {
      const latest = telemetry[telemetry.length - 1];
      if (latest.location) {
        setLocation(latest.location);
      }
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

      {dpp && (
        <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
          <h3 className="text-lg font-semibold mb-2">Digital Product Passport (DPP)</h3>
          
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
            <div>
              <dt className="font-medium text-gray-900">Manufacturer</dt>
              <dd>{dpp.manufacturer}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Model</dt>
              <dd>{dpp.model}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Serial Number</dt>
              <dd>{dpp.serialNumber}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Product Code</dt>
              <dd>{dpp.productCode}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Certifications</dt>
              <dd>{dpp.markings.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Year</dt>
              <dd>{dpp.yearOfManufacture}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Firmware</dt>
              <dd>{dpp.firmwareVersion}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Installed</dt>
              <dd>{dpp.installationDate}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Efficiency</dt>
              <dd>{dpp.energyEfficiencyRating}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Voltage</dt>
              <dd>{dpp.ratedVoltage}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Current</dt>
              <dd>{dpp.ratedCurrent}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Power</dt>
              <dd>{dpp.powerConsumption}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Temp Range</dt>
              <dd>{dpp.minOperatingTemp} to {dpp.maxOperatingTemp}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Size</dt>
              <dd>{dpp.height} x {dpp.width} x {dpp.depth}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Weight</dt>
              <dd>{dpp.weight}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Material</dt>
              <dd>{dpp.housingMaterial}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Color</dt>
              <dd>{dpp.color}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Recyclability</dt>
              <dd>{dpp.recyclability}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Carbon Footprint</dt>
              <dd>{dpp.carbonFootprint}</dd>
            </div>
          </dl>
        </div>
      )}

      {location && (
        <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
          <h2 className="text-xl font-semibold mb-2">Device Location</h2>
          <iframe
            title="HVAC Location"
            width="100%"
            height="300"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01}%2C${location.latitude - 0.01}%2C${location.longitude + 0.01}%2C${location.latitude + 0.01}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
            style={{ borderRadius: '0.5rem' }}
          ></iframe>
          <p className="mt-2 text-sm text-gray-600">
            Lat: {location.latitude}, Lng: {location.longitude}
          </p>
        </div>
      )}

      {twinData && (
        <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Digital Twin</h2>
          <div className="flex justify-center items-center gap-12">
            {/* POWER ICON */}
            <div className="flex flex-col items-center">
              <img
                src="/power.svg"
                alt="Power Icon"
                className="w-10 h-10"
                style={{
                  filter: (() => {
                    if (!telemetry.length) return 'invert(28%) sepia(95%) saturate(950%) hue-rotate(-25deg)';
                    const latest = telemetry[0];
                    return latest.status === 'OK'
                      ? 'invert(58%) sepia(75%) saturate(600%) hue-rotate(90deg)'
                      : 'invert(28%) sepia(95%) saturate(950%) hue-rotate(-25deg)';
                  })()
                }}
              />
              <p className="text-sm text-gray-600 mt-1">Power</p>
            </div>
            {/* FAN ICON */}
            <div className="flex flex-col items-center">
              <img
                src="/fan.svg"
                alt="Fan Icon"
                className={`w-10 h-10 ${telemetry.length && telemetry[0].status === 'OK' ? 'animate-spin-slow' : ''}`}
                style={{
                  filter: (() => {
                    if (!telemetry.length) return 'invert(0%)';
                    const latest = telemetry[0];
                    if (latest.status !== 'OK') return 'invert(0%)';
                    return latest.temperature <= 21
                      ? 'invert(25%) sepia(100%) saturate(700%) hue-rotate(-50deg)'
                      : 'invert(40%) sepia(100%) saturate(1000%) hue-rotate(190deg)';
                  })()
                }}
              />
              <p className="text-sm text-gray-600 mt-1">Fan</p>
            </div>
            {/* HUMIDITY ICON */}
            <div className="flex flex-col items-center">
              <img
                src="/humidity.svg"
                alt="Humidity Icon"
                className="w-10 h-10"
                style={{
                  filter: (() => {
                    if (!telemetry.length) return 'invert(0%)';
                    const latest = telemetry[0];
                    return latest.humidity <= 50
                      ? 'invert(70%) sepia(50%) saturate(1000%) hue-rotate(90deg)'
                      : 'invert(60%) sepia(70%) saturate(800%) hue-rotate(10deg)';
                  })()
                }}
              />
              <p className="text-sm text-gray-600 mt-1">Humidifier</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded p-4 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Live Telemetry</h2>
        {telemetry.map((item, index) => (
          <div key={index} className="mb-4 text-sm border-b pb-2">
            <p><strong>Time:</strong> {item.timestamp}</p>
            <p><strong>Temperature:</strong> {item.temperature}°C</p>
            <p><strong>Humidity:</strong> {item.humidity}%</p>
            <p><strong>Energy:</strong> {item.energy} kWh</p>
            <p><strong>Status:</strong> {item.status}</p>
          </div>
        ))}
      </div>
      {loading && <p className="mt-4 text-blue-600">Loading...</p>}
    </div>
  );
}