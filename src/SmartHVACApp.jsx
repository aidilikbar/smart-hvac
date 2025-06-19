import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

const SmartHVACApp = () => {
  const [telemetry, setTelemetry] = useState([]);
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState('hvac-ct-x100');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await axios.get(`/api/twin/${deviceId}`);
        setTwinData(res.data);
        setTelemetry(res.data.telemetry || []);
        if (res.data.telemetry?.length > 0) {
          const latest = res.data.telemetry[res.data.telemetry.length - 1];
          if (latest.location) setLocation(latest.location);
        }
      } catch (error) {
        console.error('Failed to fetch twin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, [deviceId]);

  const handleTogglePower = async () => {
    try {
      await axios.post(`/api/twin/${deviceId}/toggle-power`);
      alert('Power toggle command sent');
    } catch (err) {
      console.error('Error sending toggle command:', err);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Smart HVAC Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="device-select" className="mr-2 font-medium">Select Device:</label>
        <select
          id="device-select"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="hvac-ct-x100">hvac-ct-x100</option>
        </select>
      </div>

      {loading && <p className="mt-4 text-blue-600">Loading...</p>}

      {twinData && (
        <>
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
              <QRCode value={deviceId} size={100} />
            </div>
          </div>

          <div className="bg-white shadow rounded p-4 w-full max-w-xl mb-6">
            <h2 className="text-xl font-semibold mb-2">Digital Twin</h2>
            <div className="flex justify-center items-center gap-12">
              {/* Power Icon */}
              <div className="flex flex-col items-center">
                <img
                  src="/power.svg"
                  alt="Power Icon"
                  className="w-10 h-10"
                  style={{
                    filter: (() => {
                      if (!telemetry.length) return 'invert(28%) sepia(95%) saturate(950%) hue-rotate(-25deg)';
                      const latest = telemetry[telemetry.length - 1];
                      return latest.status === 'OK'
                        ? 'invert(58%) sepia(75%) saturate(600%) hue-rotate(90deg)'
                        : 'invert(28%) sepia(95%) saturate(950%) hue-rotate(-25deg)';
                    })()
                  }}
                />
                <p className="text-sm text-gray-600 mt-1">Power</p>
              </div>

              {/* Fan Icon */}
              <div className="flex flex-col items-center">
                <img
                  src="/fan.svg"
                  alt="Fan Icon"
                  className={`w-10 h-10 ${telemetry[telemetry.length - 1]?.status === 'OK' ? 'animate-spin-slow' : ''}`}
                  style={{
                    filter: (() => {
                      if (!telemetry.length) return 'invert(0%)';
                      const latest = telemetry[telemetry.length - 1];
                      if (latest.status !== 'OK') return 'invert(0%)';
                      return latest.temperature <= 21
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
                  alt="Humidity Icon"
                  className="w-10 h-10"
                  style={{
                    filter: (() => {
                      if (!telemetry.length) return 'invert(0%)';
                      const latest = telemetry[telemetry.length - 1];
                      return latest.humidity <= 50
                        ? 'invert(70%) sepia(50%) saturate(1000%) hue-rotate(90deg)'
                        : 'invert(60%) sepia(70%) saturate(800%) hue-rotate(10deg)';
                    })()
                  }}
                />
                <p className="text-sm text-gray-600 mt-1">Humidifier</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleTogglePower}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Toggle Power
              </button>
            </div>
          </div>
        </>
      )}

      {/* Live Telemetry */}
      <div className="bg-white shadow rounded p-4 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Live Telemetry</h2>
        {telemetry.length === 0 ? (
          <p className="text-gray-500">Waiting for events...</p>
        ) : (
          <ul className="text-sm">
            {[...telemetry].reverse().map((e, i) => (
              <li key={i} className="mb-2 border-b pb-2">
                <div><strong>Time:</strong> {e.timestamp}</div>
                <div><strong>Temperature:</strong> {e.temperature}°C</div>
                <div><strong>Humidity:</strong> {e.humidity}%</div>
                <div><strong>Status:</strong> {e.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Location Map */}
      {location && (
        <div className="bg-white shadow rounded p-4 w-full max-w-xl mt-6">
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
    </div>
  );
};

export default SmartHVACApp;