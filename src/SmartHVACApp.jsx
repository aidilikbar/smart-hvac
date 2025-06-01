import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { fetchTwin } from "./api/fakeApi"; // Make sure this file exists

function SmartHVACApp() {
  const [twinId, setTwinId] = useState("hvac-ct-x100");
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTwinData = async () => {
    setLoading(true);
    try {
      const data = await fetchTwin(twinId); // local mock API
      setTwinData(data);
    } catch (error) {
      console.error("Error fetching twin data:", error);
      setTwinData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinData();
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
        <div className="bg-white shadow rounded p-4 w-full max-w-xl">
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

      {loading && <p className="mt-4 text-blue-600">Loading...</p>}
    </div>
  );
}

export default SmartHVACApp;