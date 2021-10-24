import { CompanySubscription } from "../domain/CompanySubscription";

import { SubscriptionId } from "../../shared/SubscriptionId";

import { Clock } from "../../shared/common/Clock";
import { SubscriptionRepository } from "../domain/SubscriptionRepository";
import { Ok, Result } from "../../shared/common/Result";

type CreateNewCompanySubscriptionProps = {
  repository: SubscriptionRepository;
  clock: Clock;
  uuid: () => string;
};
export type CreateNewCompanySubscription = ReturnType<typeof CreateNewCompanySubscription>;

export const CreateNewCompanySubscription = ({ repository, clock, uuid }: CreateNewCompanySubscriptionProps) => async ({
  maxNoOfSubscribers,
  maxNoOnWaitingList,
  subscriptionId,
}: {
  maxNoOfSubscribers: number;
  maxNoOnWaitingList: number;
  subscriptionId: string;
}): Promise<Result<void, void>> => {
  await repository.createNew(
    CompanySubscription({
      clock,
      uuid,
      maxNoOfSubscribers,
      maxNoOnWaitingList,
      kind: "New",
      subscriptionId: SubscriptionId(subscriptionId),
    })
  );
  return Ok(undefined);
};
