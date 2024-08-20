import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { validateQuery, validateRequest } from "../common/validate";

export const validateNewUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
  });

  validateRequest(req, res, next, userSchema);
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userUpdateBodySchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    username: Joi.string().forbidden(),
  });

  const userUpdateQuerySchema = Joi.object({
    userId: Joi.string().required(),
  });

  validateQuery(req, res, next, userUpdateQuerySchema);
  validateRequest(req, res, next, userUpdateBodySchema);
};
