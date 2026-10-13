import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { TokenService } from '../../../application/ports/token.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import type { AuthenticatedRequest } from '../authenticated-request.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = this.extractBearerToken(request);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            request.user = await this.tokenService.verify(token);
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
        return true;
    }

    private extractBearerToken(request: Request): string | null {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' && token ? token : null;
    }
}