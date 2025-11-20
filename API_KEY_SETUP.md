# 🔐 API Key Authentication Guide

This API includes built-in API key authentication with rate limiting to protect against excessive requests.

## Quick Start

### 1. Enable Authentication (Optional)

Open `index.ts` and uncomment these lines:

```typescript
app.use(authenticateApiKey);
app.use(createApiKeyRateLimiter());
```

### 2. Create an API Key

Start your server and create a key:

```bash
curl -X POST http://localhost:8001/api/v1/auth/keys/create \
  -H "Content-Type: application/json" \
  -d '{"name": "My App Key"}'
```

**⚠️ Save the returned API key** - it won't be shown in full again!

### 3. Use Your API Key

Include the key in your requests using **any** of these methods:

**Option 1: Header (Recommended)**
```bash
curl http://localhost:8001/api/v1/users/info?userId=123 \
  -H "x-api-key: pk_your_key_here"
```

**Option 2: Authorization Header**
```bash
curl http://localhost:8001/api/v1/users/info?userId=123 \
  -H "Authorization: Bearer pk_your_key_here"
```

**Option 3: Query Parameter**
```bash
curl "http://localhost:8001/api/v1/users/info?userId=123&apiKey=pk_your_key_here"
```

## API Endpoints

### Create Key
```bash
POST /api/v1/auth/keys/create
Body: {
  "name": "string (required)",
  "requestsPerMinute": 60,    // optional
  "requestsPerHour": 1000,    // optional
  "requestsPerDay": 10000     // optional
}
```

### List Keys
```bash
GET /api/v1/auth/keys/list?includeInactive=false
```

### Get Key Details
```bash
GET /api/v1/auth/keys/details?key=pk_your_key
```

### Update Rate Limits
```bash
PATCH /api/v1/auth/keys/rate-limit?key=pk_your_key
Body: {
  "requestsPerMinute": 100,
  "requestsPerHour": 5000
}
```

### Revoke Key
```bash
DELETE /api/v1/auth/keys/revoke?key=pk_your_key
```

## Rate Limits

Default limits per API key:
- **60** requests per minute
- **1,000** requests per hour
- **10,000** requests per day

When exceeded, you'll receive a `429 Too Many Requests` response with details.

## Testing

### Automated Test Script
```bash
bash test-api-keys.sh
```

### Postman Collection
Import `postman/collections/API Key Management.postman_collection.json` for interactive testing.

## Configuration

### Custom Rate Limits
Specify when creating a key:
```bash
curl -X POST http://localhost:8001/api/v1/auth/keys/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Volume Key",
    "requestsPerMinute": 200,
    "requestsPerHour": 10000,
    "requestsPerDay": 100000
  }'
```

### Environment Variables
Add to `.env`:
```env
# Disable rate limiting in development
DISABLE_RATE_LIMIT=false
```

## Security Best Practices

1. **Always use HTTPS in production** - API keys are sensitive
2. **Store keys securely** - Never commit to version control
3. **Rotate keys periodically** - Create new, revoke old
4. **Monitor usage** - Check `lastUsedAt` timestamps
5. **Use appropriate limits** - Start conservative, adjust as needed

## Troubleshooting

**"API key is required"**
- Verify you're including the key in headers or query parameters
- Check the header name is `x-api-key` (lowercase)

**"Invalid or inactive API key"**
- Ensure the key hasn't been revoked
- Verify you copied the complete key

**"Rate limit exceeded"**
- Wait for the window to reset (shown in response headers)
- Create a key with higher limits if needed

---

**🎉 Your API is now protected!**

