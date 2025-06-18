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
        console.log("📥 Received event:", event.body);
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