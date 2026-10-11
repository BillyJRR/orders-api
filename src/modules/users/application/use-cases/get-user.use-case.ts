import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repository.js";
import { toUserOutput, type UserOutput } from "../dtos/user.output.js";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error.js";

@Injectable()
export class GetUserUseCase {
    constructor(
        private readonly users: UserRepository
    ) { }

    async execute(id: string): Promise<UserOutput> {
        const user = await this.users.findById(id);

        if (!user) {
            throw new UserNotFoundError(id);
        }

        return toUserOutput(user.toPrimitives());
    }
}