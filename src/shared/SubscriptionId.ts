import { validate } from "./common/Uuid";

export const SubscriptionId = (id: string) => {
  validate(id);
  return id;
};
SubscriptionId.newOne = (uuid: () => string) => SubscriptionId(uuid());
