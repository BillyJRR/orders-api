import { EntityNotFoundError } from "../../../../shared/domain/errors/domain.error.js";

export class UserNotFoundError extends EntityNotFoundError {
    constructor(id: string) {
        super(`User with id ${id} not found`);
    }
}