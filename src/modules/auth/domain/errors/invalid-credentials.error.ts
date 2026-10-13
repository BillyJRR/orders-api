import { AuthenticationError } from '../../../../shared/domain/errors/domain.error.js';

export class InvalidCredentialsError extends AuthenticationError {
    constructor() {
        super('Invalid credentials');
    }
}