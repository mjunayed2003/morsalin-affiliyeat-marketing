var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service.js';
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    jwtService;
    server;
    logger = new Logger(ChatGateway_1.name);
    lastCustomerMessageTimes = new Map();
    activeAudioCalls = new Map();
    constructor(chatService, jwtService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        this.logger.log(`⚡ Client connected via Socket.IO: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`🔌 Client disconnected from Socket.IO: ${client.id}`);
    }
    async resolveSocketUser(client, directToken) {
        try {
            const token = directToken ||
                client.handshake.auth?.token ||
                (client.handshake.headers?.authorization
                    ? client.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
                    : null);
            if (!token)
                return null;
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET ||
                    'morsalin_affiliate_super_secure_jwt_token_secret_key_2026_x87123',
            });
            return {
                id: (payload.sub || payload.id),
                phone: payload.phone,
                role: payload.role,
                name: payload.name,
                email: payload.email,
            };
        }
        catch {
            return null;
        }
    }
    async handleJoinRoom(client, payload) {
        const user = await this.resolveSocketUser(client, payload?.token);
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
        if (payload.roomId === 'admin_room') {
            if (isAdmin) {
                client.join('admin_room');
                this.logger.log(`🛡️ Admin ${user?.name || client.id} joined admin_room`);
            }
            else {
                this.logger.warn(`🚫 Unauthorized attempt by ${client.id} to join admin_room rejected`);
            }
        }
        if (payload.userId) {
            if (isAdmin || (user && user.id === payload.userId)) {
                const userRoom = `room_${payload.userId}`;
                client.join(userRoom);
                this.logger.log(`🔒 User ${user?.name || client.id} joined private room: ${userRoom}`);
            }
            else {
                this.logger.warn(`🚫 Unauthorized attempt by ${client.id} to join room_${payload.userId} rejected`);
            }
        }
        return { event: 'joinedRoom' };
    }
    async handleSendMessage(client, payload) {
        const user = await this.resolveSocketUser(client, payload?.token);
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
        if (isAdmin) {
            payload.sender = 'admin';
            payload.senderName = payload.senderName || user?.name || 'FreeProducts Support';
            if (!payload.userId) {
                const lastCustomer = await this.chatService.getLastCustomerMessage();
                if (lastCustomer?.userId) {
                    payload.userId = lastCustomer.userId;
                }
            }
        }
        else {
            payload.sender = 'customer';
            if (user) {
                payload.userId = user.id;
                payload.senderName = user.name || payload.senderName || 'Reviewer';
            }
            else {
                delete payload.userId;
            }
        }
        this.logger.log(`💬 Message from ${payload.sender} (${payload.senderName}): "${payload.text?.slice(0, 30)}..."`);
        const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
        const clientKey = payload.userId || client.id;
        const lastMemoryTime = this.lastCustomerMessageTimes.get(clientKey);
        let shouldAutoReply = false;
        const now = Date.now();
        if (payload.sender === 'customer') {
            if (!lastMemoryTime || (now - lastMemoryTime >= FIVE_HOURS_MS)) {
                try {
                    const lastDbMsg = await this.chatService.getLastCustomerMessage(payload.userId);
                    if (!lastDbMsg) {
                        shouldAutoReply = true;
                    }
                    else {
                        const elapsed = now - new Date(lastDbMsg.createdAt).getTime();
                        if (elapsed >= FIVE_HOURS_MS) {
                            shouldAutoReply = true;
                        }
                    }
                }
                catch {
                    shouldAutoReply = true;
                }
            }
            this.lastCustomerMessageTimes.set(clientKey, now);
        }
        const savedMessage = await this.chatService.createMessage(payload);
        const notificationPayload = {
            id: `notif-${Date.now()}`,
            title: payload.sender === 'customer'
                ? `New Message from ${payload.senderName || 'Reviewer'}`
                : `Support Reply from ${payload.senderName || 'Admin'}`,
            body: payload.text?.slice(0, 100) || 'Sent an attachment',
            sender: payload.sender,
            senderName: payload.senderName,
            userId: savedMessage.userId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        if (savedMessage.userId) {
            this.server
                .to(`room_${savedMessage.userId}`)
                .to('admin_room')
                .emit('newMessage', savedMessage);
            if (payload.sender === 'customer') {
                this.server.to('admin_room').emit('notification', notificationPayload);
            }
            else {
                this.server.to(`room_${savedMessage.userId}`).emit('notification', notificationPayload);
            }
        }
        else {
            this.server.to('admin_room').emit('newMessage', savedMessage);
            if (payload.sender === 'customer') {
                this.server.to('admin_room').emit('notification', notificationPayload);
            }
        }
        if (shouldAutoReply && payload.sender === 'customer') {
            this.logger.log(`🤖 5-hour inactivity threshold met: Triggering auto-reply for customer ${clientKey}`);
            setTimeout(() => {
                if (payload.userId) {
                    this.server.to(`room_${payload.userId}`).to('admin_room').emit('typing', { isTyping: true, sender: 'admin', userId: payload.userId });
                }
                else {
                    this.server.to('admin_room').emit('typing', { isTyping: true, sender: 'admin' });
                }
            }, 500);
            setTimeout(async () => {
                let replyText = 'Thank you for reaching out! Our team is reviewing your inquiry. We will get back to you shortly.';
                const lower = (payload.text || '').toLowerCase();
                if (lower.includes('free') || lower.includes('cost') || lower.includes('price')) {
                    replyText = 'Yes! All review club items on FreeProducts.online are 100% free for verified Amazon reviewers. Zero hidden fees!';
                }
                else if (lower.includes('link') || lower.includes('order') || lower.includes('buy')) {
                    replyText = 'Please click the "View on Amazon" button on the product details card or share your Amazon profile to receive the direct test link.';
                }
                else if (lower.includes('work') || lower.includes('program') || lower.includes('how')) {
                    replyText = 'It is simple: 1) Pick any available Amazon product. 2) Receive the order link. 3) Test the item and share honest feedback. 4) Keep the item 100% free!';
                }
                const autoAdminMessage = await this.chatService.createMessage({
                    sender: 'admin',
                    senderName: 'FreeProducts Support',
                    text: replyText,
                    userId: payload.userId,
                });
                if (payload.userId) {
                    this.server.to(`room_${payload.userId}`).to('admin_room').emit('typing', { isTyping: false, sender: 'admin', userId: payload.userId });
                    this.server.to(`room_${payload.userId}`).to('admin_room').emit('newMessage', autoAdminMessage);
                    this.server.to(`room_${payload.userId}`).emit('notification', {
                        id: `notif-${Date.now()}`,
                        title: 'Support Reply from FreeProducts Support',
                        body: replyText.slice(0, 100),
                        sender: 'admin',
                        senderName: 'FreeProducts Support',
                        userId: payload.userId,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    });
                }
                else {
                    this.server.to('admin_room').emit('typing', { isTyping: false, sender: 'admin' });
                    this.server.to('admin_room').emit('newMessage', autoAdminMessage);
                }
            }, 1600);
        }
        return savedMessage;
    }
    async handleTyping(client, payload) {
        const user = await this.resolveSocketUser(client, payload?.token);
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
        const targetUserId = isAdmin ? payload.userId : (user?.id || payload.userId);
        if (targetUserId) {
            this.server.to(`room_${targetUserId}`).to('admin_room').emit('typing', {
                isTyping: payload.isTyping,
                sender: isAdmin ? 'admin' : 'customer',
                userId: targetUserId,
            });
        }
        else {
            this.server.to('admin_room').emit('typing', {
                isTyping: payload.isTyping,
                sender: 'customer',
            });
        }
    }
    async handleMarkAsRead(payload) {
        await this.chatService.markAsRead(payload.ids);
        this.server.emit('messagesRead', { ids: payload.ids });
        return { success: true };
    }
    async handleStartAudioCall(client, payload) {
        const user = await this.resolveSocketUser(client, payload?.token);
        const callerId = user?.id || client.id;
        const callerName = payload.callerName || user?.name || 'Reviewer';
        const callerRole = user?.role?.toUpperCase() === 'ADMIN' ? 'admin' : 'customer';
        const callId = `call_${Date.now()}`;
        const callData = {
            callId,
            callerId,
            callerName,
            callerRole,
            targetUserId: payload.targetUserId,
            timestamp: new Date().toISOString(),
            status: 'calling',
        };
        this.activeAudioCalls.set(callId, callData);
        this.logger.log(`📞 Audio call initiated by ${callerName} (${callerRole}) for ${payload.targetUserId || 'admin_room'}`);
        if (callerRole === 'admin' && payload.targetUserId) {
            this.server.to(`room_${payload.targetUserId}`).emit('incomingAudioCall', callData);
        }
        else {
            this.server.to('admin_room').emit('incomingAudioCall', callData);
        }
        return { success: true, callData };
    }
    async handleAcceptAudioCall(client, payload) {
        const call = this.activeAudioCalls.get(payload.callId);
        if (call) {
            call.status = 'connected';
            call.startTime = Date.now();
        }
        this.logger.log(`📞 Audio call accepted for callId ${payload.callId}`);
        const targetUserId = payload.targetUserId || call?.targetUserId || (call?.callerRole === 'customer' ? call.callerId : undefined);
        const callerId = call?.callerId;
        if (targetUserId) {
            this.server.to(`room_${targetUserId}`).emit('audioCallAccepted', { callId: payload.callId });
        }
        if (callerId) {
            this.server.to(`room_${callerId}`).emit('audioCallAccepted', { callId: payload.callId });
        }
        this.server.to('admin_room').emit('audioCallAccepted', { callId: payload.callId });
        client.broadcast.emit('audioCallAccepted', { callId: payload.callId });
        return { success: true };
    }
    async handleRejectAudioCall(client, payload) {
        const call = this.activeAudioCalls.get(payload.callId);
        this.logger.log(`📞 Audio call rejected/declined for callId ${payload.callId}`);
        const targetUserId = payload.targetUserId || call?.targetUserId;
        const callerId = payload.callerId || call?.callerId;
        const customerUserId = (call?.callerRole === 'customer' ? call.callerId : targetUserId) || targetUserId || callerId;
        if (targetUserId) {
            this.server.to(`room_${targetUserId}`).emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
        }
        if (callerId) {
            this.server.to(`room_${callerId}`).emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
        }
        this.server.to('admin_room').emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
        client.broadcast.emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
        try {
            const missedMsg = await this.chatService.createMessage({
                sender: call?.callerRole === 'admin' ? 'admin' : 'customer',
                senderName: call?.callerName || 'Reviewer',
                text: '📞 Missed Audio Call',
                userId: customerUserId,
            });
            if (customerUserId) {
                this.server.to(`room_${customerUserId}`).to('admin_room').emit('newMessage', missedMsg);
            }
            else {
                this.server.to('admin_room').emit('newMessage', missedMsg);
            }
        }
        catch (e) {
            this.logger.warn(`Failed to create missed call message: ${e}`);
        }
        this.activeAudioCalls.delete(payload.callId);
        return { success: true };
    }
    async handleEndAudioCall(client, payload) {
        const call = this.activeAudioCalls.get(payload.callId);
        this.logger.log(`📞 Audio call ended for callId ${payload.callId}`);
        const targetUserId = payload.targetUserId || call?.targetUserId;
        const callerId = payload.callerId || call?.callerId;
        const customerUserId = (call?.callerRole === 'customer' ? call.callerId : targetUserId) || targetUserId || callerId;
        if (targetUserId) {
            this.server.to(`room_${targetUserId}`).emit('audioCallEnded', payload);
        }
        if (callerId) {
            this.server.to(`room_${callerId}`).emit('audioCallEnded', payload);
        }
        this.server.to('admin_room').emit('audioCallEnded', payload);
        client.broadcast.emit('audioCallEnded', payload);
        try {
            let callText = '📞 Missed Audio Call';
            const duration = payload.durationSeconds || (call?.startTime ? Math.round((Date.now() - call.startTime) / 1000) : 0);
            if (call?.status === 'connected' || duration > 0) {
                const mins = Math.floor(duration / 60);
                const secs = duration % 60;
                const durationFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                callText = `📞 Audio Call Ended • ${durationFormatted}`;
            }
            const endMsg = await this.chatService.createMessage({
                sender: call?.callerRole === 'admin' ? 'admin' : 'customer',
                senderName: call?.callerName || 'Reviewer',
                text: callText,
                userId: customerUserId,
            });
            if (customerUserId) {
                this.server.to(`room_${customerUserId}`).to('admin_room').emit('newMessage', endMsg);
            }
            else {
                this.server.to('admin_room').emit('newMessage', endMsg);
            }
        }
        catch (e) {
            this.logger.warn(`Failed to create call end message: ${e}`);
        }
        this.activeAudioCalls.delete(payload.callId);
        return { success: true };
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('joinRoom'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    SubscribeMessage('sendMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    SubscribeMessage('typing'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    SubscribeMessage('markAsRead'),
    __param(0, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
__decorate([
    SubscribeMessage('startAudioCall'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleStartAudioCall", null);
__decorate([
    SubscribeMessage('acceptAudioCall'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAcceptAudioCall", null);
__decorate([
    SubscribeMessage('rejectAudioCall'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRejectAudioCall", null);
__decorate([
    SubscribeMessage('endAudioCall'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleEndAudioCall", null);
ChatGateway = ChatGateway_1 = __decorate([
    WebSocketGateway({
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [ChatService,
        JwtService])
], ChatGateway);
export { ChatGateway };
//# sourceMappingURL=chat.gateway.js.map