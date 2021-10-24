import { SubscriptionRepository } from "../domain/SubscriptionRepository";

export type EnrollToCompanySubscriptionProps = {
  repository: SubscriptionRepository;
};

export type EnrollToCompanySubscription = ReturnType<typeof EnrollToCompanySubscription>;
export const EnrollToCompanySubscription = ({ repository }: EnrollToCompanySubscriptionProps) => async ({
  subscriberId,
  subscriptionId,
}: {
  subscriberId: string;
  subscriptionId: string;
}) => {
  // TODO: implement
};
