import { MongoSubscriptionRepository } from "../infrastructure/MongoSubscriptionRepository";

import { IronMQEventPublisher } from "../../shared/common/IronMQEventPublisher";

import { CompanySubscription } from "../domain/CompanySubscription";

import { EnrollToCompanySubscription } from "./EnrollToCompanySubscriptionService";

import { CreateNewCompanySubscription } from "./CreateNewCompanySubscriptionService";

import { SubscriptionFacade } from "./CompanySubscriptionFacade";

import { OutboxEventPublisher } from "../../shared/common/OutboxEventPublisher";

import { StreamingOutboxForwarder } from "../../shared/common/StreamingOutboxForwarder";

import { Transactional, TxContext, withConnection } from "../../shared/common/MongoTransactional";
import { Clock } from "../../shared/common/Clock";
import { ClientSession, Db, MongoClient } from "mongodb";

export const SubscriptionConfig = ({
  clock,
  uuid,
  db,
  connection,
}: {
  clock: Clock;
  uuid: () => string;
  db: Db;
  connection: MongoClient;
}) => {
  // application scope

  const companySubscriptionRepository = MongoSubscriptionRepository({
    db,
    // @ts-ignore
    fromSnapshot: CompanySubscription.fromSnapshot({ clock, uuid }),
  });
  const createNewCompanySubscription = CreateNewCompanySubscription({
    repository: companySubscriptionRepository,
    clock,
    uuid,
  });

  const repository = MongoSubscriptionRepository({
    db,
    // @ts-ignore
    fromSnapshot: CompanySubscription.fromSnapshot({ clock, uuid }),
  });

  const enrollToCompanySubscription = EnrollToCompanySubscription({
    repository,
  });

  const subscriptionFacade = SubscriptionFacade({
    createNewCompanySubscription,
    enrollToCompanySubscription,
    companySubscriptionRepository,
  });

  const close = async () => {
    await connection.close();
  };

  return {
    subscriptionFacade,
    close,
  };
};
