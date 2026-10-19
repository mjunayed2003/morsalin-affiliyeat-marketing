import { PrismaService } from '../prisma/prisma.service.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(role?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        verifiedAt: Date | null;
        role: import("../generated/prisma/enums.js").Role;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        inquiries: ({
            product: {
                category: string;
                description: string;
                title: string;
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
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
        name: string;
        phone: string;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        verifiedAt: Date | null;
        role: import("../generated/prisma/enums.js").Role;
    }>;
    updateRole(id: string, role: 'CLIENT' | 'ADMIN'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        password: string | null;
        email: string | null;
        address: string | null;
        city: string | null;
        avatar: string | null;
        verified: boolean;
        verifiedAt: Date | null;
        role: import("../generated/prisma/enums.js").Role;
    }>;
}
