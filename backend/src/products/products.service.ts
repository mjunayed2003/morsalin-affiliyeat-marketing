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

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
