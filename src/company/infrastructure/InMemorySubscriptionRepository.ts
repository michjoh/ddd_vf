import { SubscriptionRepository } from "../domain/SubscriptionRepository";

export const InMemorySubscriptionRepository = ({ fromSnapshot }: any): SubscriptionRepository => {
  const subscriptions: Record<string, any> = {};
  const api: SubscriptionRepository = {
    async createNew(sub) {
      api.update(sub);
    },
    async update(sub) {
      subscriptions[sub.id] = sub.toSnapshot();
    },
    async findBy(subscriptionId) {
      return subscriptions[subscriptionId] ? fromSnapshot(subscriptions[subscriptionId]) : null;
    },
    async findActive({ subscriberId, subscriptionId }) {
      const found = Object.values(subscriptions).find(
        (sub) =>
          sub.currentEnrollment.subscribers.includes(subscriberId) &&
          sub.currentStatus === "Activated" &&
          sub.subscriptionId === subscriptionId
      );
      return found ? fromSnapshot(found) : null;
    },
  };
  return api;
};
