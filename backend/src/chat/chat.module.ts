import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.gateway.js';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [PrismaModule, forwardRef(() => NotificationsModule)],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway, ChatService],
})
export class ChatModule {}
