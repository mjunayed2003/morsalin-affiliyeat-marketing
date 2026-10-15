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
}
