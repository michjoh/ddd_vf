// const {Enrolled, OnWaitingList, NotEnrolled} = {
//     Enrolled: "Enrolled",
//     OnWaitingList: "OnWaitingList",
//     NotEnrolled: "NotEnrolled",
// };

export type Enrollment = ReturnType<typeof Enrollment>;
export type EnrollmentStatus = "Enrolled" | "OnWaitingList" | "NotEnrolled";

export const Enrollment = ({
                               maxNoOfSubscribers,
                               maxNoOnWaitingList,
                               subscribers = [],
                               waitingList = [],
                           }: {
    maxNoOfSubscribers: number;
    maxNoOnWaitingList: number;
    subscribers?: Array<string>;
    waitingList?: Array<string>;
}) => {
    // @ts-ignore
    const enrollment = {
        enroll(subscriberId: string): EnrollmentStatus {
            if (subscribers.includes(subscriberId)) {
                return "Enrolled";
            }
            if (subscribers.length < maxNoOfSubscribers) {
                subscribers = [...subscribers, subscriberId];
                return "Enrolled";
            }
            if (waitingList.includes(subscriberId)) {
                return "OnWaitingList";
            }
            if (waitingList.length < maxNoOnWaitingList) {
                waitingList = [...waitingList, subscriberId];
                return "OnWaitingList";
            }
            return "NotEnrolled";
        },
        withdraw(subscriberId: string): EnrollmentStatus {
            subscribers = subscribers.filter((id) => id !== subscriberId);
            waitingList = waitingList.filter((id) => id !== subscriberId);
            return "NotEnrolled";
        },
        enrollNextPersonFromWaitingList() {
            const [firstPerson] = waitingList;
            if (firstPerson) {
                enrollment.withdraw(firstPerson);
                enrollment.enroll(firstPerson);
            }
            return firstPerson;
        },
        capacityLeft() {
            return {
                participants: maxNoOfSubscribers - subscribers.length,
                waitingList: maxNoOnWaitingList - waitingList.length,
            };
        },
        toSnapshot(): EnrollmentSnapshot {
            return {subscribers, waitingList, maxNoOfSubscribers, maxNoOnWaitingList};
        },
    };
    return enrollment;
};


export type EnrollmentSnapshot = { subscribers: Array<string>, waitingList: Array<string>, maxNoOfSubscribers: number, maxNoOnWaitingList: number };
Enrollment.fromSnapshot = Enrollment;