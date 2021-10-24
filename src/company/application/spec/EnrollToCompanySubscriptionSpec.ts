import assert from "assert";

import { aCompanySubscription } from "../../domain/spec/CompanySubscriptionFixture";

// @ts-ignore
import { Ok, Error } from "../../../shared/common/Result";

import { SubscriptionConfig } from "../InMemoryCompanySubscriptionConfig";

import { generate } from "../../../shared/common/Uuid";

import { SubscriptionFacade } from "../CompanySubscriptionFacade";
import { clock } from "../../../shared/common/Clock";
import { SubscriptionRepository } from "../../domain/SubscriptionRepository";
import { DomainEventPublisher, Event } from "../../../shared/common/DomainEventPublisher";

describe.skip("Enroll to company subscription", () => {
  let subscriptionFacade: SubscriptionFacade;
  let domainEventPublisher: DomainEventPublisher;
  let companySubscriptionRepository: SubscriptionRepository;

  beforeEach(() => {
    ({ subscriptionFacade, companySubscriptionRepository } = SubscriptionConfig({
      uuid: generate,
      clock,
    }));
  });

  it("cannot enroll to non existent subscription", async () => {
    const result = await subscriptionFacade.enroll({ subscriptionId: "2345", subscriberId: "irrelevant" });

    assert.deepStrictEqual(result, Error("Subscription 2345 does not exist"));
  });

  it("can enroll to existing subscription", async () => {
    const sub = aCompanySubscription();
    await subscriptionFacade.update(sub);

    const result = await subscriptionFacade.enroll({ subscriberId: "1234", subscriptionId: sub.id });

    // @ts-ignore
    assert.deepStrictEqual(result.kind, "Ok");
    assert.ok(await companySubscriptionRepository.findActive({ subscriberId: "1234", subscriptionId: sub.id }));
  });
});
