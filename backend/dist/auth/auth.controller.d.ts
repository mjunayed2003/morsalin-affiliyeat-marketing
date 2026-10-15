import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    }>;
    getProfile(phoneQuery?: string, phoneHeader?: string): Promise<{
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
    } | {
        success: boolean;
        message: string;
    }>;
}
