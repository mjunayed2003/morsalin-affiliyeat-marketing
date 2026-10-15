import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-()]/g, '').trim();
  }

  async register(dto: RegisterDto) {
    const cleanPhone = this.normalizePhone(dto.phone);

    if (!cleanPhone || cleanPhone.length < 7) {
      throw new BadRequestException('Phone number must have at least 7 digits.');
    }

    if (!dto.password || dto.password.length < 4) {
      throw new BadRequestException('Password must be at least 4 characters.');
    }

    const existing = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      throw new BadRequestException('A client is already registered with this phone number. Please log in.');
    }

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: cleanPhone,
        name: dto.name.trim(),
        password: hashedPassword,
        email: dto.email ? dto.email.trim() : null,
        address: dto.address ? dto.address.trim() : null,
        city: dto.city ? dto.city.trim() : 'Dhaka',
        verified: true,
        verifiedAt: new Date(),
        role: 'CLIENT',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        avatar: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: 'Account created successfully! Welcome to ProductPerks.',
      user,
    };
  }

  async login(dto: LoginDto) {
    const cleanPhone = this.normalizePhone(dto.phone);

    const user = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (!user) {
      throw new UnauthorizedException('No account found with this phone number. Please register.');
    }

    if (user.password) {
      const isMatch = bcrypt.compareSync(dto.password, user.password);
      if (!isMatch && dto.password !== user.password) {
        throw new UnauthorizedException('Incorrect password. Please try again.');
      }
    }

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      avatar: user.avatar,
      verified: user.verified,
      role: user.role,
      createdAt: user.createdAt,
    };

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: sanitizedUser,
    };
  }

  async getProfile(phone: string) {
    const cleanPhone = this.normalizePhone(phone);
    const user = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        avatar: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }
}
