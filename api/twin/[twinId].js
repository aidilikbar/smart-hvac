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
    productCode: "HVX100-IND",
    markings: ["CE", "TÜV SÜD"],
    yearOfManufacture: "2024",
    firmwareVersion: "v2.1.5",
    installationDate: "2024-04-01",
    energyEfficiencyRating: "A++",
    ratedVoltage: "230 V",
    ratedCurrent: "5 A",
    powerConsumption: "1150 W",
    minOperatingTemp: "-10 °C",
    maxOperatingTemp: "60 °C",
    height: "450 mm",
    width: "300 mm",
    depth: "250 mm",
    weight: "12 kg",
    housingMaterial: "Polycarbonate",
    color: "White-Grey",
    recyclability: "85%",
    carbonFootprint: "9.80 kg CO₂eq",
  };

  res.status(200).json(dpp);
}