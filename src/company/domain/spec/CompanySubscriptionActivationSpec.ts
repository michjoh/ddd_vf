import assert from "assert";

import { CompanySubscriptionActivated } from "../CompanySubscriptionActivated";

import { CompanySubscriptionDisabled } from "../CompanySubscriptionDisabled";

import { SubscriptionId } from "../../../shared/SubscriptionId";

import { aCompanySubscription } from "./CompanySubscriptionFixture";
import { Ok } from "../../../shared/common/Result";

const SOME_DATE = new Date(2000, 0, 2);
const clock = {
  now() {
    return SOME_DATE;
  },
};
const UUID = "41d15802-e685-4857-839b-d09e301368fe";
const uuid = () => UUID;
const SUBSCRIPTION_ID = SubscriptionId("52e1044f-f97c-486b-8e80-d19162f4aad3");

describe("Company subscription activation", () => {
  it("a newly created subscription is by definition activated", () => {
    assert.ok(aCompanySubscription().isActive());
  });

  it("system or company manager can activate a company subscription at any given point of time", () => {
    const sub = aCompanySubscription({ clock, uuid, subscriptionId: SUBSCRIPTION_ID });
    sub.disable();

    const result = sub.activate();

    assert.deepStrictEqual(
      result,
      Ok([new CompanySubscriptionActivated({ uuid: UUID, subscriptionId: SUBSCRIPTION_ID, timestamp: SOME_DATE })])
    );
  });

  it("system or company manager can disable a company subscription at any given point of time", () => {
    const sub = aCompanySubscription({ clock, uuid, subscriptionId: SUBSCRIPTION_ID });

    const result = sub.disable();

    assert.deepStrictEqual(
      result,
      Ok([new CompanySubscriptionDisabled({ uuid: UUID, subscriptionId: SUBSCRIPTION_ID, timestamp: SOME_DATE })])
    );
  });
});
