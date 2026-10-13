import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '../../../users/application/ports/password-hasher.js';
import { UserRepository } from '../../../users/domain/repositories/user.repository.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import { TokenService, type IssuedToken } from '../ports/token.service.js';

export interface LoginInput {
    email: string;
    password: string;
}

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly users: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenService: TokenService,
    ) { }

    async execute(input: LoginInput): Promise<IssuedToken> {
        const user = await this.users.findByEmail(input.email.trim().toLowerCase());
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const matches = await this.passwordHasher.verify(input.password, user.passwordHash);
        if (!matches) {
            throw new InvalidCredentialsError();
        }

        return this.tokenService.issue({ id: user.id, role: user.role });
    }
}