import { Router, Request, Response } from "express";

const router = Router();

// Sample data for dynamic XML generation
const authors = [
  "Smith, John",
  "Johnson, Emily",
  "Williams, Michael",
  "Brown, Sarah",
  "Davis, James",
  "Miller, Emma",
  "Wilson, Robert",
  "Moore, Olivia",
  "Taylor, David",
  "Anderson, Sophia",
];

const genres = [
  "Computer",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Biography",
  "History",
  "Self-Help",
];

const titleWords = [
  "Guide",
  "Journey",
  "Mystery",
  "Tales",
  "Chronicles",
  "Secrets",
  "Dreams",
  "Legacy",
  "Quest",
  "Adventures",
  "Masters",
  "Kingdom",
  "Empire",
  "Future",
  "Past",
];

/**
 * Generate a single XML book entry
 */
function generateXmlBook(id: number): string {
  const author = authors[Math.floor(Math.random() * authors.length)];
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const title = `${titleWords[Math.floor(Math.random() * titleWords.length)]} ${
    titleWords[Math.floor(Math.random() * titleWords.length)]
  }`;
  const price = (Math.random() * 95 + 5).toFixed(2);
  const year = Math.floor(Math.random() * 25) + 2000;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const publishDate = `${year}-${month}-${day}`;
  const description = `A compelling ${genre.toLowerCase()} novel by ${author}. This book explores themes of adventure, discovery, and human nature through an engaging narrative that captivates readers from start to finish.`;

  return `  <book id="bk${String(id).padStart(5, "0")}">
    <author>${author}</author>
    <title>${title}</title>
    <genre>${genre}</genre>
    <price>${price}</price>
    <publish_date>${publishDate}</publish_date>
    <description>${description}</description>
  </book>`;
}

/**
 * Generate dynamic XML catalog of specified size
 */
function generateDynamicXml(targetSizeInKB: number): string {
  const targetBytes = targetSizeInKB * 1024;
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n';
  const xmlFooter = "\n</catalog>";

  let xmlContent = xmlHeader;
  let currentSize = Buffer.byteLength(xmlContent + xmlFooter, "utf8");
  let counter = 0;
  let checkInterval = 1;
  let avgItemSize = 0;

  while (currentSize < targetBytes) {
    const bookXml = generateXmlBook(counter);
    xmlContent += (counter > 0 ? "\n" : "") + bookXml;
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = Buffer.byteLength(xmlContent + xmlFooter, "utf8");

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

  return xmlContent + xmlFooter;
}

/**
 * GET /api/v1/xml
 * Serves an XML response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *
 * Examples:
 *   GET /api/v1/xml?size=500
 *   GET /api/v1/xml?size=15360&stream=true
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
      } XML response of ${size} KB...`
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Transfer-Encoding", "chunked");

      // Start the XML document
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n');

      const targetBytes = size * 1024;
      let currentSize = Buffer.byteLength(
        '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n</catalog>',
        "utf8"
      );
      let counter = 0;

      // Use setImmediate for non-blocking streaming
      const streamChunk = () => {
        if (currentSize >= targetBytes) {
          res.write("\n</catalog>");
          res.end();
          const sizeInKB = (currentSize / 1024).toFixed(2);
          console.log(
            `[INFO] Finished streaming ${counter} books (${sizeInKB} KB)`
          );
          return;
        }

        // Generate and write a larger batch (100 items at a time for efficiency)
        const batchSize = 100;
        for (let i = 0; i < batchSize && currentSize < targetBytes; i++) {
          const bookXml = generateXmlBook(counter);
          const chunk = (counter > 0 ? "\n" : "") + bookXml;
          res.write(chunk);
          currentSize += Buffer.byteLength(chunk + "\n</catalog>", "utf8");
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
      const xmlData = generateDynamicXml(size);
      const generationTime = Date.now() - startTime;

      const actualSize = Buffer.byteLength(xmlData, "utf8");
      const bookCount = (xmlData.match(/<book/g) || []).length;

      console.log(
        `[INFO] Generated XML with ${bookCount} books (${(
          actualSize / 1024
        ).toFixed(2)} KB) in ${generationTime}ms`
      );

      // Set appropriate headers
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("X-Book-Count", bookCount.toString());
      res.setHeader(
        "X-Approximate-Size",
        `${(actualSize / 1024).toFixed(2)} KB`
      );
      res.setHeader("X-Generation-Time", `${generationTime}ms`);

      res.status(200).send(xmlData);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate XML response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate XML response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
