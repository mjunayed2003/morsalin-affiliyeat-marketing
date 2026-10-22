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
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
let MailService = MailService_1 = class MailService {
    logger = new Logger(MailService_1.name);
    resend = null;
    transporter = null;
    constructor() {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            this.resend = new Resend(resendApiKey);
            this.logger.log('✅ Resend Node.js SDK initialized successfully.');
        }
        else {
            this.logger.warn('⚠️ RESEND_API_KEY is not defined in environment variables.');
        }
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = Number(process.env.SMTP_PORT) || 465;
        const secure = process.env.SMTP_SECURE === 'true' || port === 465;
        const user = process.env.SMTP_USER || 'morsalinislam8234@gmail.com';
        const pass = (process.env.SMTP_PASS || 'zikklagqxbnwecxx').replace(/\s+/g, '');
        try {
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
        catch (e) {
            this.logger.warn(`Could not initialize secondary SMTP transporter: ${e.message}`);
        }
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
    async sendEmail(options) {
        const fromAddress = options.from || process.env.RESEND_FROM || 'FreeProducts.online <support@freeproducts.online>';
        const replyTo = options.replyTo || this.getReplyTo();
        if (this.resend) {
            const { data, error } = await this.resend.emails.send({
                from: fromAddress,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                replyTo,
                ...(options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : {}),
                ...(options.tags ? { tags: options.tags } : {}),
            });
            if (error) {
                this.logger.error(`❌ Resend email dispatch error to ${options.to}: ${error.message} (${error.name})`);
                if (this.transporter) {
                    this.logger.log(`🔄 Attempting fallback delivery via SMTP to ${options.to}...`);
                    try {
                        const info = await this.transporter.sendMail({
                            from: this.getSender(),
                            replyTo,
                            to: options.to,
                            subject: options.subject,
                            html: options.html,
                            text: options.text,
                        });
                        this.logger.log(`✅ Fallback SMTP email delivered: ${info.messageId}`);
                        return {
                            success: true,
                            provider: 'smtp',
                            id: info.messageId,
                        };
                    }
                    catch (smtpErr) {
                        this.logger.error(`❌ Fallback SMTP delivery also failed: ${smtpErr.message}`);
                    }
                }
                return {
                    success: false,
                    provider: 'resend',
                    error: {
                        message: error.message,
                        name: error.name,
                    },
                };
            }
            this.logger.log(`✅ Email successfully sent via Resend to ${options.to} (Message ID: ${data?.id})`);
            return {
                success: true,
                provider: 'resend',
                id: data?.id,
            };
        }
        if (this.transporter) {
            try {
                const info = await this.transporter.sendMail({
                    from: this.getSender(),
                    replyTo,
                    to: options.to,
                    subject: options.subject,
                    html: options.html,
                    text: options.text,
                });
                this.logger.log(`✅ Email sent via SMTP to ${options.to}: ${info.messageId}`);
                return {
                    success: true,
                    provider: 'smtp',
                    id: info.messageId,
                };
            }
            catch (err) {
                this.logger.error(`❌ SMTP delivery failed: ${err.message}`);
                return {
                    success: false,
                    provider: 'smtp',
                    error: { message: err.message },
                };
            }
        }
        return {
            success: false,
            provider: 'none',
            error: { message: 'No email service configured (missing RESEND_API_KEY and SMTP configuration)' },
        };
    }
    async sendRegisterOtp(toEmail, code, name) {
        const appName = process.env.APP_NAME || 'FreeProducts.online';
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
        const result = await this.sendEmail({
            to: toEmail,
            subject,
            html,
            text: `Your ${appName} verification code is: ${code}. Valid for 10 minutes.`,
            idempotencyKey: `register-otp-${toEmail}-${code}`,
            tags: [
                { name: 'category', value: 'otp-verification' },
                { name: 'type', value: 'register' },
            ],
        });
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to dispatch registration OTP email');
        }
        return true;
    }
    async sendForgotPasswordOtp(toEmail, code, name) {
        const appName = process.env.APP_NAME || 'FreeProducts.online';
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
        const result = await this.sendEmail({
            to: toEmail,
            subject,
            html,
            text: `Your ${appName} password reset code is: ${code}. Valid for 10 minutes.`,
            idempotencyKey: `forgot-password-otp-${toEmail}-${code}`,
            tags: [
                { name: 'category', value: 'password-reset' },
                { name: 'type', value: 'recovery' },
            ],
        });
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to dispatch forgot password OTP email');
        }
        return true;
    }
};
MailService = MailService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], MailService);
export { MailService };
//# sourceMappingURL=mail.service.js.map