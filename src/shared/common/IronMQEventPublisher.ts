// @ts-ignore
import iron_mq from "iron_mq";
import { DomainEventPublisher, Event } from "./DomainEventPublisher";

type PublisherConfig = {
  token: string;
  projectId: string;
  queueName: string;
};

export const IronMQEventPublisher = ({ token, projectId, queueName }: PublisherConfig): DomainEventPublisher => {
  const imq = new iron_mq.Client({ token, project_id: projectId });
  const queue = imq.queue(queueName);

  const publish = (event: Event) =>
    new Promise((resolve, reject) => {
      queue.post(JSON.stringify({ ...event, tag: "Mateusz" }), function (error: Error, body: string) {
        error ? reject(error) : resolve(body);
      });
    });

  return { publish, on: () => {} };
};
