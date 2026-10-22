import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNotificationDto, BroadcastNotificationDto } from './dto/create-notification.dto.js';
export declare class NotificationsService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private firebaseApp;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    private initFirebaseAdmin;
    registerDeviceToken(userId: string, token: string, platform?: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    unregisterDeviceToken(token: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    getUserDeviceTokens(userId: string): Promise<string[]>;
    getGroupDeviceTokens(group?: string): Promise<string[]>;
    pruneInvalidTokens(tokens: string[]): Promise<void>;
    sendPushNotification(tokens: string[], payload: {
        title: string;
        body: string;
        image?: string;
        link?: string;
        data?: Record<string, string>;
    }): Promise<{
        successCount: number;
        failureCount: number;
    }>;
    createNotification(dto: CreateNotificationDto): Promise<{
        id: string;
        title: string;
        body: string;
        type: "MESSAGE" | "PRODUCT" | "ANNOUNCEMENT" | "SYSTEM" | "CALL";
        recipientId: string | null;
        sender: string | null;
        image: string | null;
        link: string | null;
        read: boolean;
        timestamp: string;
        createdAt: string;
    }>;
    broadcastNotification(adminUser: {
        id: string;
        name?: string;
        role: string;
    }, dto: BroadcastNotificationDto): Promise<{
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
    getUserNotifications(userId?: string, page?: number, limit?: number): Promise<{
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
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<{
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
    markAllAsRead(userId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    getBroadcastLogs(page?: number, limit?: number): Promise<{
        logs: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    private formatRelativeTime;
}
