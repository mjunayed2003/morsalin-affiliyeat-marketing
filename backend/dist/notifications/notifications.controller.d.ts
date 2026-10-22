import { NotificationsService } from './notifications.service.js';
import { BroadcastNotificationDto, RegisterDeviceDto } from './dto/create-notification.dto.js';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly chatGateway;
    constructor(notificationsService: NotificationsService, chatGateway: ChatGateway);
    registerDevice(user: AuthenticatedUser, dto: RegisterDeviceDto): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    unregisterDevice(token: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    getNotifications(queryUserId?: string, page?: string, limit?: string): Promise<{
        notifications: {
            id: any;
            title: any;
            body: any;
            type: any;
            sender: any;
            image: any;
            link: any;
            read: boolean;
            timestamp: string;
            createdAt: any;
        }[];
        total: number;
        page: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getUnreadCount(userId?: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, userId?: string): Promise<{
        success: boolean;
        notificationId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        notificationId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        notificationId?: undefined;
    }>;
    markAllAsRead(userId?: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    broadcastNotification(adminUser: AuthenticatedUser, dto: BroadcastNotificationDto): Promise<{
        success: boolean;
        notification: {
            id: string;
            title: string;
            body: string;
            type: "ANNOUNCEMENT";
            sender: string;
            image: string | null;
            link: string | null;
            isBroadcast: boolean;
            timestamp: string;
            createdAt: string;
        };
        recipientsCount: number;
        fcmSuccessCount: number;
        fcmFailureCount: number;
    }>;
    getBroadcastLogs(page?: string, limit?: string): Promise<{
        logs: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
