import { User } from '../../../domain/entities/user.entity.js';
import type { UserRole } from '../../../domain/entities/user-role.js';
import { UserOrmEntity } from '../orm-entities/user.orm-entity.js';

export class UserMapper {
    static toDomain(row: UserOrmEntity): User {
        return User.restore({
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash,
            fullName: row.fullName,
            role: row.role as UserRole,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

    static toOrm(user: User): UserOrmEntity {
        return Object.assign(new UserOrmEntity(), user.toPrimitives());
    }
}