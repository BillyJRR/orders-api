export abstract class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export abstract class EntityNotFoundError extends DomainError { }

export abstract class BusinessRuleViolationError extends DomainError { }