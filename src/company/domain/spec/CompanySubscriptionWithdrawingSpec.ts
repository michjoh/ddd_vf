import assert from "assert";

import { aCompanySubscription } from "./CompanySubscriptionFixture";

import { SubscriberWithdrawn } from "../SubscriberWithdrawn";

import { SubscriberEnrolled } from "../SubscriberEnrolled";

import { SubscriberId } from "../../../shared/SubscriberId";

import { generate } from "../../../shared/common/Uuid";
import { Ok } from "../../../shared/common/Result";

const SOME_DATE = new Date(2000, 0, 2);
const clock = {
  now() {
    return SOME_DATE;
  },
};
const UUID = "41d15802-e685-4857-839b-d09e301368fe";
const uuid = () => UUID;
const SUBSCRIBER_ID = SubscriberId("df36ffc0-7d4d-4b61-9ff8-ba1e63ea39c9");
const anySubscriber = () => SubscriberId(generate());

describe.skip("Company subscription withdrawing", () => {
  it("a subscriber can withdraw from a company subscription", () => {
    const sub = aCompanySubscription({ uuid, clock });
    sub.activate();
    sub.enroll(SUBSCRIBER_ID);

    const result = sub.withdraw(SUBSCRIBER_ID);

    assert.deepStrictEqual(
      result,
      Ok([
        new SubscriberWithdrawn({
          uuid: UUID,
          subscriptionId: sub.id,
          subscriberId: SUBSCRIBER_ID,
          timestamp: SOME_DATE,
        }),
      ])
    );
  });

  it("withdrawing from company subscription should increase capacity left", () => {
    const sub = aCompanySubscription({ maxNoOfSubscribers: 1, maxNoOnWaitingList: 1 });
    sub.enroll(SUBSCRIBER_ID);

    sub.withdraw(SUBSCRIBER_ID);

    assert.deepStrictEqual(sub.capacityLeft(), { participants: 1, waitingList: 1 });
  });

  it("withdrawing from company subscription should increase capacity left", () => {
    const sub = aCompanySubscription({ maxNoOfSubscribers: 0, maxNoOnWaitingList: 1 });
    sub.enroll(SUBSCRIBER_ID);

    sub.withdraw(SUBSCRIBER_ID);

    assert.deepStrictEqual(sub.capacityLeft(), { participants: 0, waitingList: 1 });
  });

  it("withdrawing is idempotent", () => {
    const sub = aCompanySubscription({ clock });
    sub.enroll(SUBSCRIBER_ID);
    sub.withdraw(SUBSCRIBER_ID);
    const capacityAfter1stWithdrawing = sub.capacityLeft();

    sub.withdraw(SUBSCRIBER_ID);

    assert.deepStrictEqual(sub.capacityLeft(), capacityAfter1stWithdrawing);
  });

  it("withdrawing should move 1st person from waiting list to subscribers", () => {
    const sub = aCompanySubscription({ clock, uuid, maxNoOfSubscribers: 1, maxNoOnWaitingList: 1 });
    const firstSubscriber = anySubscriber();
    const secondSubscriber = anySubscriber();
    sub.enroll(firstSubscriber);
    sub.enroll(secondSubscriber);

    const result = sub.withdraw(firstSubscriber);

    assert.deepStrictEqual(sub.capacityLeft(), { participants: 0, waitingList: 1 });
    assert.deepStrictEqual(
      result,
      Ok([
        new SubscriberWithdrawn({
          uuid: UUID,
          subscriberId: firstSubscriber,
          subscriptionId: sub.id,
          timestamp: SOME_DATE,
        }),
        new SubscriberEnrolled({
          uuid: UUID,
          subscriberId: secondSubscriber,
          subscriptionId: sub.id,
          timestamp: SOME_DATE,
        }),
      ])
    );
  });
});
