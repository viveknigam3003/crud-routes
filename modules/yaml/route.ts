import { Router, Request, Response } from "express";

const router = Router();

// Sample data for dynamic YAML generation
const services = [
  "authentication",
  "users",
  "payments",
  "notifications",
  "analytics",
  "storage",
  "messaging",
  "search",
  "recommendations",
  "reporting",
];

const environments = ["development", "staging", "production"];
const regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];
const protocols = ["http", "https", "grpc", "websocket"];
const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

/**
 * Generate a single YAML service configuration
 */
function generateYamlService(id: number): string {
  const service = services[Math.floor(Math.random() * services.length)];
  const env = environments[Math.floor(Math.random() * environments.length)];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const port = Math.floor(Math.random() * 9000) + 1000;
  const replicas = Math.floor(Math.random() * 10) + 1;
  const memory = Math.floor(Math.random() * 4) + 1;
  const cpu = (Math.random() * 2 + 0.5).toFixed(1);

  return `
  - id: service-${String(id).padStart(5, "0")}
    name: ${service}-${id}
    environment: ${env}
    region: ${region}
    protocol: ${protocol}
    port: ${port}
    replicas: ${replicas}
    resources:
      memory: ${memory}Gi
      cpu: "${cpu}"
    endpoints:
      - path: /api/v1/${service}
        method: ${methods[Math.floor(Math.random() * methods.length)]}
        timeout: ${Math.floor(Math.random() * 30) + 10}s
      - path: /api/v1/${service}/health
        method: GET
        timeout: 5s
    monitoring:
      enabled: ${Math.random() > 0.3 ? "true" : "false"}
      metrics_port: ${port + 1000}
      health_check_interval: ${Math.floor(Math.random() * 30) + 10}s
    metadata:
      version: ${Math.floor(Math.random() * 10) + 1}.${Math.floor(
    Math.random() * 10
  )}.${Math.floor(Math.random() * 10)}
      last_updated: "${new Date().toISOString()}"
      owner: team-${Math.floor(Math.random() * 10) + 1}
      tags:
        - ${service}
        - ${env}
        - microservice`;
}

/**
 * Generate dynamic YAML configuration of specified size
 */
function generateDynamicYaml(targetSizeInKB: number): string {
  const targetBytes = targetSizeInKB * 1024;
  const yamlHeader = `---
apiVersion: v1
kind: ServiceConfiguration
metadata:
  name: dynamic-services
  timestamp: "${new Date().toISOString()}"
services:`;

  let yamlContent = yamlHeader;
  let currentSize = Buffer.byteLength(yamlContent, "utf8");
  let counter = 0;
  let checkInterval = 1;
  let avgItemSize = 0;

  while (currentSize < targetBytes) {
    const serviceYaml = generateYamlService(counter);
    yamlContent += serviceYaml;
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = Buffer.byteLength(yamlContent, "utf8");

      // After first 5 items, calculate average and adjust strategy
      if (counter === 5 && avgItemSize === 0) {
        avgItemSize = currentSize / counter;
        const estimatedTotalItems = Math.ceil(targetBytes / avgItemSize);

        // For small requests, be more careful
        if (estimatedTotalItems < 50) {
          checkInterval = 1; // Check every item for small requests
        } else {
          // For larger requests, check every 5% but at least every 10 items
          checkInterval = Math.max(10, Math.floor(estimatedTotalItems * 0.05));
        }
      }

      // When we're close to the target (within 2 average items), check every item
      if (avgItemSize > 0 && targetBytes - currentSize < avgItemSize * 2) {
        checkInterval = 1;
      }
    }
  }

  return yamlContent;
}

/**
 * GET /api/v1/yaml
 * Serves a YAML response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *
 * Examples:
 *   GET /api/v1/yaml?size=500
 *   GET /api/v1/yaml?size=15360&stream=true
 */
router.get("/", (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const requestedSize = parseInt(req.query.size as string) || 100;
    console.log("🚀 ~ requestedSize:", requestedSize);
    const shouldStream =
      req.query.stream === "true" || req.query.stream === "1";

    // Limit the size to prevent abuse (max 102400 KB = 100 MB)
    const size = Math.min(Math.max(requestedSize, 1), 102400);

    console.log(
      `[INFO] ${
        shouldStream ? "Streaming" : "Generating"
      } YAML response of ${size} KB...`
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "application/x-yaml");
      res.setHeader("Transfer-Encoding", "chunked");

      // Start the YAML document
      const yamlHeader = `---
apiVersion: v1
kind: ServiceConfiguration
metadata:
  name: dynamic-services
  timestamp: "${new Date().toISOString()}"
services:`;

      res.write(yamlHeader);

      const targetBytes = size * 1024;
      let currentSize = Buffer.byteLength(yamlHeader, "utf8");
      let counter = 0;

      // Use setImmediate for non-blocking streaming
      const streamChunk = () => {
        if (currentSize >= targetBytes) {
          res.end();
          const sizeInKB = (currentSize / 1024).toFixed(2);
          console.log(
            `[INFO] Finished streaming ${counter} services (${sizeInKB} KB)`
          );
          return;
        }

        // Generate and write a larger batch (100 items at a time for efficiency)
        const batchSize = 100;
        for (let i = 0; i < batchSize && currentSize < targetBytes; i++) {
          const serviceYaml = generateYamlService(counter);
          res.write(serviceYaml);
          currentSize += Buffer.byteLength(serviceYaml, "utf8");
          counter++;
        }

        // Continue streaming in next tick (non-blocking)
        setImmediate(streamChunk);
      };

      // Start streaming
      streamChunk();
    } else {
      // Regular response
      const startTime = Date.now();
      const yamlData = generateDynamicYaml(size);
      const generationTime = Date.now() - startTime;

      const actualSize = Buffer.byteLength(yamlData, "utf8");
      const serviceCount = (yamlData.match(/- id: service-/g) || []).length;
      const lines = yamlData.split("\n").length;

      console.log(
        `[INFO] Generated YAML with ${serviceCount} services (${(
          actualSize / 1024
        ).toFixed(2)} KB) in ${generationTime}ms`
      );

      // Set appropriate headers
      res.setHeader("Content-Type", "application/x-yaml");
      res.setHeader("X-Service-Count", serviceCount.toString());
      res.setHeader("X-Line-Count", lines.toString());
      res.setHeader(
        "X-Approximate-Size",
        `${(actualSize / 1024).toFixed(2)} KB`
      );
      res.setHeader("X-Generation-Time", `${generationTime}ms`);

      res.status(200).send(yamlData);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate YAML response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate YAML response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
