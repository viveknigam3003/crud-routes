import { Router, Request, Response } from "express";

const router = Router();

// Sample data templates (shared across functions)
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
const companies = [
  "Tech Corp",
  "Innovate Ltd",
  "Digital Solutions",
  "Future Systems",
  "Cloud Services",
  "Data Analytics Inc",
  "Smart Tech",
  "NextGen Co",
  "Global Systems",
  "Quantum Labs",
];

/**
 * Generate a single item with consistent structure
 */
function generateItem(counter: number): any {
  return {
    id: counter,
    uuid: `${Math.random().toString(36).substring(2, 15)}-${Math.random()
      .toString(36)
      .substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `user${counter}@example${Math.floor(Math.random() * 1000)}.com`,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${
      Math.floor(Math.random() * 900) + 100
    }-${Math.floor(Math.random() * 9000) + 1000}`,
    age: Math.floor(Math.random() * 60) + 18,
    address: {
      street: `${Math.floor(Math.random() * 9999) + 1} ${
        ["Main", "Oak", "Maple", "Pine", "Cedar", "Elm"][
          Math.floor(Math.random() * 6)
        ]
      } Street`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"][
        Math.floor(Math.random() * 10)
      ],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: "USA",
    },
    company: {
      name: companies[Math.floor(Math.random() * companies.length)],
      position: [
        "Software Engineer",
        "Product Manager",
        "Data Analyst",
        "UX Designer",
        "DevOps Engineer",
      ][Math.floor(Math.random() * 5)],
      department: [
        "Engineering",
        "Product",
        "Sales",
        "Marketing",
        "Operations",
      ][Math.floor(Math.random() * 5)],
      salary: Math.floor(Math.random() * 150000) + 50000,
    },
    metadata: {
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: Math.random() > 0.3,
      tags: Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        (_, i) => `tag${i + 1}`
      ),
      score: Math.random() * 100,
      notes: `This is a sample note for user ${counter}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    preferences: {
      notifications: Math.random() > 0.5,
      newsletter: Math.random() > 0.5,
      darkMode: Math.random() > 0.5,
      language: ["en", "es", "fr", "de", "it"][Math.floor(Math.random() * 5)],
      timezone: [
        "America/New_York",
        "America/Los_Angeles",
        "America/Chicago",
        "America/Denver",
      ][Math.floor(Math.random() * 4)],
    },
    activity: {
      lastLogin: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      loginCount: Math.floor(Math.random() * 1000),
      purchases: Math.floor(Math.random() * 50),
      reviews: Math.floor(Math.random() * 20),
    },
  };
}

/**
 * Generate a large JSON payload of specified size
 * This creates an array of objects with various data types
 */
function generateLargeJson(targetSizeInKB: number): any {
  const targetBytes = targetSizeInKB * 1024;
  const items: any[] = [];
  let currentSize = 0;

  let counter = 0;
  let checkInterval = 1; // Start by checking every item
  let avgItemSize = 0;

  while (currentSize < targetBytes) {
    const item = generateItem(counter);

    items.push(item);
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = JSON.stringify(items).length;

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

  return {
    success: true,
    timestamp: new Date().toISOString(),
    totalRecords: items.length,
    approximateSize: `${(JSON.stringify(items).length / 1024).toFixed(2)} KB`,
    data: items,
  };
}

/**
 * GET /api/v1/json
 * Serves a JSON response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *
 * Examples:
 *   GET /api/v1/json?size=500
 *   GET /api/v1/json?size=15360&stream=true
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
      } JSON response of ${size} KB...`
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Transfer-Encoding", "chunked");

      // Start the JSON object
      res.write(
        '{"success":true,"timestamp":"' +
          new Date().toISOString() +
          '","data":['
      );

      const targetBytes = size * 1024;
      let currentSize = 0;
      let counter = 0;

      // Use setImmediate for non-blocking streaming
      const streamChunk = () => {
        if (currentSize >= targetBytes) {
          const sizeInKB = (currentSize / 1024).toFixed(2);
          res.write(
            `],"totalRecords":${counter},"approximateSize":"${sizeInKB} KB"}`
          );
          res.end();
          console.log(
            `[INFO] Finished streaming ${counter} records (${sizeInKB} KB)`
          );
          return;
        }

        // Generate and write a larger batch (500 items at a time for efficiency)
        const batchSize = 500;
        for (let i = 0; i < batchSize && currentSize < targetBytes; i++) {
          if (counter > 0) res.write(",");

          const item = generateItem(counter);
          counter++;

          const chunk = JSON.stringify(item);
          res.write(chunk);
          currentSize += chunk.length;
        }

        // Continue streaming in next tick (non-blocking)
        setImmediate(streamChunk);
      };

      // Start streaming
      streamChunk();
    } else {
      // Regular response
      const data = generateLargeJson(size);

      console.log(
        `[INFO] Generated JSON with ${data.totalRecords} records (${data.approximateSize})`
      );

      // Set appropriate headers
      res.setHeader("Content-Type", "application/json");
      res.setHeader("X-Records-Count", data.totalRecords.toString());
      res.setHeader("X-Approximate-Size", data.approximateSize);

      res.json(data);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate JSON response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate JSON response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
