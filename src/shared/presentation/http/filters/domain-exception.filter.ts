import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { DomainError, EntityNotFoundError } from "../../../domain/errors/domain.error.js";
import { Response } from "express";

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const status =
            exception instanceof EntityNotFoundError
                ? HttpStatus.NOT_FOUND
                : HttpStatus.UNPROCESSABLE_ENTITY;

        response.status(status).json({
            statusCode: status,
            error: exception.name,
            message: exception.message
        });
    }
}