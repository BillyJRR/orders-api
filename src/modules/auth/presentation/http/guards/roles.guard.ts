import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../../../../users/domain/entities/user-role.js';
import type { AuthenticatedRequest } from '../authenticated-request.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission for this action');
        }
        return true;
    }
}