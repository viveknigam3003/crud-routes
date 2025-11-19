import { connect, connection } from "mongoose";

connection.on("connected", () => {
  console.info("[INFO] Mongoose connected to MongoDB");
});

connection.on("error", (err) => {
  console.error("[ERROR] Mongoose connection error", err);
});

connection.on("disconnected", () => {
  console.info("[INFO] Mongoose disconnected from MongoDB");
});

process.on("SIGINT", () => {
  connection.close();
});

const connectToMongo = async () => {
  try {
    // Default to local MongoDB in Docker container
    // You can override this by setting MONGO_URI in your .env file
    const defaultUri = "mongodb://localhost:27017/crud-app";

    // Use MONGO_URI only if it's defined and not empty
    const envUri = process.env.MONGO_URI?.trim();
    const uri = envUri && envUri.length > 0 ? envUri : defaultUri;

    console.info(
      `[INFO] Connecting to MongoDB at ${
        uri.split("@")[1] || uri.split("//")[1]?.split("?")[0]
      }`
    );

    await connect(uri);
    console.info("[INFO] Connected to MongoDB");
  } catch (err: any) {
    console.error(
      "[ERROR] Failed to connect to MongoDB. Reason -",
      err?.message
    );
    console.error("[INFO] Make sure your MongoDB Docker container is running:");
    console.error(
      "      docker run -d -p 27017:27017 --name mongodb mongo:latest"
    );
  }
};

export { connectToMongo };
