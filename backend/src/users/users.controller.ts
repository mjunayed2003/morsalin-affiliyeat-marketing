import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: 'CLIENT' | 'ADMIN',
  ) {
    return this.usersService.updateRole(id, role);
  }
}
