import { celebrate, Joi, Segments } from "celebrate";

export const validateEnrollment = celebrate({
  [Segments.BODY]: Joi.object().keys({
    subscriberId: Joi.string().guid().required(),
    subscriptionId: Joi.string().guid().required(),
  }),
});
