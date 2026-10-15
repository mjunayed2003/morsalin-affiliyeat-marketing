import { UsersService } from './users.service.js';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: string): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        verifiedAt: Date | null;
        role: import("../generated/prisma/enums.js").Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, currentUser: AuthenticatedUser): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        verifiedAt: Date | null;
        role: import("../generated/prisma/enums.js").Role;
        createdAt: Date;
        updatedAt: Date;
        inquiries: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                category: string;
                subCategory: string | null;
                price: number;
                originalPrice: number;
                commission: string | null;
                commissionAmount: number;
                image: string;
                gallery: string[];
                affiliateCode: string | null;
                features: string[];
                rating: number;
                reviewsCount: number;
                badge: string | null;
                inStock: boolean;
                store: string | null;
                amazonUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
            status: import("../generated/prisma/enums.js").InquiryStatus;
            amazonOrderId: string | null;
            reviewUrl: string | null;
            notes: string | null;
        })[];
    }>;
    updateRole(id: string, role: 'CLIENT' | 'ADMIN'): Promise<{
        id: string;
        phone: string;
        name: string;
        password: string | null;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        verifiedAt: Date | null;
        role: import("../generated/prisma/enums.js").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
