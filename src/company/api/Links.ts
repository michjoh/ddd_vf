export const links = {
  resources: {
    SUBSCRIPTION_COLLECTION: "/subscriptions",
    SUBSCRIPTION: "/subscriptions/:id",
    ENROLLMENT: "/subscriptions/enrollment",
    ACCESS: "/access/:subscription/:subscriber",
  },
  subscriptionLink(id: string) {
    return links.resources.SUBSCRIPTION.replace(":id", id);
  },
};
