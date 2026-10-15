import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('Authentication required to verify permissions.');
    }

    const hasRole = requiredRoles.some((role) => user.role?.toUpperCase() === role.toUpperCase());

    if (!hasRole) {
      throw new ForbiddenException(
        `Forbidden resource: Your account role (${user.role}) does not have permission for this route. Required: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
