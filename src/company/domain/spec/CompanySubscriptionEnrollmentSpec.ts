import assert from "assert";

import { aCompanySubscription } from "./CompanySubscriptionFixture";

import { SubscriberEnrolled } from "../SubscriberEnrolled";

import { SubscriberAddedToWaitingList } from "../SubscriberAddedToWaitingList";

import { SubscriberId } from "../../../shared/SubscriberId";

import { generate } from "../../../shared/common/Uuid";
import { Ok, Error } from "../../../shared/common/Result";

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

describe("Company subscription enrollment", () => {
  it("a subscriber can enroll to an active company subscription if there is a place", () => {
    const sub = aCompanySubscription({ clock, uuid });
    sub.activate();

    const enrollment = sub.enroll(SUBSCRIBER_ID);

    assert.deepStrictEqual(
      enrollment,
      Ok([
        new SubscriberEnrolled({
          uuid: UUID,
          subscriptionId: sub.id,
          subscriberId: SUBSCRIBER_ID,
          timestamp: SOME_DATE,
        }),
      ])
    );
  });

  it("enrolling decreases left capacity", () => {
    const sub = aCompanySubscription({ maxNoOfSubscribers: 1, maxNoOnWaitingList: 1 });
    sub.activate();

    sub.enroll(SUBSCRIBER_ID);

    assert.deepStrictEqual(sub.capacityLeft(), { participants: 0, waitingList: 1 });
  });

  it("enrolling should be idempotent", () => {
    const sub = aCompanySubscription();
    sub.activate();
    sub.enroll(SUBSCRIBER_ID);
    const capacityAfter1stEnrollment = sub.capacityLeft();

    const enrollment = sub.enroll(SUBSCRIBER_ID);

    assert.deepStrictEqual(enrollment.kind, "Ok");
    assert.deepStrictEqual(sub.capacityLeft(), capacityAfter1stEnrollment);
  });

  it("a subscriber can not enroll to a company subscription if subscription is not active", () => {
    const sub = aCompanySubscription();
    sub.disable();

    const result = sub.enroll(SUBSCRIBER_ID);

    assert.deepStrictEqual(result, Error("Subscription is not active"));
  });

  it("when there is space only on the waiting list, should automatically enroll there", () => {
    const sub = aCompanySubscription({ clock, maxNoOfSubscribers: 1, maxNoOnWaitingList: 1 });
    sub.enroll(anySubscriber());

    const enrollment = sub.enroll(SUBSCRIBER_ID);

    assert.deepStrictEqual(
      enrollment,
      Ok([
        new SubscriberAddedToWaitingList({
          uuid: UUID,
          subscriptionId: sub.id,
          subscriberId: SUBSCRIBER_ID,
          timestamp: SOME_DATE,
        }),
      ])
    );
    assert.deepStrictEqual(sub.capacityLeft(), { participants: 0, waitingList: 0 });
  });

  it("cannot enroll to a company subscription when there is no place and waiting list is full", () => {
    const sub = aCompanySubscription({ maxNoOfSubscribers: 2, maxNoOnWaitingList: 1 });
    sub.enroll(anySubscriber());
    sub.enroll(anySubscriber());
    sub.enroll(anySubscriber());

    const enrollment = sub.enroll(SUBSCRIBER_ID);

    assert.deepStrictEqual(enrollment, Error("Not enough space"));
  });
});
