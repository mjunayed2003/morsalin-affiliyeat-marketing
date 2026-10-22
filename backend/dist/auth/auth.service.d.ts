import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { SendRegisterOtpDto, VerifyRegisterOtpDto, SendForgotPasswordOtpDto, ResetPasswordDto } from './dto/otp-auth.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly mailService;
    private readonly notificationsService;
    private readonly chatGateway;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService, notificationsService: NotificationsService, chatGateway: ChatGateway);
    private normalizePhone;
    sendRegisterOtp(dto: SendRegisterOtpDto): Promise<{
        success: boolean;
        message: string;
        email: string;
        phone: string;
    }>;
    verifyRegisterOtp(dto: VerifyRegisterOtpDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        user: {
            id: string;
            phone: string;
            name: string;
            email: string | null;
            address: string | null;
            city: string | null;
            avatar: string | null;
            selfieImage: string | null;
            amazonProfileUrl: string | null;
            paypalEmail: string | null;
            verified: boolean;
            role: import("../generated/prisma/enums.js").Role;
            status: string;
            createdAt: Date;
        };
        token: null;
    }>;
    sendForgotPasswordOtp(dto: SendForgotPasswordOtpDto): Promise<{
        success: boolean;
        message: string;
        email: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    register(dto: RegisterDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        user: {
            id: string;
            phone: string;
            name: string;
            email: string | null;
            address: string | null;
            city: string | null;
            avatar: string | null;
            verified: boolean;
            role: import("../generated/prisma/enums.js").Role;
            status: string;
            createdAt: Date;
        };
        token: null;
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
            city: string | null;
            avatar: string | null;
            selfieImage: string | null;
            amazonProfileUrl: string | null;
            paypalEmail: string | null;
            canReview: boolean;
            verified: boolean;
            role: import("../generated/prisma/enums.js").Role;
            status: string;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            rejectionReason: string | null;
            createdAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        selfieImage: string | null;
        amazonProfileUrl: string | null;
        paypalEmail: string | null;
        verified: boolean;
        role: import("../generated/prisma/enums.js").Role;
        status: string;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        rejectionReason: string | null;
        canReview: boolean;
        createdAt: Date;
    }>;
    getRegistrationStatus(identifier: string): Promise<{
        success: boolean;
        status: string;
        name: string;
        email: string | null;
        phone: string;
        createdAt: Date;
        reviewedAt: Date | null;
        rejectionReason: string | null;
    }>;
    guestLogin(dto: {
        name: string;
        phone: string;
    }): Promise<{
        success: boolean;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            role: import("../generated/prisma/enums.js").Role;
            avatar: string | null;
            isGuest: boolean;
        };
        token: string;
        message: string;
    }>;
}
