import { BusinessRuleViolationError } from "../../../../shared/domain/errors/domain.error.js";

export class ProductNotAvailableError extends BusinessRuleViolationError {
    constructor(productId: string) {
        super(`Product ${productId} is not available`);
    }
}