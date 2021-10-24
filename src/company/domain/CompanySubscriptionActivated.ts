export class CompanySubscriptionActivated {
  readonly eventId: string;
  readonly subscriptionId: string;
  readonly timestamp: Date;
  readonly name: string;
  constructor({ uuid, subscriptionId, timestamp }: { uuid: string; subscriptionId: string; timestamp: Date }) {
    this.eventId = uuid;
    this.subscriptionId = subscriptionId;
    this.timestamp = timestamp;
    this.name = "CompanySubscriptionActivated";
  }
}
