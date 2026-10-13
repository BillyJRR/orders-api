import { createParamDecorator, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../../../application/ports/token.service.js';
import type { AuthenticatedRequest } from '../authenticated-request.js';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
        throw new UnauthorizedException('Unauthenticated user');
    }

    return request.user;
});