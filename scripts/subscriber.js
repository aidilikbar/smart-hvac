require("dotenv").config();
const { EventHubConsumerClient } = require("@azure/event-hubs");

const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
const eventHubName = process.env.EVENT_HUB_NAME;
const consumerGroup = "$Default"; // standard consumer group

async function main() {
  const client = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

  console.log("📡 Listening for events...");

  client.subscribe({
    processEvents: async (events, context) => {
      for (const event of events) {
        const data = event.body;
        console.log("📥 Received event:", data);

        // ✅ ALERT CONDITIONS
        if (data.temperature && data.temperature > 30) {
          console.warn("🔥 ALERT: Overheat detected! Temperature is", data.temperature + "°C");
        }

        if (data.humidity && data.humidity > 70) {
          console.warn("💧 ALERT: High humidity detected! Humidity is", data.humidity + "%");
        }

        if (data.status && data.status !== "OK") {
          console.warn("⚠️ ALERT: HVAC system status not OK:", data.status);
        }
      }
    },
    processError: async (err, context) => {
      console.error("❌ Error in subscription:", err);
    },
  });
}

main().catch((err) => {
  console.error("❌ Error starting subscriber:", err);
});