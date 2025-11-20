import crypto from "crypto";
import ApiKeyModel, { IApiKey } from "./models";
import { ApplicationError } from "../common/errors";

export class ApiKeyService {
  /**
   * Generate a secure random API key
   */
  private generateApiKey(): string {
    return `pk_${crypto.randomBytes(32).toString("hex")}`;
  }

  /**
   * Create a new API key
   */
  async createApiKey(params: {
    name: string;
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
    metadata?: any;
  }): Promise<IApiKey> {
    const {
      name,
      requestsPerMinute = 60,
      requestsPerHour = 1000,
      requestsPerDay = 10000,
      metadata = {},
    } = params;

    const apiKey = this.generateApiKey();

    const newKey = new ApiKeyModel({
      key: apiKey,
      name,
      isActive: true,
      rateLimit: {
        requestsPerMinute,
        requestsPerHour,
        requestsPerDay,
      },
      metadata,
    });

    await newKey.save();
    return newKey;
  }

  /**
   * Validate an API key
   */
  async validateApiKey(apiKey: string): Promise<IApiKey> {
    const key = await ApiKeyModel.findOne({ key: apiKey, isActive: true });

    if (!key) {
      throw new ApplicationError(401, "Invalid or inactive API key");
    }

    // Update last used timestamp
    key.lastUsedAt = new Date();
    await key.save();

    return key;
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(apiKey: string): Promise<IApiKey> {
    const key = await ApiKeyModel.findOne({ key: apiKey });

    if (!key) {
      throw new ApplicationError(404, "API key not found");
    }

    key.isActive = false;
    await key.save();

    return key;
  }

  /**
   * List all API keys
   */
  async listApiKeys(params: { includeInactive?: boolean } = {}): Promise<IApiKey[]> {
    const { includeInactive = false } = params;

    const query = includeInactive ? {} : { isActive: true };
    return await ApiKeyModel.find(query).sort({ createdAt: -1 });
  }

  /**
   * Get API key details
   */
  async getApiKeyDetails(apiKey: string): Promise<IApiKey> {
    const key = await ApiKeyModel.findOne({ key: apiKey });

    if (!key) {
      throw new ApplicationError(404, "API key not found");
    }

    return key;
  }

  /**
   * Update API key rate limits
   */
  async updateRateLimits(
    apiKey: string,
    rateLimits: {
      requestsPerMinute?: number;
      requestsPerHour?: number;
      requestsPerDay?: number;
    }
  ): Promise<IApiKey> {
    const key = await ApiKeyModel.findOne({ key: apiKey });

    if (!key) {
      throw new ApplicationError(404, "API key not found");
    }

    if (rateLimits.requestsPerMinute !== undefined) {
      key.rateLimit.requestsPerMinute = rateLimits.requestsPerMinute;
    }
    if (rateLimits.requestsPerHour !== undefined) {
      key.rateLimit.requestsPerHour = rateLimits.requestsPerHour;
    }
    if (rateLimits.requestsPerDay !== undefined) {
      key.rateLimit.requestsPerDay = rateLimits.requestsPerDay;
    }

    await key.save();
    return key;
  }
}

