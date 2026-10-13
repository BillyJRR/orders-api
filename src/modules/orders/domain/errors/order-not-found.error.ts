import { EntityNotFoundError } from "../../../../shared/domain/errors/domain.error.js";

export class OrderNotFoundError extends EntityNotFoundError {
    constructor(id: string) {
        super(`Order with ID ${id} not found`);
    }
}