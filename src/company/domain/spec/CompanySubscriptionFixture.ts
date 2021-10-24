import { CompanySubscription } from "../CompanySubscription";

import { SubscriptionId } from "../../../shared/SubscriptionId";

const UUID = "41d15802-e685-4857-839b-d09e301368fe";
const uuidGenerator = () => UUID;

const SOME_DATE = new Date(2000, 0, 2);
const fakeClock = {
  now() {
    return SOME_DATE;
  },
};
const SUBSCRIPTION_ID = SubscriptionId("52e1044f-f97c-486b-8e80-d19162f4aad3");

export const aCompanySubscription = ({
  clock = fakeClock,
  uuid = uuidGenerator,
  subscriptionId = SUBSCRIPTION_ID,
  maxNoOfSubscribers = 10,
  maxNoOnWaitingList = 2,
} = {}) =>
  CompanySubscription({
    clock,
    uuid,
    maxNoOfSubscribers,
    maxNoOnWaitingList,
    kind: "New",
    subscriptionId,
  });
