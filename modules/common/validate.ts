import { NextFunction, Request, Response } from "express";

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: any
): any {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    res.status(422).json(error);
  } else {
    req.body = value;

    next();
  }
}
