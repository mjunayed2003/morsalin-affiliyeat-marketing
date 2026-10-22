import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    private readonly notificationsService;
    server: Server;
    private readonly logger;
    private readonly lastCustomerMessageTimes;
    private readonly activeAudioCalls;
    constructor(chatService: ChatService, jwtService: JwtService, notificationsService: NotificationsService);
    handleConnection(client: Socket): Promise<void>;
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
    handleTyping(client: Socket, payload: {
        isTyping: boolean;
        sender: string;
        userId?: string;
        token?: string;
    }): Promise<void>;
    handleMessageDelivered(client: Socket, payload: {
        ids: string[];
        userId?: string;
        token?: string;
    }): Promise<{
        success: boolean;
    } | {
        ids: string[];
        status: "DELIVERED";
        deliveredAt: string;
        userId: string | undefined;
        success: boolean;
    }>;
    handleMarkAsSeen(client: Socket, payload: {
        ids?: string[];
        userId?: string;
        token?: string;
    }): Promise<{
        ids: never[] | string[];
        userId: string | undefined;
        status: "SEEN";
        seenAt: string;
        success: boolean;
    }>;
    handleBroadcastProduct(client: Socket, payload: {
        product: any;
        token?: string;
    }): Promise<{
        success: boolean;
    }>;
    handleNotificationRead(client: Socket, payload: {
        notificationId?: string;
        id?: string;
        token?: string;
        userId?: string;
    }): Promise<{
        success: boolean;
        id?: undefined;
        unreadCount?: undefined;
    } | {
        success: boolean;
        id: string;
        unreadCount: number;
    }>;
    handleNotificationReadAll(client: Socket, payload: {
        token?: string;
        userId?: string;
    }): Promise<{
        success: boolean;
        unreadCount?: undefined;
    } | {
        success: boolean;
        unreadCount: number;
    }>;
    handleNotificationUnreadCount(client: Socket, payload: {
        token?: string;
        userId?: string;
    }): Promise<{
        count: number;
        unreadCount: number;
    }>;
    handleNotificationBroadcast(client: Socket, payload: {
        title: string;
        body: string;
        image?: string;
        link?: string;
        targetGroup?: 'ALL' | 'CLIENT' | 'ADMIN';
        token?: string;
    }): Promise<{
        success: boolean;
        error: string;
    } | {
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
        error?: undefined;
    }>;
    handleStartAudioCall(client: Socket, payload: {
        targetUserId?: string;
        callerName?: string;
        callerRole?: string;
        token?: string;
        sdp?: any;
    }): Promise<{
        success: boolean;
        reason: string;
        callData?: undefined;
    } | {
        success: boolean;
        callData: {
            callId: string;
            callerId: string;
            callerName: string;
            callerRole: "customer" | "admin";
            targetUserId: string | undefined;
            sdp: any;
            timestamp: string;
            status: "incoming";
        };
        reason?: undefined;
    }>;
    handleWebrtcOffer(client: Socket, payload: {
        callId: string;
        sdp: any;
        targetUserId?: string;
    }): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    handleAcceptAudioCall(client: Socket, payload: {
        callId: string;
        targetUserId?: string;
        callerId?: string;
        token?: string;
    }): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    handleWebrtcAnswer(client: Socket, payload: {
        callId: string;
        sdp: any;
        targetUserId?: string;
    }): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    handleWebrtcIceCandidate(client: Socket, payload: {
        callId: string;
        candidate: any;
        targetUserId?: string;
    }): Promise<{
        success: boolean;
    }>;
    handleRejectAudioCall(client: Socket, payload: {
        callId: string;
        targetUserId?: string;
        callerId?: string;
        reason?: string;
        token?: string;
    }): Promise<{
        success: boolean;
    }>;
    handleEndAudioCall(client: Socket, payload: {
        callId: string;
        targetUserId?: string;
        callerId?: string;
        durationSeconds?: number;
    }): Promise<{
        success: boolean;
    }>;
}
