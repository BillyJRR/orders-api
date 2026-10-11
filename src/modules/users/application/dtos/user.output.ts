import type { UserRole } from "../../domain/entities/user-role.js";
import { UserPrimitives } from "../../domain/entities/user.entity.js";

export interface UserOutput {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    createAt: Date;
}

export function toUserOutput(user: UserPrimitives): UserOutput {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createAt: user.createdAt,
    };
}