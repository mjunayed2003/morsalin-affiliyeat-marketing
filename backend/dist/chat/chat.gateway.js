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
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    server;
    logger = new Logger(ChatGateway_1.name);
    lastCustomerMessageTimes = new Map();
    constructor(chatService) {
        this.chatService = chatService;
    }
    handleConnection(client) {
        this.logger.log(`⚡ Client connected via Socket.IO: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`🔌 Client disconnected from Socket.IO: ${client.id}`);
    }
    handleJoinRoom(client, payload) {
        const room = payload.roomId || (payload.userId ? `room_${payload.userId}` : 'general_support');
        client.join(room);
        this.logger.log(`Client ${client.id} joined room: ${room}`);
        return { event: 'joinedRoom', room };
    }
    async handleSendMessage(client, payload) {
        this.logger.log(`💬 Received message from ${payload.sender}: "${payload.text?.slice(0, 30)}..."`);
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
        if (payload.sender === 'admin' && !payload.userId) {
            const lastCustomer = await this.chatService.getLastCustomerMessage();
            if (lastCustomer?.userId) {
                payload.userId = lastCustomer.userId;
            }
        }
        const savedMessage = await this.chatService.createMessage(payload);
        this.server.emit('newMessage', savedMessage);
        if (shouldAutoReply && payload.sender === 'customer') {
            this.logger.log(`🤖 5-hour inactivity threshold met: Triggering auto-reply for customer ${clientKey}`);
            setTimeout(() => {
                this.server.emit('typing', { isTyping: true, sender: 'admin' });
            }, 500);
            setTimeout(async () => {
                let replyText = 'Thank you for reaching out! Our team is reviewing your inquiry. We will get back to you shortly.';
                const lower = (payload.text || '').toLowerCase();
                if (lower.includes('free') || lower.includes('cost') || lower.includes('price')) {
                    replyText = 'Yes! All review club items on ProductPerks are 100% free for verified Amazon reviewers. Zero hidden fees!';
                }
                else if (lower.includes('link') || lower.includes('order') || lower.includes('buy')) {
                    replyText = 'Please click the "View on Amazon" button on the product details card or share your Amazon profile to receive the direct test link.';
                }
                else if (lower.includes('work') || lower.includes('program') || lower.includes('how')) {
                    replyText = 'It is simple: 1) Pick any available Amazon product. 2) Receive the order link. 3) Test the item and share honest feedback. 4) Keep the item 100% free!';
                }
                const autoAdminMessage = await this.chatService.createMessage({
                    sender: 'admin',
                    senderName: 'ProductPerks Admin',
                    text: replyText,
                    userId: payload.userId,
                });
                this.server.emit('typing', { isTyping: false, sender: 'admin' });
                this.server.emit('newMessage', autoAdminMessage);
            }, 1600);
        }
        else if (payload.sender === 'customer') {
            this.logger.log(`ℹ️ Auto-reply suppressed: Customer ${clientKey} messaged within the 5-hour window.`);
        }
        return savedMessage;
    }
    handleTyping(client, payload) {
        client.broadcast.emit('typing', payload);
    }
    async handleMarkAsRead(payload) {
        await this.chatService.markAsRead(payload.ids);
        this.server.emit('messagesRead', { ids: payload.ids });
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
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    SubscribeMessage('sendMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket,
        SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    SubscribeMessage('typing'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    SubscribeMessage('markAsRead'),
    __param(0, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
ChatGateway = ChatGateway_1 = __decorate([
    WebSocketGateway({
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [ChatService])
], ChatGateway);
export { ChatGateway };
//# sourceMappingURL=chat.gateway.js.map