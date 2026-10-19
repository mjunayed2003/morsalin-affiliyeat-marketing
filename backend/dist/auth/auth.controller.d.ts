import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
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
            createdAt: Date;
        };
        token: string;
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
            createdAt: Date;
        };
        token: string;
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
            verified: boolean;
            role: import("../generated/prisma/enums.js").Role;
            createdAt: Date;
        };
        token: string;
    }>;
    getProfile(currentUser: AuthenticatedUser): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        role: import("../generated/prisma/enums.js").Role;
        createdAt: Date;
    }>;
}
