import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { AuthenticationError, AuthorizationError, ConflicError, DomainError, EntityNotFoundError } from "../../../domain/errors/domain.error.js";
import { Response } from "express";

function resolveStatus(exception: DomainError): HttpStatus {
    if (exception instanceof EntityNotFoundError) return HttpStatus.NOT_FOUND;
    if (exception instanceof ConflicError) return HttpStatus.CONFLICT;
    if (exception instanceof AuthenticationError) return HttpStatus.UNAUTHORIZED;
    if (exception instanceof AuthorizationError) return HttpStatus.FORBIDDEN;
    return HttpStatus.UNPROCESSABLE_ENTITY;
}

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const status = resolveStatus(exception);

        response.status(status).json({
            statusCode: status,
            error: exception.name,
            message: exception.message
        });
    }
}