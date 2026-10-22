import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
export declare class ChatController {
    private readonly chatService;
    private readonly chatGateway;
    constructor(chatService: ChatService, chatGateway: ChatGateway);
    getMessages(currentUser?: AuthenticatedUser, queryUserId?: string, page?: string, limit?: string): Promise<{
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
    createMessage(dto: SendMessageDto, currentUser?: AuthenticatedUser): Promise<{
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
    clearMessages(currentUser?: AuthenticatedUser, queryUserId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(ids?: string[]): Promise<{
        success: boolean;
    }>;
}
