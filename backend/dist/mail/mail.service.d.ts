export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    sendRegisterOtp(toEmail: string, code: string, name?: string): Promise<boolean>;
    sendForgotPasswordOtp(toEmail: string, code: string, name?: string): Promise<boolean>;
}
