var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';
let ProductsController = class ProductsController {
    productsService;
    chatGateway;
    constructor(productsService, chatGateway) {
        this.productsService = productsService;
        this.chatGateway = chatGateway;
    }
    async findAll(category, search) {
        return this.productsService.findAll(category, search);
    }
    async getReviews(id) {
        return this.productsService.getReviews(id);
    }
    async addReview(id, currentUser, body) {
        if (currentUser.role !== 'ADMIN' && !currentUser.canReview) {
            throw new ForbiddenException('Review access restricted: Admin authorization is required.');
        }
        return this.productsService.addReview(id, currentUser.id, currentUser.name || 'Verified Reviewer', body);
    }
    async deleteReview(reviewId) {
        return this.productsService.deleteReview(reviewId);
    }
    async findOne(id) {
        return this.productsService.findOne(id);
    }
    async create(createProductDto) {
        const product = await this.productsService.create(createProductDto);
        if (this.chatGateway.server) {
            const notifPayload = {
                id: `notif-prod-${product.id}-${Date.now()}`,
                title: 'New Product Added! 🎁',
                body: `"${product.title}" is now available to test & review for free!`,
                sender: 'system',
                type: 'product',
                link: `/p/${product.id}`,
                productId: product.id,
                isBroadcast: true,
                image: product.image,
                timestamp: 'Just now',
            };
            this.chatGateway.server.emit('notification', notifPayload);
            this.chatGateway.server.emit('newProductAdded', product);
        }
        return product;
    }
    async update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    async remove(id) {
        return this.productsService.remove(id);
    }
};
__decorate([
    Get(),
    __param(0, Query('category')),
    __param(1, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    Get(':id/reviews'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getReviews", null);
__decorate([
    Post(':id/reviews'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addReview", null);
__decorate([
    Delete('reviews/:reviewId'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, Param('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteReview", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    Patch(':id'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
ProductsController = __decorate([
    Controller('products'),
    __metadata("design:paramtypes", [ProductsService,
        ChatGateway])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map