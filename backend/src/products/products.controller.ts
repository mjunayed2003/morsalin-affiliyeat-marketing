import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards,
  ForbiddenException,
  Res
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly chatGateway: ChatGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Public: Browse catalog (Never cache, always return fresh database products)
  @Get()
  async findAll(
    @Res({ passthrough: true }) res: Response,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return this.productsService.findAll(category, search);
  }

  // Public: Get reviews for a product
  @Get(':id/reviews')
  async getReviews(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return this.productsService.getReviews(id);
  }

  // Auth: Post a review (Only if canReview is true or role is ADMIN)
  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  async addReview(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() body: { rating: number; title?: string; comment: string },
  ) {
    if (currentUser.role !== 'ADMIN' && !(currentUser as any).canReview) {
      throw new ForbiddenException('Review access restricted: Admin authorization is required.');
    }
    const review = await this.productsService.addReview(id, currentUser.id, currentUser.name || 'Verified Reviewer', body);
    
    // Broadcast review event
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('review:created', { productId: id, review });
      this.chatGateway.server.emit('products:refresh');
    }
    return review;
  }

  // Admin Only: Delete review
  @Delete('reviews/:reviewId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteReview(@Param('reviewId') reviewId: string) {
    const result = await this.productsService.deleteReview(reviewId);
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('review:deleted', { reviewId });
      this.chatGateway.server.emit('products:refresh');
    }
    return result;
  }

  // Public: View product details (No cache)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return this.productsService.findOne(id);
  }

  // Admin Only: Add new product
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);

    // 1. Persist notification in database for all users
    try {
      const savedNotif = await this.notificationsService.createNotification({
        title: 'New Product Added! 🎁',
        body: `"${product.title}" is now available to test & review for free!`,
        type: 'PRODUCT',
        recipientId: undefined, // Broadcast to all
        sender: 'system',
        image: product.image,
        link: `/p/${product.id}`,
      });

      // 2. Dispatch FCM Push Notifications to all registered devices in background
      const tokens = await this.notificationsService.getGroupDeviceTokens('ALL');
      if (tokens.length > 0) {
        this.notificationsService.sendPushNotification(tokens, {
          title: 'New Product Added! 🎁',
          body: `"${product.title}" is now available to test & review for free!`,
          image: product.image,
          link: `/p/${product.id}`,
          data: { productId: product.id },
        }).catch(() => {});
      }

      // 3. Broadcast real-time notifications via Socket.IO
      if (this.chatGateway.server) {
        this.chatGateway.server.emit('notification:new', savedNotif);
        this.chatGateway.server.emit('notification:broadcast', savedNotif);
        this.chatGateway.server.emit('notification', savedNotif);
      }
    } catch (notifErr: any) {
      console.warn('Product notification dispatch notice:', notifErr.message);
    }

    // 4. Broadcast instant product updates to all connected devices
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('newProductAdded', product);
      this.chatGateway.server.emit('product:created', product);
      this.chatGateway.server.emit('products:refresh');
    }

    return product;
  }

  // Admin Only: Modify product
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updated = await this.productsService.update(id, updateProductDto);
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('product:updated', updated);
      this.chatGateway.server.emit('products:refresh');
    }
    return updated;
  }

  // Admin Only: Remove product
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const result = await this.productsService.remove(id);
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('product:deleted', { id });
      this.chatGateway.server.emit('products:refresh');
    }
    return result;
  }
}
