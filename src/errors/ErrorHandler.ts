import { Request, Response, NextFunction } from "express";
import { BaseError } from "./BaseError";
import { AuthError } from "./AuthError";
import { DatabaseError } from "./DatabaseError";
import { RegistrationError } from "./RegistrationError";
import { logger } from "../lib/logger";
import { OrderError } from './OrderError';
import { NotFoundError } from './NotFoundError';

export function errorHandler(error:BaseError, req: Request, res: Response, next: NextFunction) {

  if (error instanceof RegistrationError) {
    logger.error(error);
    return res.status(400).json(error);
  }
  if (error instanceof OrderError) {
    logger.error(error);
    return res.status(400).json(error);
  }
  if (error instanceof AuthError) {
    logger.error(error);
    return res.status(401).json(error);
  }
  if (error.name === 'AuthenticationError') {
    logger.error(error.message);
    return res.status(403).json(error);
  }
  if (error instanceof DatabaseError) {
    logger.error(error);
    return res.status(500).json(error);
  }
  if (error instanceof NotFoundError) {
    logger.error(error);
    return res.status(404).json(error);
  }

  logger.error(error.message);
  return res.status(404).render('error');

}