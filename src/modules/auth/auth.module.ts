import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './application/ports/token.service.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { JwtTokenService } from './infrastructure/jwt-token.service.js';
import { AuthController } from './presentation/http/auth.controller.js';
import { JwtAuthGuard } from './presentation/http/guards/jwt-auth.guard.js';
import { RolesGuard } from './presentation/http/guards/roles.guard.js';
import { UsersModule } from '../users/users.module.js';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: { algorithm: 'HS256' },
                verifyOptions: { algorithms: ['HS256'] },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        { provide: TokenService, useClass: JwtTokenService },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AuthModule { }