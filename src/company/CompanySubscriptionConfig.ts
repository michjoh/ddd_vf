import { SubscriptionController } from "./api/SubscriptionController";

import { SubscriptionRoutes } from "./api/SubscriptionRoutes";
import { SubscriptionFacade } from "./application/CompanySubscriptionFacade";

export const CompanySubscriptionRoutes = (subscriptionFacade: SubscriptionFacade) => {
  return SubscriptionRoutes(SubscriptionController(subscriptionFacade));
};
