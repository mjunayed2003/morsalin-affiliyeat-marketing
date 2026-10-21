export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    private getSender;
    private getReplyTo;
    sendRegisterOtp(toEmail: string, code: string, name?: string): Promise<boolean>;
    sendForgotPasswordOtp(toEmail: string, code: string, name?: string): Promise<boolean>;
}
