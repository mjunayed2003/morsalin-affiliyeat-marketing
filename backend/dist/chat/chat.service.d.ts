import { PrismaService } from '../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatMessage;
    getMessages(userId?: string, isAdmin?: boolean): Promise<{
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
    }[]>;
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
        image: string | null;
        createdAt: Date;
        productId: string | null;
        userId: string | null;
        sender: string;
        senderName: string | null;
        text: string;
        productTitle: string | null;
        productPrice: number | null;
        productImage: string | null;
        read: boolean;
    } | null>;
    clearMessages(userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(ids?: string[]): Promise<{
        success: boolean;
    }>;
}
