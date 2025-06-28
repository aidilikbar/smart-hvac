const { EventHubProducerClient } = require("@azure/event-hubs");
require("dotenv").config();

const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
const eventHubName = process.env.EVENT_HUB_NAME;

const producer = new EventHubProducerClient(connectionString, eventHubName);

function generateTelemetryData() {
  const temperature = 20 + Math.random() * 10;
  const humidity = 40 + Math.random() * 20;

  return {
    timestamp: new Date().toISOString(),
    temperature: temperature.toFixed(2), //°C (Celsius)
    humidity: humidity.toFixed(1), //% (percentage)
    energy: (temperature * 0.15 + humidity * 0.05).toFixed(2), //kWh (kilowatt-hours)
    status: "OK",
    location: {
      latitude: 52.2394,
      longitude: 6.8529
    }
  };
}

async function sendEvent() {
  const eventData = generateTelemetryData();

  const batch = await producer.createBatch();
  batch.tryAdd({ body: eventData });

  await producer.sendBatch(batch);
  console.log("✅ Event sent:", eventData);
}

// ⏱ Run every 1 second
console.log("🚀 Publishing telemetry data every 1 second...");
setInterval(() => {
  sendEvent().catch((err) => {
    console.error("❌ Error sending event:", err);
  });
}, 1000);