import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService, type AuthenticatedUser, type IssuedToken } from '../application/ports/token.service.js';

interface AccessTokenPayload {
    sub: string;
    role: AuthenticatedUser['role'];
}

@Injectable()
export class JwtTokenService implements TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    async issue(user: AuthenticatedUser): Promise<IssuedToken> {
        const expiresIn = this.config.getOrThrow<number>('JWT_EXPIRES_IN_SECONDS');
        const payload: AccessTokenPayload = { sub: user.id, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn });
        return { accessToken, expiresIn };
    }

    async verify(token: string): Promise<AuthenticatedUser> {
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
        return { id: payload.sub, role: payload.role };
    }
}