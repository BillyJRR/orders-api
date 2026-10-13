import { ConflicError } from "../../../../shared/domain/errors/domain.error.js";

export class InvalidOrderStatusTransitionError extends ConflicError {
    constructor(from: string, to: string) {
        super(`An order cannot be placed from ${from} to ${to}`);
    }
}