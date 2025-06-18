// src/api/twin/[twinId].js
export default async function handler(req, res) {
  const {
    query: { twinId },
  } = req;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simulated response from Azure Digital Twins
  const dpp = {
    manufacturer: "CoolTech Industries",
    model: "CT-HVAC-X100",
    serialNumber: "CT2024HVAC0001",
    energyEfficiencyRating: "A++",
    firmwareVersion: "v2.1.5",
    installationDate: "2024-04-01",
    recyclability: "85%",
  };

  res.status(200).json(dpp);
}