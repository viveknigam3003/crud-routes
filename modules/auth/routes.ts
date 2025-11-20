import { Router } from "express";
import { ApiKeyService } from "./service";
import { validateCreateApiKey, validateUpdateRateLimit } from "./validator";

const router = Router();
const apiKeyService = new ApiKeyService();

/**
 * Create a new API key
 * POST /api/v1/auth/keys/create
 */
router.post("/keys/create", validateCreateApiKey, async (req, res) => {
  const { name, requestsPerMinute, requestsPerHour, requestsPerDay, metadata } = req.body;

  try {
    const apiKey = await apiKeyService.createApiKey({
      name,
      requestsPerMinute,
      requestsPerHour,
      requestsPerDay,
      metadata,
    });

    res.status(201).json({
      message: "API key created successfully",
      apiKey: {
        key: apiKey.key,
        name: apiKey.name,
        isActive: apiKey.isActive,
        rateLimit: apiKey.rateLimit,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(error.code || 500).json({
      error: "Failed to create API key",
      message: error.message,
    });
  }
});

/**
 * List all API keys
 * GET /api/v1/auth/keys/list
 */
router.get("/keys/list", async (req, res) => {
  const { includeInactive } = req.query;

  try {
    const keys = await apiKeyService.listApiKeys({
      includeInactive: includeInactive === "true",
    });

    // Don't expose the full key in the list, only show partial
    const sanitizedKeys = keys.map((key) => ({
      id: key._id,
      name: key.name,
      keyPreview: `${key.key.substring(0, 12)}...${key.key.substring(key.key.length - 4)}`,
      isActive: key.isActive,
      rateLimit: key.rateLimit,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
      metadata: key.metadata,
    }));

    res.status(200).json({
      count: sanitizedKeys.length,
      keys: sanitizedKeys,
    });
  } catch (error: any) {
    return res.status(error.code || 500).json({
      error: "Failed to list API keys",
      message: error.message,
    });
  }
});

/**
 * Get API key details
 * GET /api/v1/auth/keys/details?key=<api-key>
 */
router.get("/keys/details", async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({
      error: "Bad Request",
      message: "API key is required",
    });
  }

  try {
    const apiKey = await apiKeyService.getApiKeyDetails(key as string);

    res.status(200).json({
      id: apiKey._id,
      name: apiKey.name,
      keyPreview: `${apiKey.key.substring(0, 12)}...${apiKey.key.substring(apiKey.key.length - 4)}`,
      isActive: apiKey.isActive,
      rateLimit: apiKey.rateLimit,
      lastUsedAt: apiKey.lastUsedAt,
      createdAt: apiKey.createdAt,
      metadata: apiKey.metadata,
    });
  } catch (error: any) {
    return res.status(error.code || 500).json({
      error: "Failed to get API key details",
      message: error.message,
    });
  }
});

/**
 * Revoke an API key
 * DELETE /api/v1/auth/keys/revoke?key=<api-key>
 */
router.delete("/keys/revoke", async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({
      error: "Bad Request",
      message: "API key is required",
    });
  }

  try {
    const apiKey = await apiKeyService.revokeApiKey(key as string);

    res.status(200).json({
      message: "API key revoked successfully",
      key: {
        name: apiKey.name,
        isActive: apiKey.isActive,
      },
    });
  } catch (error: any) {
    return res.status(error.code || 500).json({
      error: "Failed to revoke API key",
      message: error.message,
    });
  }
});

/**
 * Update API key rate limits
 * PATCH /api/v1/auth/keys/rate-limit?key=<api-key>
 */
router.patch("/keys/rate-limit", validateUpdateRateLimit, async (req, res) => {
  const { key } = req.query;
  const { requestsPerMinute, requestsPerHour, requestsPerDay } = req.body;

  if (!key) {
    return res.status(400).json({
      error: "Bad Request",
      message: "API key is required",
    });
  }

  try {
    const apiKey = await apiKeyService.updateRateLimits(key as string, {
      requestsPerMinute,
      requestsPerHour,
      requestsPerDay,
    });

    res.status(200).json({
      message: "Rate limits updated successfully",
      key: {
        name: apiKey.name,
        rateLimit: apiKey.rateLimit,
      },
    });
  } catch (error: any) {
    return res.status(error.code || 500).json({
      error: "Failed to update rate limits",
      message: error.message,
    });
  }
});

export default router;

