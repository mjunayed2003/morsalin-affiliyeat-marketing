var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
let MailService = MailService_1 = class MailService {
    logger = new Logger(MailService_1.name);
    transporter;
    constructor() {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = Number(process.env.SMTP_PORT) || 465;
        const secure = process.env.SMTP_SECURE === 'true' || port === 465;
        const user = process.env.SMTP_USER || 'morsalinislam8234@gmail.com';
        const pass = (process.env.SMTP_PASS || 'zikklagqxbnwecxx').replace(/\s+/g, '');
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        });
    }
    getSender() {
        const appName = process.env.APP_NAME || process.env.SMTP_FROM_NAME || 'FreeProducts.online';
        const email = process.env.SMTP_USER || 'morsalinislam8234@gmail.com';
        return {
            name: appName,
            address: email,
        };
    }
    getReplyTo() {
        return process.env.SMTP_REPLY_TO || 'freeproductsonline1@gmail.com';
    }
    async sendRegisterOtp(toEmail, code, name) {
        const appName = process.env.APP_NAME || 'FreeProducts.online';
        const from = this.getSender();
        const replyTo = this.getReplyTo();
        const subject = `Your Verification Code: ${code} - ${appName}`;
        const recipientName = name ? name.trim() : 'Reviewer';
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560" style="max-width: 560px; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background: #1b3b2b; padding: 32px 30px; text-align: center;">
                    <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 9999px; margin-bottom: 12px;">
                      <span style="color: #6ee7b7; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        Amazon Review Club • Secure Verification
                      </span>
                    </div>
                    <div style="margin: 0 auto; display: inline-block;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                        Free<span style="color: #34d399;">Products</span><span style="font-size: 13px; font-weight: 800; background: rgba(52,211,153,0.2); color: #6ee7b7; padding: 3px 8px; border-radius: 6px; margin-left: 6px; border: 1px solid rgba(52,211,153,0.35); vertical-align: middle;">.ONLINE</span>
                      </h1>
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a; font-weight: 700;">
                      Hello ${recipientName},
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">
                      Thank you for registering with <strong>FreeProducts.online</strong>. Please use the following 6-digit One-Time Password (OTP) to verify your Gmail address and complete your account creation:
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
                      <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #166534; letter-spacing: 1px; margin-bottom: 8px;">
                        Your Registration OTP
                      </span>
                      <span style="font-size: 38px; font-weight: 800; color: #1b3b2b; letter-spacing: 8px; font-family: monospace;">
                        ${code}
                      </span>
                    </div>

                    <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; line-height: 1.5;">
                      ⏱️ This verification code is valid for <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                      If you did not request this registration, you can safely ignore this email. No account will be created without this verification code.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      © ${new Date().getFullYear()} FreeProducts.online Review Club. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        try {
            const info = await this.transporter.sendMail({
                from,
                replyTo,
                to: toEmail,
                subject,
                html,
                text: `Your ${appName} verification code is: ${code}. Valid for 10 minutes.`,
            });
            this.logger.log(`✅ Registration OTP email sent to ${toEmail}: ${info.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Failed to send registration OTP email to ${toEmail}: ${error.message}`);
            throw error;
        }
    }
    async sendForgotPasswordOtp(toEmail, code, name) {
        const appName = process.env.APP_NAME || 'FreeProducts.online';
        const from = this.getSender();
        const replyTo = this.getReplyTo();
        const subject = `Password Reset Code: ${code} - ${appName}`;
        const recipientName = name ? name.trim() : 'User';
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560" style="max-width: 560px; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background: #1b3b2b; padding: 32px 30px; text-align: center;">
                    <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 9999px; margin-bottom: 12px;">
                      <span style="color: #fef08a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        Password Recovery
                      </span>
                    </div>
                    <div style="margin: 0 auto; display: inline-block;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                        Free<span style="color: #34d399;">Products</span><span style="font-size: 13px; font-weight: 800; background: rgba(52,211,153,0.2); color: #6ee7b7; padding: 3px 8px; border-radius: 6px; margin-left: 6px; border: 1px solid rgba(52,211,153,0.35); vertical-align: middle;">.ONLINE</span>
                      </h1>
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a; font-weight: 700;">
                      Hello ${recipientName},
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">
                      We received a request to reset the password for your <strong>FreeProducts.online</strong> account. Use the following 6-digit OTP code to create a new password:
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background: #fffbeb; border: 2px dashed #fcd34d; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
                      <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #92400e; letter-spacing: 1px; margin-bottom: 8px;">
                        Password Reset Code
                      </span>
                      <span style="font-size: 38px; font-weight: 800; color: #78350f; letter-spacing: 8px; font-family: monospace;">
                        ${code}
                      </span>
                    </div>

                    <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; line-height: 1.5;">
                      ⏱️ This code will expire in <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #dc2626; line-height: 1.5; font-weight: 500;">
                      🔒 If you did NOT request a password reset, please ignore this email or change your account credentials immediately.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      © ${new Date().getFullYear()} FreeProducts.online Review Club. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        try {
            const info = await this.transporter.sendMail({
                from,
                replyTo,
                to: toEmail,
                subject,
                html,
                text: `Your ${appName} password reset code is: ${code}. Valid for 10 minutes.`,
            });
            this.logger.log(`✅ Forgot password OTP email sent to ${toEmail}: ${info.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Failed to send forgot password OTP email to ${toEmail}: ${error.message}`);
            throw error;
        }
    }
};
MailService = MailService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], MailService);
export { MailService };
//# sourceMappingURL=mail.service.js.map