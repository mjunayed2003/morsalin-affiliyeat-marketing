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
            read: any;
            userId: any;
            createdAt: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    createMessage(dto: SendMessageDto): Promise<{
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
        read: any;
        userId: any;
        createdAt: any;
    }>;
    getLastCustomerMessage(userId?: string): Promise<{
        id: string;
        createdAt: Date;
        image: string | null;
        sender: string;
        senderName: string | null;
        text: string;
        productId: string | null;
        productTitle: string | null;
        productPrice: number | null;
        productImage: string | null;
        read: boolean;
        userId: string | null;
    } | null>;
    clearMessages(userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(ids?: string[]): Promise<{
        success: boolean;
    }>;
}
