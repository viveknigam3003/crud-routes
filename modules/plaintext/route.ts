import { Router, Request, Response } from "express";

const router = Router();

// Sample data templates
const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Emily",
  "David",
  "Sarah",
  "James",
  "Emma",
  "Robert",
  "Olivia",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

/**
 * Generate a single user item
 */
function generateItem(counter: number): any {
  return {
    id: counter,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`,
    email: `user${counter}@example${Math.floor(Math.random() * 1000)}.com`,
    age: Math.floor(Math.random() * 60) + 18,
    city: cities[Math.floor(Math.random() * cities.length)],
  };
}

/**
 * Generate plain text line from item (comma-separated values)
 */
function generatePlainTextLine(item: any): string {
  return `${item.id},${item.name},${item.email},${item.age},${item.city}`;
}

/**
 * Generate large plain text of specified size
 */
function generateLargePlainText(targetSizeInKB: number): string {
  const targetBytes = targetSizeInKB * 1024;
  let textContent = "";
  let currentSize = 0;

  let counter = 0;
  let checkInterval = 1;
  let avgItemSize = 0;

  while (currentSize < targetBytes) {
    const item = generateItem(counter);
    const line = generatePlainTextLine(item) + "\n";
    textContent += line;
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = Buffer.byteLength(textContent, "utf8");

      // After first 5 items, calculate average and adjust strategy
      if (counter === 5 && avgItemSize === 0) {
        avgItemSize = currentSize / counter;
        const estimatedTotalItems = Math.ceil(targetBytes / avgItemSize);

        if (estimatedTotalItems < 50) {
          checkInterval = 1;
        } else {
          checkInterval = Math.max(10, Math.floor(estimatedTotalItems * 0.05));
        }
      }

      // When close to target, check every item
      if (avgItemSize > 0 && targetBytes - currentSize < avgItemSize * 2) {
        checkInterval = 1;
      }
    }
  }

  return textContent;
}

/**
 * GET /api/v1/plaintext
 * Serves a plain text response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *
 * Examples:
 *   GET /api/v1/plaintext?size=500
 *   GET /api/v1/plaintext?size=15360&stream=true
 */
router.get("/", (req: Request, res: Response) => {
  try {
    const requestedSize = parseInt(req.query.size as string) || 100;
    const shouldStream =
      req.query.stream === "true" || req.query.stream === "1";

    // Limit the size to prevent abuse (max 102400 KB = 100 MB)
    const size = Math.min(Math.max(requestedSize, 1), 102400);

    console.log(
      `[INFO] ${
        shouldStream ? "Streaming" : "Generating"
      } Plain Text response of ${size} KB...`
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      const targetBytes = size * 1024;
      let currentSize = 0;
      let counter = 0;

      const streamChunk = () => {
        if (currentSize >= targetBytes) {
          res.end();
          console.log(
            `[INFO] Finished streaming ${counter} records (${(
              currentSize / 1024
            ).toFixed(2)} KB)`
          );
          return;
        }

        // Generate batch of 500 lines
        const batchSize = 500;
        for (let i = 0; i < batchSize && currentSize < targetBytes; i++) {
          const item = generateItem(counter);
          const line = generatePlainTextLine(item) + "\n";
          res.write(line);
          currentSize += Buffer.byteLength(line, "utf8");
          counter++;
        }

        setImmediate(streamChunk);
      };

      streamChunk();
    } else {
      // Regular response
      const startTime = Date.now();
      const textData = generateLargePlainText(size);
      const generationTime = Date.now() - startTime;

      const actualSize = Buffer.byteLength(textData, "utf8");
      const recordCount = textData.split("\n").length - 1; // Subtract trailing newline

      console.log(
        `[INFO] Generated Plain Text with ${recordCount} records (${(
          actualSize / 1024
        ).toFixed(2)} KB) in ${generationTime}ms`
      );

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("X-Records-Count", recordCount.toString());
      res.setHeader(
        "X-Approximate-Size",
        `${(actualSize / 1024).toFixed(2)} KB`
      );
      res.setHeader("X-Generation-Time", `${generationTime}ms`);

      res.status(200).send(textData);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate Plain Text response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate Plain Text response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
