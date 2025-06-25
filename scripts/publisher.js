// publisher.js
const express = require("express");
const { EventHubProducerClient } = require("@azure/event-hubs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
let isPublishing = false;

const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
const eventHubName = process.env.EVENT_HUB_NAME;
const producer = new EventHubProducerClient(connectionString, eventHubName);

function generateTelemetryData() {
  return {
    timestamp: new Date().toISOString(),
    temperature: (20 + Math.random() * 10).toFixed(2),
    humidity: (40 + Math.random() * 20).toFixed(1),
    status: "OK",
    location: {
      latitude: 52.2394,
      longitude: 6.8529
    }
  };
}

async function sendEvent() {
  if (!isPublishing) return;
  const eventData = generateTelemetryData();
  const batch = await producer.createBatch();
  batch.tryAdd({ body: eventData });
  await producer.sendBatch(batch);
  console.log("✅ Event sent:", eventData);
}

setInterval(() => {
  sendEvent().catch((err) => console.error("❌ Error sending event:", err));
}, 1000);

// === Express Endpoints ===
app.get("/status", (req, res) => {
  res.json({ publishing: isPublishing });
});

app.post("/start", (req, res) => {
  isPublishing = true;
  res.json({ success: true, message: "Publishing started" });
});

app.post("/stop", (req, res) => {
  isPublishing = false;
  res.json({ success: true, message: "Publishing stopped" });
});

app.listen(port, () => {
  console.log(`🚀 HVAC publisher running at http://localhost:${port}`);
});