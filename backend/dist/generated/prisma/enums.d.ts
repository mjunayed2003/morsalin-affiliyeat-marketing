export declare const Role: {
    readonly CLIENT: "CLIENT";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const InquiryStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly ORDERED: "ORDERED";
    readonly REVIEWED: "REVIEWED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus];
