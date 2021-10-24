import { InMemorySubscriptionRepository } from "../infrastructure/InMemorySubscriptionRepository";

import { EnrollToCompanySubscription } from "./EnrollToCompanySubscriptionService";

import { CreateNewCompanySubscription } from "./CreateNewCompanySubscriptionService";

import { SubscriptionFacade } from "./CompanySubscriptionFacade";
import { Clock } from "../../shared/common/Clock";

import { DomainEventPublisher } from "../../shared/common/DomainEventPublisher";

import { CompanySubscription } from "../domain/CompanySubscription";

export const SubscriptionConfig = ({ clock, uuid }: { clock: Clock; uuid: () => string }) => {
  const companySubscriptionRepository = InMemorySubscriptionRepository({
    // @ts-ignore
    fromSnapshot: CompanySubscription.fromSnapshot({ clock, uuid }),
  });
  const enrollToCompanySubscription = EnrollToCompanySubscription({
    repository: companySubscriptionRepository,
  });

  const createNewCompanySubscription = CreateNewCompanySubscription({
    repository: companySubscriptionRepository,
    clock,
    uuid,
  });

  const subscriptionFacade = SubscriptionFacade({
    createNewCompanySubscription,
    enrollToCompanySubscription,
    companySubscriptionRepository,
  });

  return {
    subscriptionFacade,
    close: () => {},
    companySubscriptionRepository,
  };
};
