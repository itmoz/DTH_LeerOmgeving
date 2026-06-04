// server/events/publisher.js
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({});

export async function publishDomainEvent({ source, detailType, detail }) {
  const params = {
    Entries: [
      {
        Source: source,
        DetailType: detailType,
        Detail: JSON.stringify(detail),
      },
    ],
  };

  await client.send(new PutEventsCommand(params));
}