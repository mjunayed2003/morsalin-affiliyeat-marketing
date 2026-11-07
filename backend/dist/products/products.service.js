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
            orderBy: [{ inStock: 'desc' }, { createdAt: 'desc' }],
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
        const productId = dto.id && dto.id.trim() ? dto.id.trim() : `prod-${Date.now()}`;
        const productData = {
            title: dto.title.trim(),
            description: dto.description?.trim() || 'Featured Amazon product with verified ratings and Prime delivery.',
            category: dto.category.trim(),
            subCategory: dto.subCategory?.trim() || null,
            price: typeof dto.price === 'number' ? dto.price : parseFloat(String(dto.price || '0')) || 0,
            originalPrice: typeof dto.originalPrice === 'number' ? dto.originalPrice : parseFloat(String(dto.originalPrice || '29')) || 29,
            commission: dto.commission || undefined,
            commissionAmount: typeof dto.commissionAmount === 'number' ? dto.commissionAmount : parseFloat(String(dto.commissionAmount || '0')) || 0,
            image: dto.image.trim(),
            gallery: Array.isArray(dto.gallery) && dto.gallery.length > 0 ? dto.gallery : [dto.image.trim()],
            affiliateCode: dto.affiliateCode || `AFF-${Date.now().toString().slice(-4)}`,
            features: Array.isArray(dto.features) ? dto.features : ['Verified Amazon Product', 'Prime Fast Shipping'],
            rating: typeof dto.rating === 'number' ? dto.rating : 5.0,
            reviewsCount: typeof dto.reviewsCount === 'number' ? dto.reviewsCount : 0,
            badge: dto.badge || null,
            inStock: dto.inStock !== undefined ? Boolean(dto.inStock) : true,
            store: dto.store?.trim() || 'Amazon Partner Store',
            amazonUrl: dto.amazonUrl?.trim() || null,
        };
        return this.prisma.product.upsert({
            where: { id: productId },
            create: {
                id: productId,
                ...productData,
            },
            update: productData,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = String(dto.title).trim();
        if (dto.description !== undefined)
            updateData.description = String(dto.description).trim();
        if (dto.category !== undefined)
            updateData.category = String(dto.category).trim();
        if (dto.subCategory !== undefined)
            updateData.subCategory = dto.subCategory ? String(dto.subCategory).trim() : null;
        if (dto.price !== undefined)
            updateData.price = typeof dto.price === 'number' ? dto.price : parseFloat(String(dto.price || '0')) || 0;
        if (dto.originalPrice !== undefined)
            updateData.originalPrice = typeof dto.originalPrice === 'number' ? dto.originalPrice : parseFloat(String(dto.originalPrice || '0')) || 0;
        if (dto.commission !== undefined)
            updateData.commission = dto.commission;
        if (dto.commissionAmount !== undefined)
            updateData.commissionAmount = typeof dto.commissionAmount === 'number' ? dto.commissionAmount : parseFloat(String(dto.commissionAmount || '0')) || 0;
        if (dto.image !== undefined)
            updateData.image = String(dto.image).trim();
        if (dto.gallery !== undefined)
            updateData.gallery = Array.isArray(dto.gallery) ? dto.gallery : [dto.image];
        if (dto.affiliateCode !== undefined)
            updateData.affiliateCode = dto.affiliateCode;
        if (dto.features !== undefined)
            updateData.features = Array.isArray(dto.features) ? dto.features : [];
        if (dto.rating !== undefined)
            updateData.rating = typeof dto.rating === 'number' ? dto.rating : parseFloat(String(dto.rating || '5.0')) || 5.0;
        if (dto.reviewsCount !== undefined)
            updateData.reviewsCount = typeof dto.reviewsCount === 'number' ? dto.reviewsCount : parseInt(String(dto.reviewsCount || '0'), 10) || 0;
        if (dto.badge !== undefined)
            updateData.badge = dto.badge || null;
        if (dto.inStock !== undefined)
            updateData.inStock = Boolean(dto.inStock);
        if (dto.store !== undefined)
            updateData.store = dto.store ? String(dto.store).trim() : null;
        if (dto.amazonUrl !== undefined)
            updateData.amazonUrl = dto.amazonUrl ? String(dto.amazonUrl).trim() : null;
        return this.prisma.product.update({
            where: { id },
            data: updateData,
        });
    }
    async toggleStock(id, inStock) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { inStock: Boolean(inStock) },
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