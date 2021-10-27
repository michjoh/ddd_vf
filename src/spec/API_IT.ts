import HttpClient from "supertest";

import { SubscriptionServiceApplication } from "../SubscriptionServiceApplication";

import { DatabaseConfig } from "../shared/config/DatabaseConfig";

import assert from "assert";

import { generate } from "../shared/common/Uuid";
import { Db, MongoClient } from "mongodb";
import { Express } from "express";

describe("Subscription service", function () {
  let connection: MongoClient;
  let db: Db;
  let app: Express;
  let close: () => Promise<void>;

  before(async () => {
    ({ connection, db } = await DatabaseConfig());
  });

  beforeEach(async () => {
    await db.dropDatabase();
  });

  after(async () => {
    await close();
  });

  it("happy path", async function () {
    ({ app, close } = SubscriptionServiceApplication({ db, connection }));
    const request = HttpClient(app);

    const subscriptionId = generate();
    const subscriberId = generate();

    // create subscription
    const res = await request
      .post("/subscriptions")
      .send({
        maxSubscribers: 2,
        maxOnWaitingList: 2,
        subscriptionId,
      })
      .set("Content-Type", "application/json")
      .expect(201);
    console.log(res.headers.location);

    // enroll
    await request
      .post("/subscriptions/enrollment")
      .send({
        subscriberId,
        subscriptionId,
      })
      .set("Content-Type", "application/json")
      .expect(201);

    // check access allowed
    const hasAccessResult = await request
      .get(`/access/${subscriptionId}/${subscriberId}`)
      .set("Accept", "application/json")
      .expect(200);

    assert.deepStrictEqual(hasAccessResult.body, { status: "Allowed" });

    // check access denied
    const hasNoAccessResult = await request
      .get(`/access/${subscriptionId}/${generate()}`)
      .set("Accept", "application/json")
      .expect(200);

    assert.deepStrictEqual(hasNoAccessResult.body, { status: "Denied" });
  });
});
