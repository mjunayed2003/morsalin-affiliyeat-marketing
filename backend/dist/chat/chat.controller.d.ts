import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
export declare class ChatController {
    private readonly chatService;
    private readonly chatGateway;
    constructor(chatService: ChatService, chatGateway: ChatGateway);
    getMessages(currentUser?: AuthenticatedUser, queryUserId?: string): Promise<{
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
    createMessage(dto: SendMessageDto, currentUser?: AuthenticatedUser): Promise<{
        localId: string | undefined;
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
