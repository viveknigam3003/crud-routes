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

export const validateUpdateUserQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userUpdateQuerySchema = Joi.object({
    userId: Joi.string().required(),
  });

  validateQuery(req, res, next, userUpdateQuerySchema);
}

export const validateUpdateUserBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userUpdateBodySchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    username: Joi.string().forbidden(),
  });
  
  validateRequest(req, res, next, userUpdateBodySchema);
};

export const validateUserInfoRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInfoQuerySchema = Joi.object({
    // at least one should be present - userId or username
    userId: Joi.string().optional(),
    username: Joi.string().optional(),
  });

  validateQuery(req, res, next, userInfoQuerySchema);
}
