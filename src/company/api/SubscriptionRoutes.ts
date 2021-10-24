import { Router } from "express";

import { validateSubscription } from "./SubscriptionValidation";
import { SubscriptionController } from "./SubscriptionController";

import { validateEnrollment } from "./EnrollmentValidation";

import { links } from "./Links";

const { ACCESS, ENROLLMENT, SUBSCRIPTION, SUBSCRIPTION_COLLECTION } = links.resources;

export const SubscriptionRoutes = (subscriptionController: SubscriptionController) => {
  const router = Router();

  const { addNewSubscription, getSubscription, enrollNewSubscriber, checkAccess } = subscriptionController;
  router.post(SUBSCRIPTION_COLLECTION, validateSubscription, addNewSubscription);
  router.get(SUBSCRIPTION, getSubscription);
  router.post(ENROLLMENT, validateEnrollment, enrollNewSubscriber);
  router.get(ACCESS, checkAccess);

  return router;
};
