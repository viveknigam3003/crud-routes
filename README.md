# TSMongEx (tsmongex)
A superquick TypeScript + Nodejs + Express + MongoDB Starter Template with Nodemon setup. Get started with your next server in seconds! 

## ✨ Features

- 🚀 TypeScript + Express + MongoDB
- 🔐 API Key Authentication with Rate Limiting
- 📊 Request Logging
- ⚡ Hot Reload with Nodemon
- 🎯 CRUD Operations Examples
- 📝 Multiple Data Format Support (JSON, XML, YAML)
- 🔧 Modular Architecture

## 🚀 How to get started?

It's super easy to get started with this template. Just click on __Use this template__ and follow the instructions to setup your repository.

![image](https://user-images.githubusercontent.com/30192068/119990721-4e2eb800-bfe6-11eb-960b-d120783cc5c2.png)

Once your repository is setup, clone it and install the dependencies

```shell
npm install
```

Set up your environment variables by creating a `.env` file:

```shell
cp .env.example .env
```

And use the following script to start the server in development mode:

```shell
npm run dev
```

This will run your server on `PORT: 8001`. Port is defined in `index.ts` and you can change it to any valid port.

## 🔄 Running Server in Background

Use the control script to run the server in background:

```bash
# Start server (builds and runs in background)
./crud-server.sh start

# Stop server
./crud-server.sh stop

# Restart server
./crud-server.sh restart

# Check status & memory usage
./crud-server.sh status

# View logs
./crud-server.sh logs
```

**Memory optimized for lightweight serving:**
- Idle: ~30-50MB
- Under Load: ~80-120MB
- Max Heap: 128MB

## 🔐 API Key Authentication & Rate Limiting

Built-in API key authentication with rate limiting protects your server from excessive requests.

### Quick Start

1. **Create an API Key**:
   ```bash
   curl -X POST http://localhost:8001/api/v1/auth/keys/create \
     -H "Content-Type: application/json" \
     -d '{"name": "My App Key"}'
   ```

2. **Use the API Key**:
   ```bash
   curl http://localhost:8001/api/v1/users/info?userId=123 \
     -H "x-api-key: pk_your_key_here"
   ```

3. **Enable Authentication** (optional - uncomment in `index.ts`):
   ```typescript
   app.use(authenticateApiKey);
   app.use(createApiKeyRateLimiter());
   ```

**Default Rate Limits**: 60/min, 1000/hour, 10000/day (customizable per key)

📖 **Full Guide**: [API_KEY_SETUP.md](API_KEY_SETUP.md) | 🧪 **Test**: `bash test-api-keys.sh`

## 📁 Project Structure

```
├── modules/
│   ├── auth/           # API Key authentication & rate limiting
│   ├── common/         # Shared utilities (errors, logger, validators)
│   ├── users/          # User CRUD operations
│   ├── kvstore/        # Key-Value store operations
│   ├── json/           # JSON data handling
│   ├── xml/            # XML data handling
│   └── yaml/           # YAML data handling
├── postman/            # Postman collections & environments
├── index.ts            # Main application entry point
└── database.ts         # MongoDB connection setup
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/keys/create` - Create a new API key
- `GET /api/v1/auth/keys/list` - List all API keys
- `DELETE /api/v1/auth/keys/revoke` - Revoke an API key
- `PATCH /api/v1/auth/keys/rate-limit` - Update rate limits

### Users
- `GET /api/v1/users/info` - Get user information
- `POST /api/v1/users/create` - Create a new user
- `PATCH /api/v1/users/update` - Update user
- `DELETE /api/v1/users/delete` - Delete user

### Other Endpoints
- `/api/v1/store/*` - Key-Value store operations
- `/api/v1/json/*` - JSON operations
- `/api/v1/xml/*` - XML operations
- `/api/v1/yaml/*` - YAML operations

## References

This template is inspired by a minimal version TsNodex by Resuminator team. You can find the original repository [here](https://github.com/resuminator/tsnodex).