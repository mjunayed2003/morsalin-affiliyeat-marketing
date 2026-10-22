export declare class CreateNotificationDto {
    title: string;
    body: string;
    type?: 'MESSAGE' | 'PRODUCT' | 'ANNOUNCEMENT' | 'SYSTEM' | 'CALL';
    recipientId?: string;
    sender?: string;
    image?: string;
    link?: string;
}
export declare class BroadcastNotificationDto {
    title: string;
    body: string;
    targetGroup?: 'ALL' | 'CLIENT' | 'ADMIN';
    image?: string;
    link?: string;
}
export declare class RegisterDeviceDto {
    token: string;
    platform?: string;
}
