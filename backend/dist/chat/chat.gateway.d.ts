import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private readonly lastCustomerMessageTimes;
    constructor(chatService: ChatService, jwtService: JwtService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private resolveSocketUser;
    handleJoinRoom(client: Socket, payload: {
        roomId?: string;
        userId?: string;
        token?: string;
    }): Promise<{
        event: string;
    }>;
    handleSendMessage(client: Socket, payload: SendMessageDto & {
        token?: string;
    }): Promise<{
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
        userId?: string;
        token?: string;
    }): Promise<void>;
    handleMarkAsRead(payload: {
        ids?: string[];
    }): Promise<{
        success: boolean;
    }>;
}
