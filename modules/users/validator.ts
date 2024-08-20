import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { validateRequest } from '../common/validate';

const validateNewUser = (req: Request, res: Response, next: NextFunction) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
  });

  validateRequest(req, res, next, userSchema);
};

export { validateNewUser };