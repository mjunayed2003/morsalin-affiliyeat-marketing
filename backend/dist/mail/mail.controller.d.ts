import { MailService } from './mail.service.js';
export interface TestMailDto {
    to?: string;
    subject?: string;
    html?: string;
    text?: string;
}
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    testResend(body: TestMailDto): Promise<{
        success: boolean;
        provider: "resend" | "smtp" | "none";
        id?: string;
        error?: {
            message: string;
            name?: string;
        };
        message: string;
    }>;
    sendCustomMail(body: {
        to: string | string[];
        subject: string;
        html: string;
        text?: string;
    }): Promise<import("./mail.service.js").SendEmailResult>;
}
