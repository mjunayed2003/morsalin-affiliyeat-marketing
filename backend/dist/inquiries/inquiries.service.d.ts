import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
export declare class InquiriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateInquiryDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
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
    }>;
    findAll(userId?: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
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
    })[]>;
    updateStatus(id: string, status: any): Promise<{
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
    }>;
}
