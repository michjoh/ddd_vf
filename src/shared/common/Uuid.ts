import validator from "validator";
import { v4 } from "uuid";

export const validate = (uuid: string) => {
  if (!validator.isUUID(uuid, 4)) {
    throw new TypeError(`${uuid} is not UUID v4`);
  }
};

export const generate = v4;
