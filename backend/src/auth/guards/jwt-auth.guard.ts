import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
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

      // Bind user object to request
      request.user = {
        id: payload.sub || payload.id,
        phone: payload.phone,
        role: payload.role,
        name: payload.name,
        email: payload.email,
      };

      return true;
    } catch {
      if (isPublic) {
        return true;
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
