const { EventHubProducerClient } = require("@azure/event-hubs");
const { Client } = require("pg");
require("dotenv").config();

// Azure Event Hub
const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
const eventHubName = process.env.EVENT_HUB_NAME;
const producer = new EventHubProducerClient(connectionString, eventHubName);

// PostgreSQL (DigitalOcean)
const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect().then(() => {
  console.log("✅ Connected to PostgreSQL");
}).catch(err => {
  console.error("❌ PostgreSQL connection error:", err);
});

// Generate Telemetry
function generateTelemetryData() {
  const temperature = 20 + Math.random() * 10;
  const humidity = 40 + Math.random() * 20;

  return {
    timestamp: new Date().toISOString(),
    temperature: temperature.toFixed(2),
    humidity: humidity.toFixed(1),
    energy: (temperature * 0.15 + humidity * 0.05).toFixed(2),
    status: "OK",
    location: {
      latitude: 52.2394,
      longitude: 6.8529,
    },
  };
}

// Save to DB
async function saveToDatabase(data) {
  const query = `
    INSERT INTO public.telemetry (
      timestamp, temperature, humidity, energy, status, latitude, longitude
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    data.timestamp,
    data.temperature,
    data.humidity,
    data.energy,
    data.status,
    data.location.latitude,
    data.location.longitude,
  ];

  try {
    await db.query(query, values);
    console.log("📦 Data saved to DB");
  } catch (err) {
    console.error("❌ DB insert error:", err);
  }
}

// Publish Event and Save to DB
async function sendEvent() {
  const eventData = generateTelemetryData();

  const batch = await producer.createBatch();
  batch.tryAdd({ body: eventData });

  await producer.sendBatch(batch);
  console.log("🚀 Event sent:", eventData);

  await saveToDatabase(eventData);
}

// ⏱ Run every 1 second
console.log("⏳ Publishing telemetry data every 1 second...");
setInterval(() => {
  sendEvent().catch((err) => {
    console.error("❌ Error sending event:", err);
  });
}, 1000);