import { CompanySubscription } from "./CompanySubscription";

export type SubscriptionRepository = {
  createNew(sub: CompanySubscription): Promise<void>;
  update(sub: CompanySubscription): Promise<void>;
  findBy(subscriptionId: string): Promise<CompanySubscription | null>;
  findActive({
    subscriberId,
    subscriptionId,
  }: {
    subscriberId: string;
    subscriptionId: string;
  }): Promise<CompanySubscription | null>;
};
