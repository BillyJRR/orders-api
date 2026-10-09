import { EntityNotFoundError } from "../../../../shared/domain/errors/domain.error.js";

export class ProductNotFoundError extends EntityNotFoundError {
    constructor(id: string) {
        super(`Product with id ${id} not found`);
    }
}