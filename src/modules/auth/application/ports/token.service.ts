import type { UserRole } from '../../../users/domain/entities/user-role.js';

export interface AuthenticatedUser {
    id: string;
    role: UserRole;
}

export interface IssuedToken {
    accessToken: string;
    expiresIn: number;
}

export abstract class TokenService {
    abstract issue(user: AuthenticatedUser): Promise<IssuedToken>;
    abstract verify(token: string): Promise<AuthenticatedUser>;
}