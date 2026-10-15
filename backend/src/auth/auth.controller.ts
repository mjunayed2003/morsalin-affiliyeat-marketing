import { Controller, Post, Get, Body, Query, Headers } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  async getProfile(
    @Query('phone') phoneQuery?: string,
    @Headers('x-user-phone') phoneHeader?: string,
  ) {
    const phone = phoneQuery || phoneHeader;
    if (!phone) {
      return { success: false, message: 'Phone parameter required' };
    }
    return this.authService.getProfile(phone);
  }
}
