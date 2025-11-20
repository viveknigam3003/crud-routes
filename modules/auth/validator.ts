import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const createApiKeySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  requestsPerMinute: Joi.number().integer().min(1).max(1000).optional(),
  requestsPerHour: Joi.number().integer().min(1).max(100000).optional(),
  requestsPerDay: Joi.number().integer().min(1).max(1000000).optional(),
  metadata: Joi.object().optional(),
});

const updateRateLimitSchema = Joi.object({
  requestsPerMinute: Joi.number().integer().min(1).max(1000).optional(),
  requestsPerHour: Joi.number().integer().min(1).max(100000).optional(),
  requestsPerDay: Joi.number().integer().min(1).max(1000000).optional(),
}).min(1); // At least one field must be provided

export const validateCreateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createApiKeySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    });
  }

  next();
};

export const validateUpdateRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateRateLimitSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    });
  }

  next();
};

