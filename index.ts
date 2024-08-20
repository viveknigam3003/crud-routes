require("dotenv").config();
import cors from "cors";
import express from "express";
import { connectToMongo } from "./database";
import UserRoutes from "./modules/users/routes";
import { logRequest } from "./modules/common/logger";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

app.use(logRequest);
app.use("/api/v1/users", UserRoutes);

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
