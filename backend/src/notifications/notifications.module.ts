import { Module, forwardRef } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ChatModule } from '../chat/chat.module.js';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatModule)],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
