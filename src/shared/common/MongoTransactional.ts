import { ClientSession, MongoClient } from "mongodb";

type Fn = (...args: any[]) => any;
type AsyncFn = (...args: any[]) => Promise<any>;
export type UnwrapPromise<T> = Promise<T extends Promise<infer X> ? X : T>;
export type Transactional = <T extends Fn>(fn: T) => (...args: Parameters<T>) => UnwrapPromise<ReturnType<T>>;
export type TxContext = { session: ClientSession; transactional: Transactional };
export type WithTxContext = <T extends Fn>(fnFactory: (params: TxContext) => T) => T;

export const withConnection = (connection: MongoClient): WithTxContext => (fnFactory) => {
  const session = connection.startSession();

  const transactional: Transactional = (fn) => {
    return async (...args) => {
      session.startTransaction();
      try {
        const result = fn(...args);
        await session.commitTransaction();
        return result;
      } catch (e) {
        await session.abortTransaction();
        throw e;
      } finally {
        session.endSession();
      }
    };
  };

  return fnFactory({ session, transactional });
};
