import { Db } from "mongodb";
import { Event } from "./DomainEventPublisher";

type StreamingOutboxForwarderParams = {
  db: Db;
  publish: (event: Event) => Promise<void>;
};

export const StreamingOutboxForwarder = ({ db, publish }: StreamingOutboxForwarderParams) => {
  const events = db.collection("domain_events");

  const changeStream = events.watch(
    [
      {
        $match: { operationType: "insert" },
      },
    ],
    {}
  );
  changeStream.on("change", async (data: any) => {
    if (!data.fullDocument) return;
    await publish(data.fullDocument);
    // console.log("publishing", data.fullDocument);
    events.deleteOne({ eventId: data.fullDocument.eventId });
  });
  changeStream.on("error", (error) => {
    console.log(error);
  });

  return {
    async close() {
      return changeStream.close();
    },
  };
};
