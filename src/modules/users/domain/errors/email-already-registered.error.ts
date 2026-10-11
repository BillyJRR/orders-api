import { ConflicError } from "../../../../shared/domain/errors/domain.error.js";

export class EmailAlreadyRegisteredError extends ConflicError {
    constructor(email: string) {
        super(`The email address ${email} is already registered.`);
    }
}