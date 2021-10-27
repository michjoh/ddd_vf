import { CompanySubscription } from "../../domain/CompanySubscription";

import { aCompanySubscription } from "../../domain/spec/CompanySubscriptionFixture";

import { MongoSubscriptionRepository } from "../MongoSubscriptionRepository";

import { DatabaseConfig } from "../../../shared/config/DatabaseConfig";

import assert from "assert";
import { Db, MongoClient } from "mongodb";
import { SubscriptionRepository } from "../../domain/SubscriptionRepository";

describe.skip("Repository", function () {
  let connection: MongoClient;
  let db: Db;
  let repository: SubscriptionRepository;

  before(async () => {
    ({ connection, db } = await DatabaseConfig());
    const clock = {
      now() {
        return new Date();
      },
    };
    const uuid = () => "1234";
    // @ts-ignore
    repository = MongoSubscriptionRepository({ db, fromSnapshot: CompanySubscription.fromSnapshot({ clock, uuid }) });
  });

  beforeEach(async () => {
    await db.dropDatabase();
  });

  after(async () => {
    await connection.close();
  });

  it("supports optimistic concurrency", async function () {
    const sub = aCompanySubscription({
      maxNoOfSubscribers: 1,
      maxNoOnWaitingList: 0,
      subscriptionId: "subscription1234",
    });
    await repository.createNew(sub);

    const client1Sub = await repository.findBy(sub.id);
    const client2Sub = await repository.findBy(sub.id);

    if (!client1Sub || !client2Sub) throw new Error("No client retrieved");

    client1Sub.enroll("subscriber1");
    client2Sub.enroll("subscriber2");

    await repository.update(client1Sub);
    await assert.rejects(
      () => repository.update(client2Sub),
      /Company subscription subscription1234 must have been modified in the meantime/
    );
  });
});
