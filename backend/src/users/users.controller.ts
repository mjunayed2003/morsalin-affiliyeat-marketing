import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  Patch, 
  Body, 
  UseGuards, 
  ForbiddenException 
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Only ADMIN can list all users
  @Get()
  @Roles('ADMIN')
  async findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  // Admin: Get count of pending registrations for badge
  @Get('pending/count')
  @Roles('ADMIN')
  async getPendingCount() {
    return this.usersService.getPendingCount();
  }

  // Admin: Get list of pending registrations with search & pagination
  @Get('pending')
  @Roles('ADMIN')
  async findPendingRegistrations(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findPendingRegistrations(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
    );
  }

  // Admin: Approve a pending registration
  @Patch(':id/approve')
  @Roles('ADMIN')
  async approveRegistration(
    @Param('id') id: string,
    @CurrentUser() adminUser: AuthenticatedUser,
  ) {
    return this.usersService.approveRegistration(id, adminUser);
  }

  // Admin: Reject a pending registration
  @Patch(':id/reject')
  @Roles('ADMIN')
  async rejectRegistration(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() adminUser: AuthenticatedUser,
  ) {
    return this.usersService.rejectRegistration(id, adminUser, reason);
  }

  // Admin: Update user status directly
  @Patch(':id/status')
  @Roles('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'BLOCKED',
    @CurrentUser() adminUser: AuthenticatedUser,
  ) {
    return this.usersService.updateStatus(id, status, adminUser);
  }

  // Users can only view their own profile, ADMIN can view any
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException('Access Denied: You can only view your own user account.');
    }
    return this.usersService.findOne(id);
  }

  // Only ADMIN can promote/demote user roles
  @Patch(':id/role')
  @Roles('ADMIN')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: 'CLIENT' | 'ADMIN',
  ) {
    return this.usersService.updateRole(id, role);
  }

  // Only ADMIN can grant or revoke product review permissions
  @Patch(':id/review-permission')
  @Roles('ADMIN')
  async updateReviewPermission(
    @Param('id') id: string,
    @Body('canReview') canReview: boolean,
  ) {
    return this.usersService.updateReviewPermission(id, canReview);
  }

  // Users can submit or update their own selfie verification photo
  @Patch(':id/selfie')
  async updateSelfie(
    @Param('id') id: string,
    @Body('selfieImage') selfieImage: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException('Access Denied: You can only update your own selfie.');
    }
    return this.usersService.updateSelfie(id, selfieImage);
  }

  // Users can register their Firebase Cloud Messaging push notification token
  @Patch(':id/fcm-token')
  async updateFcmToken(
    @Param('id') id: string,
    @Body('fcmToken') fcmToken: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException('Access Denied: You can only update your own notification settings.');
    }
    return this.usersService.updateFcmToken(id, fcmToken);
  }
}

