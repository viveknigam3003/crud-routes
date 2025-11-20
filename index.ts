require("dotenv").config();
import cors from "cors";
import express from "express";
import { connectToMongo } from "./database";
import UserRoutes from "./modules/users/routes";
import StoreRoutes from "./modules/kvstore/route";
import YamlRoutes from "./modules/yaml/route";
import XmlRoutes from "./modules/xml/route";
import JsonRoutes from "./modules/json/route";
import AuthRoutes from "./modules/auth/routes";
import { logRequest } from "./modules/common/logger";
import {
  authenticateApiKey,
  createApiKeyRateLimiter,
} from "./modules/auth/middleware";

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

app.use(logRequest);

// Auth routes (no authentication required for managing keys)
app.use("/api/v1/auth", AuthRoutes);

// Protected routes with API key authentication and rate limiting
// To enable authentication, uncomment the middleware below
app.use(authenticateApiKey);
app.use(createApiKeyRateLimiter());

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/store", StoreRoutes);
app.use("/api/v1/yaml", YamlRoutes);
app.use("/api/v1/xml", XmlRoutes);
app.use("/api/v1/json", JsonRoutes);

const server = app.listen(port, () => {
  console.info(`[INFO] Server Started on PORT: ${port}`);
});

process.on("SIGINT", () => {
  console.info("[INFO] Gracefully shutting down...");
  server.close(() => {
    console.info("[INFO] Server closed.");
    process.exit(0);
  });
});
