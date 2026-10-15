import { PrismaService } from '../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatMessage;
    getMessages(userId?: string): Promise<{
        id: any;
        sender: any;
        senderName: any;
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
        id: any;
        sender: any;
        senderName: any;
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
    clearMessages(userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(ids?: string[]): Promise<{
        success: boolean;
    }>;
}
