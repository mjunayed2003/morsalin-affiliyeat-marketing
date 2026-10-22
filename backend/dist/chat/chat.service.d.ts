import { PrismaService } from '../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatMessage;
    getMessages(userId?: string, isAdmin?: boolean, page?: number, limit?: number): Promise<{
        messages: {
            id: any;
            sender: any;
            senderName: any;
            userPhone: any;
            userEmail: any;
            text: any;
            image: any;
            productInfo: {
                id: any;
                title: any;
                price: any;
                image: any;
            } | undefined;
            timestamp: string;
            read: boolean;
            status: "SENT" | "DELIVERED" | "SEEN";
            deliveredAt: string | undefined;
            seenAt: string | undefined;
            userId: any;
            createdAt: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    createMessage(dto: SendMessageDto): Promise<{
        status: "SENT";
        read: boolean;
        localId: string | undefined;
        id: any;
        sender: any;
        senderName: any;
        userPhone: any;
        userEmail: any;
        text: any;
        image: any;
        productInfo: {
            id: any;
            title: any;
            price: any;
            image: any;
        } | undefined;
        timestamp: string;
        deliveredAt: string | undefined;
        seenAt: string | undefined;
        userId: any;
        createdAt: string;
    }>;
    getLastCustomerMessage(userId?: string): Promise<{
        id: string;
        sender: string;
        senderName: string | null;
        text: string;
        image: string | null;
        productId: string | null;
        productTitle: string | null;
        productPrice: number | null;
        productImage: string | null;
        read: boolean;
        userId: string | null;
        createdAt: Date;
    } | null>;
    clearMessages(userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(ids?: string[], userId?: string): Promise<{
        ids: string[];
        userId: string | undefined;
        seenAt: string;
    } | {
        ids: never[];
        seenAt: string;
        userId?: undefined;
    }>;
    markAsDelivered(ids: string[]): Promise<{
        updatedIds: string[];
        deliveredAt: string;
    }>;
    markAsSeen(ids?: string[], userId?: string): Promise<{
        ids: string[];
        userId: string | undefined;
        seenAt: string;
    } | {
        ids: never[];
        seenAt: string;
        userId?: undefined;
    }>;
    createCallRecord(data: {
        callId: string;
        callerId: string;
        callerName?: string;
        callerRole?: string;
        receiverId?: string;
        receiverName?: string;
        status: string;
        duration?: number;
        startedAt?: Date;
        endedAt?: Date;
    }): Promise<void>;
}
