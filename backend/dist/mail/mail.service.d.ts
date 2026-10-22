export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string | string[];
    idempotencyKey?: string;
    tags?: {
        name: string;
        value: string;
    }[];
}
export interface SendEmailResult {
    success: boolean;
    provider: 'resend' | 'smtp' | 'none';
    id?: string;
    error?: {
        message: string;
        name?: string;
    };
}
export declare class MailService {
    private readonly logger;
    private resend;
    private transporter;
    constructor();
    private getSender;
    private getReplyTo;
    sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
    sendRegisterOtp(toEmail: string, code: string, name?: string): Promise<boolean>;
    sendForgotPasswordOtp(toEmail: string, code: string, name?: string): Promise<boolean>;
}
