import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { ChatModule } from '../chat/chat.module.js';

@Module({
  imports: [
    NotificationsModule,
    forwardRef(() => ChatModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

