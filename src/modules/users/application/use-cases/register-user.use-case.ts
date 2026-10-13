import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repository.js";
import { PasswordHasher } from "../ports/password-hasher.js"
import { toUserOutput, type UserOutput } from "../dtos/user.output.js";
import { EmailAlreadyRegisteredError } from "../../domain/errors/email-already-registered.error.js";
import { User } from "../../domain/entities/user.entity.js";

export interface RegisterUserInput {
    email: string;
    password: string;
    fullName: string;
}

@Injectable()
export class RegisterUserUseCase {
    constructor(
        private readonly users: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) { }

    async execute(input: RegisterUserInput): Promise<UserOutput> {
        const email = input.email.trim().toLowerCase();

        if (await this.users.findByEmail(email)) {
            throw new EmailAlreadyRegisteredError(email);
        }

        const passwordHash = await this.passwordHasher.hash(input.password);
        const user = User.create({ email, fullName: input.fullName, passwordHash });
        await this.users.save(user);

        return toUserOutput(user.toPrimitives());
    }
}