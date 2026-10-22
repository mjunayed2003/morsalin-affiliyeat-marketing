import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { GuestLoginDto } from './dto/guest-login.dto.js';
import { SendRegisterOtpDto, VerifyRegisterOtpDto, SendForgotPasswordOtpDto, ResetPasswordDto } from './dto/otp-auth.dto.js';
import { type AuthenticatedUser } from './decorators/current-user.decorator.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    guestLogin(dto: GuestLoginDto): Promise<{
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
    getProfile(currentUser: AuthenticatedUser): Promise<{
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
}
