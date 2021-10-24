import express from "express";

import { CompanySubscriptionRoutes } from "./company/CompanySubscriptionConfig";
import { Db, MongoClient } from "mongodb";

import { generate } from "./shared/common/Uuid";

import { clock } from "./shared/common/Clock";

import { errors } from "celebrate";

// @ts-ignore
import listEndpoints from "express-list-endpoints";

import { SubscriptionConfig } from "./company/application/CompanySubscriptionConfig";

export const SubscriptionServiceApplication = ({ db, connection }: { db: Db; connection: MongoClient }) => {
  const app = express();
  const { subscriptionFacade, close } = SubscriptionConfig({ db, connection, uuid: generate, clock });
  const companySubscriptionRoutes = CompanySubscriptionRoutes(subscriptionFacade);

  app.use(express.json());
  app.use(companySubscriptionRoutes);
  app.get("/", (req, res) => {
    res.send(listEndpoints(companySubscriptionRoutes));
  });
  app.use(errors());

  return { app, close };
};
