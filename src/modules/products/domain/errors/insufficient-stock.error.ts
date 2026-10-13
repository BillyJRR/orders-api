import { ConflicError } from "../../../../shared/domain/errors/domain.error.js";

export class InsufficientStockError extends ConflicError {
    constructor(productId: string, requested: number, available: number) {
        super(`Insufficient stock for product ${productId}: requested ${requested}, available ${available}`);
    }
}