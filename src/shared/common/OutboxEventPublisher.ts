import { ClientSession, Db } from "mongodb";
import { Event } from "./DomainEventPublisher";

type OutboxDomainEventPublisherParams = {
  db: Db;
  session?: ClientSession;
};

export const OutboxEventPublisher = ({ db, session }: OutboxDomainEventPublisherParams) => {
  const events = db.collection("domain_events");

  return {
    async publish(event: Event) {
      return events.insertOne(event, { session });
    },
    async on() {},
  };
};
