import assert from "assert";

import { aCompanySubscription } from "./CompanySubscriptionFixture";

import {CompanySubscription, CompanySubscriptionSnapshot} from "../CompanySubscription";

describe("Company subscription", () => {
  it("to snapshot", () => {
    const sub = aCompanySubscription({
      subscriptionId: "1",
      maxNoOfSubscribers: 1,
      maxNoOnWaitingList: 1,
    });
    sub.enroll("2");
    sub.enroll("3");

    assert.deepStrictEqual(sub.toSnapshot(), {
      currentEnrollment: {
        maxNoOfSubscribers: 1,
        maxNoOnWaitingList: 1,
        subscribers: ["2"],
        waitingList: ["3"],
      },
      currentStatus: "Activated",
      subscriptionId: "1",
      version: 0,
    });
  });

  it("from snapshot", () => {
    const uuid = () => "UUID";
    const clock = {
      now() {
        return new Date();
      },
    };
    const snapshot: CompanySubscriptionSnapshot = {
      currentEnrollment: {
        maxNoOfSubscribers: 1,
        maxNoOnWaitingList: 1,
        subscribers: ["2"],
        waitingList: ["3"],
      },
      currentStatus: "Activated",
      subscriptionId: "1",
      version: 0,
    };

    const sub = CompanySubscription.fromSnapshot({ clock, uuid })(snapshot);

    assert.deepStrictEqual(sub.toSnapshot(), snapshot);
  });
});
