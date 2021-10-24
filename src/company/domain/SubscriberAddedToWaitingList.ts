export class SubscriberAddedToWaitingList {
  readonly eventId: string;
  readonly subscriptionId: string;
  readonly subscriberId: string;
  readonly timestamp: Date;
  readonly name: string;
  constructor({
    uuid,
    subscriptionId,
    subscriberId,
    timestamp,
  }: {
    uuid: string;
    subscriptionId: string;
    subscriberId: string;
    timestamp: Date;
  }) {
    this.eventId = uuid;
    this.subscriptionId = subscriptionId;
    this.subscriberId = subscriberId;
    this.timestamp = timestamp;
    this.name = "SubscriberAddedToWaitingList";
  }
}
