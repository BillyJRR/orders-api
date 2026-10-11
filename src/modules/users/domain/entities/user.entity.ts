import { randomUUID } from "node:crypto";
import { InvalidUserError } from "../errors/invalid-user.error.js";
import { UserRole } from "./user-role.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserPrimitives {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserProps {
    email: string;
    passwordHash: string;
    fullName: string;
    role?: UserRole;
}

export class User {
    private constructor(
        private readonly props: UserPrimitives
    ) { }

    static create(input: CreateUserProps): User {
        const email = input.email.trim().toLowerCase();
        const fullName = input.fullName.trim();

        if (!EMAIL_PATTERN.test(email)) {
            throw new InvalidUserError('The email does not have a valid format');
        }

        if (fullName.length === 0) {
            throw new InvalidUserError('The name is required');
        }

        if (input.passwordHash.length === 0) {
            throw new InvalidUserError('The password hash is required');
        }

        const now = new Date();

        return new User({
            id: randomUUID(),
            email,
            passwordHash: input.passwordHash,
            fullName,
            role: input.role ?? 'customer',
            createdAt: now,
            updatedAt: now,
        });

    }

    static restore(props: UserPrimitives): User {
        return new User({ ...props });
    }

    get id(): string {
        return this.props.id;
    }

    get email(): string {
        return this.props.email;
    }

    get passwordHash(): string {
        return this.props.passwordHash;
    }

    get role(): UserRole {
        return this.props.role;
    }

    toPrimitives(): UserPrimitives {
        return { ...this.props };
    }
}