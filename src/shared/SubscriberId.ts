import { validate } from "./common/Uuid";

export const SubscriberId = (id: string) => {
  validate(id);
  return id;
};
