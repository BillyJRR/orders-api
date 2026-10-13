import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHasher } from './application/ports/password-hasher.js';
import { GetUserUseCase } from './application/use-cases/get-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { UserRepository } from './domain/repositories/user.repository.js';
import { UserOrmEntity } from './infrastructure/persistence/orm-entities/user.orm-entity.js';
import { TypeOrmUserRepository } from './infrastructure/persistence/repositories/typeorm-user.repository.js';
import { ScryptPasswordHasher } from './infrastructure/security/scrypt-password-hasher.js';
import { UsersController } from './presentation/http/users.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([UserOrmEntity])],
    controllers: [UsersController],
    providers: [
        RegisterUserUseCase,
        GetUserUseCase,
        { provide: UserRepository, useClass: TypeOrmUserRepository },
        { provide: PasswordHasher, useClass: ScryptPasswordHasher },
    ],
    exports: [UserRepository, PasswordHasher],
})
export class UsersModule { }