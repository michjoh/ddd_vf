import { Event, EventHandler } from "./DomainEventPublisher";

const DomainEventPublisher = () => {
  return {
    on(eventConstructor: string, handler: EventHandler) {},
    publish(event: Event) {},
  };
};

module.exports = DomainEventPublisher;
