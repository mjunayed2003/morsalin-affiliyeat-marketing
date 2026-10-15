import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ChatController {
    private readonly chatService;
    private readonly chatGateway;
    constructor(chatService: ChatService, chatGateway: ChatGateway);
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
