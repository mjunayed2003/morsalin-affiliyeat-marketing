import { Module, Global, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MailModule } from '../mail/mail.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { ChatModule } from '../chat/chat.module.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

@Global()
@Module({
  imports: [
    PrismaModule,
    MailModule,
    NotificationsModule,
    forwardRef(() => ChatModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'morsalin_affiliate_super_secure_jwt_token_secret_key_2026_x87123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
