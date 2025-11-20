import { Router, Request, Response } from "express";

const router = Router();

// Sample data templates (shared with JSON route)
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
 * Generate a single user item
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
    isActive: Math.random() > 0.3,
  };
}

/**
 * Generate HTML table row for a user
 */
function generateHtmlRow(item: any): string {
  const statusClass = item.isActive ? "active" : "inactive";
  const statusText = item.isActive ? "✓ Active" : "✗ Inactive";
  return `        <tr>
          <td>${item.id}</td>
          <td>${item.firstName} ${item.lastName}</td>
          <td>${item.email}</td>
          <td>${item.phone}</td>
          <td>${item.age}</td>
          <td>${item.city}, ${item.state}</td>
          <td>${item.company}</td>
          <td>${item.position}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
        </tr>`;
}

/**
 * HTML page header with styling
 */
const HTML_HEADER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Directory - Dynamic HTML Response</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .table-wrapper {
      overflow-x: auto;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    thead {
      background: #f8f9fa;
      position: sticky;
      top: 0;
    }
    th {
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
      white-space: nowrap;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
      color: #212529;
    }
    tbody tr:hover {
      background-color: #f8f9fa;
      transition: background-color 0.2s ease;
    }
    tbody tr:nth-child(even) {
      background-color: #fafafa;
    }
    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }
    .status.active {
      background: #d4edda;
      color: #155724;
    }
    .status.inactive {
      background: #f8d7da;
      color: #721c24;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
      border-top: 1px solid #dee2e6;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 10px;
    }
    .stat-item {
      font-weight: 600;
    }
    .stat-value {
      color: #667eea;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👥 User Directory</h1>
      <p>Dynamically Generated HTML Response</p>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Location</th>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>`;

const HTML_FOOTER_TEMPLATE = (recordCount: number, sizeKB: string) => `
        </tbody>
      </table>
    </div>
    <div class="footer">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">${recordCount}</span> Total Records
        </div>
        <div class="stat-item">
          <span class="stat-value">${sizeKB}</span> KB Response Size
        </div>
      </div>
      <p>Generated at ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>`;

/**
 * Generate HTML page of specified size
 */
function generateLargeHtml(targetSizeInKB: number): string {
  const targetBytes = targetSizeInKB * 1024;
  let htmlContent = HTML_HEADER;
  let currentSize = Buffer.byteLength(htmlContent, "utf8");

  let counter = 0;
  let checkInterval = 1;
  let avgItemSize = 0;

  // Reserve space for footer (approximate)
  const footerSize = 1000;
  const adjustedTargetBytes = targetBytes - footerSize;

  while (currentSize < adjustedTargetBytes) {
    const item = generateItem(counter);
    const row = generateHtmlRow(item);
    htmlContent += row + "\n";
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = Buffer.byteLength(htmlContent, "utf8");

      // After first 5 items, calculate average and adjust strategy
      if (counter === 5 && avgItemSize === 0) {
        avgItemSize = currentSize / counter;
        const estimatedTotalItems = Math.ceil(
          adjustedTargetBytes / avgItemSize
        );

        if (estimatedTotalItems < 50) {
          checkInterval = 1;
        } else {
          checkInterval = Math.max(10, Math.floor(estimatedTotalItems * 0.05));
        }
      }

      // When close to target, check every item
      if (
        avgItemSize > 0 &&
        adjustedTargetBytes - currentSize < avgItemSize * 2
      ) {
        checkInterval = 1;
      }
    }
  }

  const actualSize = Buffer.byteLength(htmlContent, "utf8");
  const footer = HTML_FOOTER_TEMPLATE(counter, (actualSize / 1024).toFixed(2));
  htmlContent += footer;

  return htmlContent;
}

/**
 * GET /api/v1/html
 * Serves an HTML response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *
 * Examples:
 *   GET /api/v1/html?size=500
 *   GET /api/v1/html?size=15360&stream=true
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
      } HTML response of ${size} KB...`
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      res.write(HTML_HEADER);

      const targetBytes = size * 1024;
      let currentSize = Buffer.byteLength(HTML_HEADER, "utf8");
      let counter = 0;
      const footerSize = 1000;

      const streamChunk = () => {
        if (currentSize >= targetBytes - footerSize) {
          const footer = HTML_FOOTER_TEMPLATE(
            counter,
            (currentSize / 1024).toFixed(2)
          );
          res.write(footer);
          res.end();
          console.log(
            `[INFO] Finished streaming ${counter} records (${(
              currentSize / 1024
            ).toFixed(2)} KB)`
          );
          return;
        }

        // Generate batch of 100 rows
        const batchSize = 100;
        for (
          let i = 0;
          i < batchSize && currentSize < targetBytes - footerSize;
          i++
        ) {
          const item = generateItem(counter);
          const row = generateHtmlRow(item) + "\n";
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
      const htmlData = generateLargeHtml(size);
      const generationTime = Date.now() - startTime;

      const actualSize = Buffer.byteLength(htmlData, "utf8");
      const recordCount = (htmlData.match(/<tr>/g) || []).length - 1; // Subtract header row

      console.log(
        `[INFO] Generated HTML with ${recordCount} records (${(
          actualSize / 1024
        ).toFixed(2)} KB) in ${generationTime}ms`
      );

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Records-Count", recordCount.toString());
      res.setHeader(
        "X-Approximate-Size",
        `${(actualSize / 1024).toFixed(2)} KB`
      );
      res.setHeader("X-Generation-Time", `${generationTime}ms`);

      res.status(200).send(htmlData);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate HTML response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate HTML response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
