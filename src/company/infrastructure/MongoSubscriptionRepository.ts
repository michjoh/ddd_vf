import { ClientSession, Db } from "mongodb";
import { CompanySubscription } from "../domain/CompanySubscription";
import { SubscriptionRepository } from "../domain/SubscriptionRepository";

type MongoSubscriptionRepositoryProps = {
  db: Db;
  session?: ClientSession;
  fromSnapshot: any;
};

export const MongoSubscriptionRepository = ({
  db,
  session,
  fromSnapshot,
}: MongoSubscriptionRepositoryProps): SubscriptionRepository => {
  const subscriptions = db.collection("company_subscriptions");

  const api = {
    async createNew(sub: CompanySubscription) {
      await subscriptions.insertOne(sub.toSnapshot(), { session });
    },
    async update(sub: CompanySubscription) {
      const snapshot = sub.toSnapshot();
      // @ts-ignore
      const newSub = { ...snapshot };

      const { modifiedCount } = await subscriptions.updateOne(
        // @ts-ignore
        { subscriptionId: snapshot.subscriptionId },
        { $set: newSub },
        { session }
      );
      if (modifiedCount === 0) {
        throw new Error(`Company subscription ${newSub.subscriptionId} must have been modified in the meantime`);
      }
    },
    async findBy(subscriptionId: string) {
      const result = await subscriptions.findOne({ subscriptionId });
      return result ? fromSnapshot(result) : result;
    },
    async findActive({ subscriberId, subscriptionId }: { subscriberId: string; subscriptionId: string }) {
      return subscriptions.findOne({
        currentStatus: "Activated",
        subscriptionId,
        "currentEnrollment.subscribers": subscriberId,
      });
    },
  };
  return api;
};
