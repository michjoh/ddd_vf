```
POST http://localhost:3000/subscriptions
Accept: */*
Content-Type: application/json

{"subscriptionId": "783403ff-0b3e-4790-bd0b-ffb2b44451d0", "maxSubscribers": 2, "maxOnWaitingList": 2}
```

```
GET http://localhost:3000/subscriptions/783403ff-0b3e-4790-bd0b-ffb2b44451d0
Accept: */*
```

```
POST http://localhost:3000/subscriptions/enrollment
Accept: */*
Content-Type: application/json

{"subscriptionId": "783403ff-0b3e-4790-bd0b-ffb2b44451d0", "subscriberId": "783403ff-0b3e-4790-bd0b-ffb2b44451d5"}
```

```
GET http://localhost:3000/access/783403ff-0b3e-4790-bd0b-ffb2b44451d5
Accept: */*
```