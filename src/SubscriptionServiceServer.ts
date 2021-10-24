import { DatabaseConfig } from "./shared/config/DatabaseConfig";

import { SubscriptionServiceApplication } from "./SubscriptionServiceApplication";

(async () => {
  const { db, connection } = await DatabaseConfig();

  const { app } = SubscriptionServiceApplication({ db, connection });

  const port = process.env.PORT!;
  app.listen(port, function () {
    console.log(`subscription-service listening on ${port}`);
  });
})();
