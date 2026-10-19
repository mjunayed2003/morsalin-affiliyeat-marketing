import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private readonly logger;
    private readonly lastCustomerMessageTimes;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, payload: {
        roomId?: string;
        userId?: string;
    }): {
        event: string;
        room: string;
    };
    handleSendMessage(client: Socket, payload: SendMessageDto): Promise<{
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
    handleTyping(client: Socket, payload: {
        isTyping: boolean;
        sender: string;
    }): void;
    handleMarkAsRead(payload: {
        ids?: string[];
    }): Promise<{
        success: boolean;
    }>;
}
