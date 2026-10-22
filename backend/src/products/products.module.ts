import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { ChatModule } from '../chat/chat.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [ChatModule, NotificationsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
