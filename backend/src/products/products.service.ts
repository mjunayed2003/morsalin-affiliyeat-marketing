import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string, search?: string) {
    const where: any = {};

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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
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

  async update(id: string, dto: UpdateProductDto | any) {
    await this.findOne(id);

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = String(dto.title).trim();
    if (dto.description !== undefined) updateData.description = String(dto.description).trim();
    if (dto.category !== undefined) updateData.category = String(dto.category).trim();
    if (dto.subCategory !== undefined) updateData.subCategory = dto.subCategory ? String(dto.subCategory).trim() : null;
    if (dto.price !== undefined) updateData.price = typeof dto.price === 'number' ? dto.price : parseFloat(String(dto.price || '0')) || 0;
    if (dto.originalPrice !== undefined) updateData.originalPrice = typeof dto.originalPrice === 'number' ? dto.originalPrice : parseFloat(String(dto.originalPrice || '0')) || 0;
    if (dto.commission !== undefined) updateData.commission = dto.commission;
    if (dto.commissionAmount !== undefined) updateData.commissionAmount = typeof dto.commissionAmount === 'number' ? dto.commissionAmount : parseFloat(String(dto.commissionAmount || '0')) || 0;
    if (dto.image !== undefined) updateData.image = String(dto.image).trim();
    if (dto.gallery !== undefined) updateData.gallery = Array.isArray(dto.gallery) ? dto.gallery : [dto.image];
    if (dto.affiliateCode !== undefined) updateData.affiliateCode = dto.affiliateCode;
    if (dto.features !== undefined) updateData.features = Array.isArray(dto.features) ? dto.features : [];
    if (dto.rating !== undefined) updateData.rating = typeof dto.rating === 'number' ? dto.rating : parseFloat(String(dto.rating || '5.0')) || 5.0;
    if (dto.reviewsCount !== undefined) updateData.reviewsCount = typeof dto.reviewsCount === 'number' ? dto.reviewsCount : parseInt(String(dto.reviewsCount || '0'), 10) || 0;
    if (dto.badge !== undefined) updateData.badge = dto.badge || null;
    if (dto.inStock !== undefined) updateData.inStock = Boolean(dto.inStock);
    if (dto.store !== undefined) updateData.store = dto.store ? String(dto.store).trim() : null;
    if (dto.amazonUrl !== undefined) updateData.amazonUrl = dto.amazonUrl ? String(dto.amazonUrl).trim() : null;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async toggleStock(id: string, inStock: boolean) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { inStock: Boolean(inStock) },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addReview(productId: string, userId: string, userName: string, data: { rating: number; title?: string; comment: string }) {
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
    }).catch(() => {});

    return review;
  }

  async deleteReview(reviewId: string) {
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
    }).catch(() => {});

    return { success: true, message: 'Review deleted' };
  }
}

