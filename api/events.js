import { EventHubConsumerClient } from "@azure/event-hubs";

export default async function handler(req, res) {
  const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
  const eventHubName = process.env.EVENT_HUB_NAME;

  const client = new EventHubConsumerClient(
    "$Default", // Consumer group
    connectionString,
    eventHubName
  );

  let receivedEvent;

  const subscription = client.subscribe({
    processEvents: async (events) => {
      if (events.length > 0) {
        receivedEvent = events[0];
        await subscription.close(); // Stop after first event
        await client.close();
        res.status(200).json(receivedEvent.body);
      }
    },
    processError: async (err) => {
      console.error("Error receiving event:", err);
      res.status(500).json({ error: "Failed to receive events" });
    },
  });

  // Safety timeout in case no event is received
  setTimeout(async () => {
    await subscription.close();
    await client.close();
    res.status(408).json({ error: "Timeout: No events received" });
  }, 3000);
}