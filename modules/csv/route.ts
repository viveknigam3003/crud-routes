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
 * Generate a single user item (flattened for CSV)
 */
function generateItem(counter: number): any {
  return {
    id: counter,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `user${counter}@example${Math.floor(Math.random() * 1000)}.com`,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${
      Math.floor(Math.random() * 900) + 100
    }-${Math.floor(Math.random() * 9000) + 1000}`,
    age: Math.floor(Math.random() * 60) + 18,
    city: cities[Math.floor(Math.random() * cities.length)],
    state: ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"][
      Math.floor(Math.random() * 10)
    ],
    company: companies[Math.floor(Math.random() * companies.length)],
    position: [
      "Software Engineer",
      "Product Manager",
      "Data Analyst",
      "UX Designer",
      "DevOps Engineer",
    ][Math.floor(Math.random() * 5)],
  };
}

/**
 * Escape CSV field if it contains comma, quote, or newline
 */
function escapeCsvField(field: any): string {
  const value = String(field);
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Generate CSV row from item
 */
function generateCsvRow(item: any): string {
  return [
    item.id,
    escapeCsvField(item.firstName),
    escapeCsvField(item.lastName),
    escapeCsvField(item.email),
    escapeCsvField(item.phone),
    item.age,
    escapeCsvField(item.city),
    escapeCsvField(item.state),
    escapeCsvField(item.company),
    escapeCsvField(item.position),
  ].join(",");
}

/**
 * CSV header row
 */
const CSV_HEADER =
  "id,firstName,lastName,email,phone,age,city,state,company,position\n";

/**
 * Generate large CSV of specified size
 */
function generateLargeCsv(targetSizeInKB: number): string {
  const targetBytes = targetSizeInKB * 1024;
  let csvContent = CSV_HEADER;
  let currentSize = Buffer.byteLength(csvContent, "utf8");

  let counter = 0;
  let checkInterval = 1;
  let avgItemSize = 0;

  while (currentSize < targetBytes) {
    const item = generateItem(counter);
    const row = generateCsvRow(item) + "\n";
    csvContent += row;
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = Buffer.byteLength(csvContent, "utf8");

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

  return csvContent;
}

/**
 * GET /api/v1/csv
 * Serves a CSV response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *
 * Examples:
 *   GET /api/v1/csv?size=500
 *   GET /api/v1/csv?size=15360&stream=true
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
      } CSV response of ${size} KB...`
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
      res.setHeader("Transfer-Encoding", "chunked");

      res.write(CSV_HEADER);

      const targetBytes = size * 1024;
      let currentSize = Buffer.byteLength(CSV_HEADER, "utf8");
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

        // Generate batch of 500 rows
        const batchSize = 500;
        for (let i = 0; i < batchSize && currentSize < targetBytes; i++) {
          const item = generateItem(counter);
          const row = generateCsvRow(item) + "\n";
          res.write(row);
          currentSize += Buffer.byteLength(row, "utf8");
          counter++;
        }

        setImmediate(streamChunk);
      };

      streamChunk();
    } else {
      // Regular response
      const startTime = Date.now();
      const csvData = generateLargeCsv(size);
      const generationTime = Date.now() - startTime;

      const actualSize = Buffer.byteLength(csvData, "utf8");
      const recordCount = csvData.split("\n").length - 2; // Subtract header and trailing newline

      console.log(
        `[INFO] Generated CSV with ${recordCount} records (${(
          actualSize / 1024
        ).toFixed(2)} KB) in ${generationTime}ms`
      );

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
      res.setHeader("X-Records-Count", recordCount.toString());
      res.setHeader(
        "X-Approximate-Size",
        `${(actualSize / 1024).toFixed(2)} KB`
      );
      res.setHeader("X-Generation-Time", `${generationTime}ms`);

      res.status(200).send(csvData);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate CSV response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate CSV response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
