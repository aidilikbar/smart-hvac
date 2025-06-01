const mockTwins = {
  "hvac-ct-x100": {
    manufacturer: "CoolTech Industries",
    model: "CT-HVAC-X100",
    serialNumber: "CT2024HVAC0001",
    energyEfficiencyRating: "A++",
    firmwareVersion: "v2.1.5",
    installationDate: "2024-04-01",
    recyclability: "85%",
  },
  "hvac-pro-2000": {
    manufacturer: "SmartAir Inc.",
    model: "Pro-2000",
    serialNumber: "SA2023PRO2000",
    energyEfficiencyRating: "A+",
    firmwareVersion: "v1.9.8",
    installationDate: "2023-08-12",
    recyclability: "90%",
  }
};

export function getTwinById(id) {
  return mockTwins[id] || null;
}