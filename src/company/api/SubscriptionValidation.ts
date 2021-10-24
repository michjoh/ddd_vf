import { celebrate, Joi, Segments } from "celebrate";

export const validateSubscription = celebrate({
  [Segments.BODY]: Joi.object().keys({
    maxSubscribers: Joi.number().integer().required(),
    maxOnWaitingList: Joi.number().integer().required(),
    subscriptionId: Joi.string().guid().required(),
  }),
});
