import { CreateNewCompanySubscription } from "./CreateNewCompanySubscriptionService";
import { EnrollToCompanySubscription } from "./EnrollToCompanySubscriptionService";
import { CompanySubscription } from "../domain/CompanySubscription";
import { SubscriptionRepository } from "../domain/SubscriptionRepository";

type CompanySubscriptionFacadeProps = {
  createNewCompanySubscription: CreateNewCompanySubscription;
  enrollToCompanySubscription: EnrollToCompanySubscription;
  companySubscriptionRepository: SubscriptionRepository;
};

export type SubscriptionFacade = ReturnType<typeof SubscriptionFacade>;
export const SubscriptionFacade = ({
  createNewCompanySubscription,
  enrollToCompanySubscription,
  companySubscriptionRepository,
}: CompanySubscriptionFacadeProps) => {
  return {
    createCompanySubscription({
      maxNoOfSubscribers,
      maxNoOnWaitingList,
      subscriptionId,
    }: {
      maxNoOfSubscribers: number;
      maxNoOnWaitingList: number;
      subscriptionId: string;
    }) {
      return createNewCompanySubscription({ maxNoOfSubscribers, maxNoOnWaitingList, subscriptionId });
    },
    update(sub: CompanySubscription) {
      return companySubscriptionRepository.update(sub);
    },
    enroll({ subscriberId, subscriptionId }: { subscriberId: string; subscriptionId: string }) {
      return enrollToCompanySubscription({ subscriberId, subscriptionId });
    },
    findCompanySubscription(subscriptionId: string) {
      return companySubscriptionRepository.findBy(subscriptionId);
    },
  };
};
