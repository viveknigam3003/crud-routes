import { Router } from "express";
import * as fs from "fs";
import * as path from "path";

const router = Router();

// Path to the Spotify OpenAPI spec file
const spotifySpecPath = path.join(__dirname, "../../spotify-openapi.yml");

// Read the Spotify OpenAPI YAML file
let spotifyOpenApiYaml: string;
try {
  spotifyOpenApiYaml = fs.readFileSync(spotifySpecPath, "utf8");
  console.info("[INFO] Loaded Spotify OpenAPI specification");
} catch (error: any) {
  console.error("[ERROR] Failed to load Spotify OpenAPI spec:", error.message);
  spotifyOpenApiYaml = ""; // Fallback to empty string
}

// GET endpoint to return Spotify's OpenAPI spec as YAML
router.get("/spotify", async (req, res) => {
  try {
    if (!spotifyOpenApiYaml) {
      return res.status(500).send({
        message: "Spotify OpenAPI specification not available",
      });
    }

    res.setHeader("Content-Type", "application/x-yaml");
    res.status(200).send(spotifyOpenApiYaml);
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

// GET endpoint to return spec metadata
router.get("/spotify/info", async (req, res) => {
  try {
    const lines = spotifyOpenApiYaml.split("\n").length;
    const size = Buffer.byteLength(spotifyOpenApiYaml, "utf8");

    res.status(200).json({
      name: "Spotify Web API OpenAPI Specification",
      format: "YAML",
      version: "OpenAPI 3.0.3",
      lines: lines,
      sizeInBytes: size,
      sizeInKB: (size / 1024).toFixed(2),
      endpoint: "/api/v1/yaml/spotify",
    });
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

export default router;
