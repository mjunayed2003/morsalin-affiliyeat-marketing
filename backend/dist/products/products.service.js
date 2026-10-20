var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(category, search) {
        const where = {};
        if (category && category !== 'All') {
            where.category = { equals: category, mode: 'insensitive' };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async create(dto) {
        const productId = dto.id || `prod-${Date.now()}`;
        return this.prisma.product.create({
            data: {
                id: productId,
                title: dto.title,
                description: dto.description,
                category: dto.category,
                subCategory: dto.subCategory,
                price: dto.price ?? 0,
                originalPrice: dto.originalPrice,
                commission: dto.commission,
                commissionAmount: dto.commissionAmount ?? 0,
                image: dto.image,
                gallery: dto.gallery ?? [dto.image],
                affiliateCode: dto.affiliateCode,
                features: dto.features ?? [],
                rating: dto.rating ?? 5.0,
                reviewsCount: dto.reviewsCount ?? 0,
                badge: dto.badge,
                inStock: dto.inStock ?? true,
                store: dto.store,
                amazonUrl: dto.amazonUrl,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async getReviews(productId) {
        return this.prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addReview(productId, userId, userName, data) {
        await this.findOne(productId);
        const review = await this.prisma.review.create({
            data: {
                productId,
                userId,
                userName,
                rating: data.rating || 5,
                title: data.title,
                comment: data.comment,
            },
        });
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                reviewsCount: { increment: 1 },
            },
        }).catch(() => { });
        return review;
    }
    async deleteReview(reviewId) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new NotFoundException(`Review with ID "${reviewId}" not found`);
        }
        await this.prisma.review.delete({
            where: { id: reviewId },
        });
        await this.prisma.product.update({
            where: { id: review.productId },
            data: {
                reviewsCount: { decrement: 1 },
            },
        }).catch(() => { });
        return { success: true, message: 'Review deleted' };
    }
};
ProductsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map