import {Error, Ok} from "../../shared/common/Result";
import {Enrollment, EnrollmentSnapshot} from "./Enrollment";
import {CompanySubscriptionDisabled} from "./CompanySubscriptionDisabled";
import {CompanySubscriptionActivated} from "./CompanySubscriptionActivated";
import {SubscriberAddedToWaitingList} from "./SubscriberAddedToWaitingList";
import {SubscriberWithdrawn} from "./SubscriberWithdrawn";
import {SubscriberEnrolled} from "./SubscriberEnrolled";
import {Clock} from "../../shared/common/Clock";

export type Status = "Activated" | "Disabled";

type BaseCompanySubscriptionProps = {
    clock: { now: () => Date };
    uuid: () => string;
    subscriptionId: string;
    currentStatus?: Status;
    version?: number;
};
type NewSubProps = BaseCompanySubscriptionProps & {
    kind: "New";
    maxNoOfSubscribers: number;
    maxNoOnWaitingList: number;
};
type ExistingSubProps = BaseCompanySubscriptionProps & {
    kind: "Existing";
    currentEnrollment: Enrollment;
};
type CompanySubscriptionProps = NewSubProps | ExistingSubProps;

export type CompanySubscription = ReturnType<typeof CompanySubscription>;

export const CompanySubscription = ({
                                        clock,
                                        uuid,
                                        subscriptionId,
                                        currentStatus = "Activated",
                                        version = 0,
                                        ...props
                                    }: CompanySubscriptionProps) => {
    const currentEnrollment =
        props.kind === "New"
            ? Enrollment({
                maxNoOnWaitingList: props.maxNoOnWaitingList,
                maxNoOfSubscribers: props.maxNoOfSubscribers,
            })
            : props.currentEnrollment;
    const sub = {
        id: subscriptionId,
        get version() {
            return version;
        },
        activate() {
            currentStatus = "Activated";
            return Ok([new CompanySubscriptionActivated({subscriptionId, uuid: uuid(), timestamp: clock.now()})]);
        },
        disable() {
            currentStatus = "Disabled";
            return Ok([new CompanySubscriptionDisabled({subscriptionId, uuid: uuid(), timestamp: clock.now()})]);
        },
        enroll(subscriberId: string) {
            if (!sub.isActive()) {
                return Error("Subscription is not active");
            }
            const enrollResult = currentEnrollment.enroll(subscriberId);
            if (enrollResult === "NotEnrolled") {
                return Error("Not enough space");
            }
            if (enrollResult === "OnWaitingList") {
                return Ok([
                    new SubscriberAddedToWaitingList({
                        subscriptionId,
                        subscriberId,
                        uuid: uuid(),
                        timestamp: clock.now(),
                    }),
                ]);
            }
            return Ok([new SubscriberEnrolled({subscriptionId, subscriberId, uuid: uuid(), timestamp: clock.now()})]);
        },
        withdraw(subscriberId: string) {
            currentEnrollment.withdraw(subscriberId);
            const possibleNewEnrollment = currentEnrollment.enrollNextPersonFromWaitingList();
            const withdrawnEvent = new SubscriberWithdrawn({
                subscriptionId,
                subscriberId,
                uuid: uuid(),
                timestamp: clock.now(),
            });
            if (possibleNewEnrollment) {
                const enrolledEvent = new SubscriberEnrolled({
                    subscriptionId,
                    subscriberId: possibleNewEnrollment,
                    uuid: uuid(),
                    timestamp: clock.now(),
                });
                return Ok([withdrawnEvent, enrolledEvent]);
            }
            return Ok([withdrawnEvent]);
        },
        isDisabled() {
            return currentStatus === "Disabled";
        },
        isActive() {
            return currentStatus === "Activated";
        },
        capacityLeft() {
            return currentEnrollment.capacityLeft();
        },
        toSnapshot(): CompanySubscriptionSnapshot {
            return {
                subscriptionId,
                currentStatus,
                currentEnrollment: currentEnrollment.toSnapshot(),
                version,
            };
        }
    };
    return sub;
};

export type CompanySubscriptionSnapshot = {
    subscriptionId: string,
    currentStatus: Status,
    currentEnrollment: EnrollmentSnapshot,
    version: number,
};
type SnapshotDeps = { clock: Clock, uuid: () => string };

CompanySubscription.fromSnapshot = ({clock, uuid}: SnapshotDeps) =>
    ({
         subscriptionId,
         currentStatus,
         currentEnrollment,
         version,
     }: CompanySubscriptionSnapshot): CompanySubscription =>
        CompanySubscription({
            clock,
            uuid,
            subscriptionId,
            currentStatus,
            version,
            kind: 'Existing',
            currentEnrollment: Enrollment.fromSnapshot(currentEnrollment),
        });
