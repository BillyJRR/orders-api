import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES, type UserRole } from '../../../domain/entities/user-role.js';
import type { UserOutput } from '../../../application/dtos/user.output.js';

export class UserResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    fullName!: string;

    @ApiProperty({ enum: USER_ROLES })
    role!: UserRole;

    @ApiProperty()
    createdAt!: Date;

    static from(user: UserOutput): UserResponseDto {
        return Object.assign(new UserResponseDto(), user);
    }
}