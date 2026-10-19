import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

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

  async sendRegisterOtp(toEmail: string, code: string, name?: string): Promise<boolean> {
    const fromAddress = process.env.SMTP_FROM || '"ProductPerks" <morsalinislam8234@gmail.com>';
    const subject = `Your Verification Code: ${code} - ProductPerks`;
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
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                      Product<span style="color: #86efac;">Perks</span>
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a; font-weight: 700;">
                      Hello ${recipientName},
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">
                      Thank you for registering with ProductPerks. Please use the following 6-digit One-Time Password (OTP) to verify your Gmail address and complete your account creation:
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
                      © ${new Date().getFullYear()} ProductPerks Review Club. All rights reserved.
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
        from: fromAddress,
        to: toEmail,
        subject,
        html,
        text: `Your ProductPerks verification code is: ${code}. Valid for 10 minutes.`,
      });
      this.logger.log(`✅ Registration OTP email sent to ${toEmail}: ${info.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`❌ Failed to send registration OTP email to ${toEmail}: ${error.message}`);
      throw error;
    }
  }

  async sendForgotPasswordOtp(toEmail: string, code: string, name?: string): Promise<boolean> {
    const fromAddress = process.env.SMTP_FROM || '"ProductPerks" <morsalinislam8234@gmail.com>';
    const subject = `Password Reset Code: ${code} - ProductPerks`;
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
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                      Product<span style="color: #86efac;">Perks</span>
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a; font-weight: 700;">
                      Hello ${recipientName},
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">
                      We received a request to reset the password for your ProductPerks account. Use the following 6-digit OTP code to create a new password:
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
                      © ${new Date().getFullYear()} ProductPerks Review Club. All rights reserved.
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
        from: fromAddress,
        to: toEmail,
        subject,
        html,
        text: `Your ProductPerks password reset code is: ${code}. Valid for 10 minutes.`,
      });
      this.logger.log(`✅ Forgot password OTP email sent to ${toEmail}: ${info.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`❌ Failed to send forgot password OTP email to ${toEmail}: ${error.message}`);
      throw error;
    }
  }
}
