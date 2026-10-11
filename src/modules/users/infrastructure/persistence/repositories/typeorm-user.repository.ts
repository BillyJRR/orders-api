import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity.js';
import { EmailAlreadyRegisteredError } from '../../../domain/errors/email-already-registered.error.js';
import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { UserOrmEntity } from '../orm-entities/user.orm-entity.js';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repository: Repository<UserOrmEntity>,
    ) { }

    async save(user: User): Promise<void> {
        try {
            await this.repository.save(UserMapper.toOrm(user));
        } catch (error) {
            if (error instanceof QueryFailedError && (error.driverError as { code?: string }).code === UNIQUE_VIOLATION) {
                throw new EmailAlreadyRegisteredError(user.email);
            }
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? UserMapper.toDomain(row) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = await this.repository.findOne({ where: { email } });
        return row ? UserMapper.toDomain(row) : null;
    }
}