import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards 
} from '@nestjs/common';
import { MailService } from './mail.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

export interface TestMailDto {
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Test sending an email via Resend
   * Publicly accessible for quick health checks
   * Default recipient is 'delivered@resend.dev' (Resend official test sandbox)
   */
  @Post('test-resend')
  @Public()
  @HttpCode(HttpStatus.OK)
  async testResend(@Body() body: TestMailDto) {
    const to = body.to || 'delivered@resend.dev';
    const subject = body.subject || 'Test Email from FreeProducts.online via Resend';
    const html = body.html || `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #1b3b2b;">🎉 Resend Email Integration is Working!</h2>
        <p>This email was successfully dispatched using the official Resend Node.js SDK on FreeProducts.online.</p>
        <p style="font-size: 13px; color: #64748b;">Timestamp: ${new Date().toISOString()}</p>
      </div>
    `;

    const result = await this.mailService.sendEmail({
      to,
      subject,
      html,
      text: body.text || 'Resend Email Integration is working!',
      idempotencyKey: `test-${Date.now()}`,
    });

    return {
      message: result.success ? 'Email dispatched successfully' : 'Email dispatch encountered an issue',
      ...result,
    };
  }

  /**
   * Send custom email (Admin only)
   */
  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async sendCustomMail(@Body() body: { to: string | string[]; subject: string; html: string; text?: string }) {
    return this.mailService.sendEmail({
      to: body.to,
      subject: body.subject,
      html: body.html,
      text: body.text,
      idempotencyKey: `custom-${Date.now()}`,
    });
  }
}
