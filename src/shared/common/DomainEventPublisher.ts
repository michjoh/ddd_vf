import EventEmitter from "emittery";

export type Event = { name: string };
export type EventHandler = (eventData?: any) => void;

export type DomainEventPublisher = {
  publish(event: Event): Promise<any>;
  on(eventName: string, handler: EventHandler): void;
};

export const DomainEventPublisher = (): DomainEventPublisher => {
  const emitter = new EventEmitter();

  return {
    on(eventName: string, handler: EventHandler) {
      emitter.on(eventName, handler);
    },
    publish(event: Event) {
      return emitter.emit(event.name, event);
    },
  };
};
