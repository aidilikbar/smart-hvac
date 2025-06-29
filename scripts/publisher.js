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

// Generate SAREF-Compliant Telemetry
function generateTelemetryData() {
  const temperature = 20 + Math.random() * 10;
  const humidity = 40 + Math.random() * 20;
  const energy = (temperature * 0.15 + humidity * 0.05).toFixed(2);
  const now = new Date().toISOString();
  const latitude = 52.2394;
  const longitude = 6.8529;

  return {
    "@context": "https://saref.etsi.org/core",
    "@type": "saref:Sensor",
    timestamp: now,
    temperature: temperature.toFixed(2),
    humidity: humidity.toFixed(1),
    energy: energy,
    status: "OK",
    location: {
      latitude,
      longitude
    },
    "saref:measuresProperty": {
      temperature: {
        "@type": "saref:Temperature",
        "saref:hasValue": temperature.toFixed(2),
        "saref:hasUnit": "Celsius"
      },
      humidity: {
        "@type": "saref:Humidity",
        "saref:hasValue": humidity.toFixed(1),
        "saref:hasUnit": "Percent"
      },
      energy: {
        "@type": "saref:Energy",
        "saref:hasValue": energy,
        "saref:hasUnit": "kWh"
      }
    }
  };
}

// Save core data to DB (JSON-LD is not saved in full)
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

// Send to Azure + Save to DB
async function sendEvent() {
  const eventData = generateTelemetryData();

  const batch = await producer.createBatch();
  batch.tryAdd({ body: eventData });

  await producer.sendBatch(batch);
  console.log("🚀 SAREF Event sent:", eventData);

  await saveToDatabase(eventData);
}

// Repeat every second
console.log("⏳ Publishing SAREF-formatted telemetry data every 1 second...");
setInterval(() => {
  sendEvent().catch((err) => {
    console.error("❌ Error sending event:", err);
  });
}, 1000);