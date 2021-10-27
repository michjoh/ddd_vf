import { SubscriptionRepository } from "../domain/SubscriptionRepository";
import { Error } from "../../shared/common/Result";

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
  // find subscription from the repository
  const companySubscription = await repository.findBy(subscriptionId);
  if (!companySubscription) {
    // if the subscription doesn't exist return error
    return Error(`Subscription ${subscriptionId} does not exist`);
  }
  // if the subscription exists enroll subscriber to subscription
  const result = companySubscription.enroll(subscriberId);

  // after domain operation succeeds update the repository
  await repository.update(companySubscription);

  // return the result of the result of domain operation
  return result;
};
