import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('inquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // Authenticated user creates inquiry (auto-bound to caller)
  @Post()
  async create(
    @Body() dto: CreateInquiryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    // Force inquiry to belong to the authenticated user unless ADMIN explicitly supplies it
    const targetUserId = currentUser.role === 'ADMIN' && dto.userId ? dto.userId : currentUser.id;
    return this.inquiriesService.create({
      ...dto,
      userId: targetUserId,
    });
  }

  // Admin can list all, client can only list their own
  @Get()
  async findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query('userId') queryUserId?: string,
  ) {
    if (currentUser.role === 'ADMIN') {
      return this.inquiriesService.findAll(queryUserId);
    }
    // Clients only see their own inquiries
    return this.inquiriesService.findAll(currentUser.id);
  }

  // Admin Only: Approve/reject/update status
  @Patch(':id/status')
  @Roles('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.inquiriesService.updateStatus(id, status);
  }
}
