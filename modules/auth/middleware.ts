import { Request, Response, NextFunction } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { ApiKeyService } from "./service";
import { IApiKey } from "./models";

const apiKeyService = new ApiKeyService();

// Extend Express Request type to include apiKey
declare global {
  namespace Express {
    interface Request {
      apiKey?: IApiKey;
    }
  }
}

/**
 * Middleware to authenticate API key
 */
export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get API key from header or query parameter
    const apiKey =
      (req.headers["x-api-key"] as string) ||
      (req.query.apiKey as string) ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!apiKey) {
      return res.status(401).json({
        error: "Unauthorized",
        message:
          "API key is required. Provide it via 'x-api-key' header or 'apiKey' query parameter.",
      });
    }

    // Validate the API key
    const validatedKey = await apiKeyService.validateApiKey(apiKey);
    req.apiKey = validatedKey;

    next();
  } catch (error: any) {
    return res.status(error.code || 401).json({
      error: "Unauthorized",
      message: error.message || "Invalid API key",
    });
  }
};

/**
 * Create a rate limiter based on API key
 */
export const createApiKeyRateLimiter = () => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (req: Request) => {
      // Use API key as the identifier for rate limiting
      // Use ipKeyGenerator helper to properly handle IPv6 addresses
      return req.apiKey?.key || (req.ip ? ipKeyGenerator(req.ip) : "unknown");
    },
    max: (req: Request) => {
      // Use the API key's configured rate limit
      return req.apiKey?.rateLimit.requestsPerMinute || 60;
    },
    message: {
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. You are allowed ${
          req.apiKey?.rateLimit.requestsPerMinute || 60
        } requests per minute.`,
        limit: req.apiKey?.rateLimit.requestsPerMinute || 60,
      });
    },
  });
};

/**
 * Optional middleware to bypass authentication for specific routes
 */
export const optionalApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey =
      (req.headers["x-api-key"] as string) ||
      (req.query.apiKey as string) ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (apiKey) {
      const validatedKey = await apiKeyService.validateApiKey(apiKey);
      req.apiKey = validatedKey;
    }

    next();
  } catch (error) {
    // If API key validation fails, just continue without it
    next();
  }
};
