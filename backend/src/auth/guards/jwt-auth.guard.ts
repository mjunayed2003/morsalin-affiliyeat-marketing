import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException('Authentication token is required to access this resource.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'morsalin_affiliate_super_secure_jwt_token_secret_key_2026_x87123',
      });

      const userId = (payload.sub || payload.id) as string;
      const dbUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          phone: true,
          role: true,
          name: true,
          email: true,
          status: true,
          canReview: true,
        },
      });

      if (!dbUser) {
        if (isPublic) return true;
        throw new UnauthorizedException('User account no longer exists.');
      }

      // Enforce live approval status on every protected request
      if (dbUser.role !== 'ADMIN') {
        if (dbUser.status === 'PENDING') {
          throw new UnauthorizedException('Your account is awaiting administrator approval.');
        }
        if (dbUser.status === 'REJECTED') {
          throw new UnauthorizedException('Your registration was not approved by the administrator.');
        }
        if (dbUser.status === 'BLOCKED') {
          throw new UnauthorizedException('Your account has been suspended or blocked.');
        }
      }

      // Bind verified database user object to request
      request.user = {
        id: dbUser.id,
        phone: dbUser.phone,
        role: dbUser.role,
        name: dbUser.name,
        email: dbUser.email,
        status: dbUser.status,
        canReview: dbUser.canReview,
      };

      return true;
    } catch (err: any) {
      if (isPublic) {
        return true;
      }
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid, expired, or corrupted authentication token.');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    // Fallback: check x-access-token header
    const customHeader = request.headers['x-access-token'];
    if (customHeader && typeof customHeader === 'string') {
      return customHeader;
    }

    return undefined;
  }
}
