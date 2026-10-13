import { Request } from "express";
import { AuthenticatedUser } from "../../application/ports/token.service.js";

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}