import { links } from "./Links";

import pino from "pino";
import { SubscriptionFacade } from "../application/CompanySubscriptionFacade";
import { Request, Response, NextFunction } from "express";

const logger = pino();

export type SubscriptionController = ReturnType<typeof SubscriptionController>;
export const SubscriptionController = (subscriptionFacade: SubscriptionFacade) => {
  return {
    async addNewSubscription(req: Request, res: Response, next: NextFunction) {
      const { maxSubscribers, maxOnWaitingList, subscriptionId } = req.body;
      logger.info(`Received new subscription request [subscription=${subscriptionId}]`);
      const result = await subscriptionFacade.createCompanySubscription({
        maxNoOfSubscribers: maxSubscribers,
        maxNoOnWaitingList: maxOnWaitingList,
        subscriptionId,
      });

      if (result.kind === "Ok") {
        res.status(201).location(links.subscriptionLink(subscriptionId)).end();
      } else {
        res.status(400).json({ errorMessage: result.error });
      }
    },
    async enrollNewSubscriber(req: Request, res: Response, next: NextFunction) {
      const { subscriptionId, subscriberId } = req.body;
      logger.info(`Received new enrollment request [subscription=${subscriptionId}, subscriber=${subscriberId}]`);
      const result = await subscriptionFacade.enroll({
        subscriptionId,
        subscriberId,
      });

      // @ts-ignore
      if (result.kind === "Ok") {
        res.status(201).location(links.subscriptionLink(subscriptionId)).end();
      } else {
        // @ts-ignore
        res.status(400).json({ errorMessage: result.error });
      }
    },
    async getSubscription(req: Request, res: Response, next: NextFunction) {
      const subscription = await subscriptionFacade.findCompanySubscription(req.params.id);
      if (!subscription) {
        return res.status(404).end();
      } else {
        return res.status(200).json(subscription.toSnapshot());
      }
    },
    async checkAccess(req: Request, res: Response, next: NextFunction) {
      const active = await subscriptionFacade.findActiveSubscriptionBy({
        subscriptionId: req.params.subscription,
        subscriberId: req.params.subscriber,
      });
      res.json({ status: active ? "Allowed" : "Denied" });
    },
  };
};
