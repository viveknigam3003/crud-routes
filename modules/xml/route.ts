import { Router } from "express";
import * as fs from "fs";
import * as path from "path";

const router = Router();

// Static XML data representing a sample catalog
const staticXML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen of the world.</description>
  </book>
  <book id="bk103">
    <author>Corets, Eva</author>
    <title>Maeve Ascendant</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-11-17</publish_date>
    <description>After the collapse of a nanotechnology society in England, the young survivors lay the foundation for a new society.</description>
  </book>
</catalog>`;

// Path to the large XML catalog file
const largeCatalogPath = path.join(__dirname, "../../large-catalog.xml");

// Read the large XML catalog file
let largeCatalogXML: string;
try {
  largeCatalogXML = fs.readFileSync(largeCatalogPath, "utf8");
  console.info("[INFO] Loaded large XML catalog");
} catch (error: any) {
  console.error("[ERROR] Failed to load large XML catalog:", error.message);
  largeCatalogXML = ""; // Fallback to empty string
}

// GET endpoint to return static XML
router.get("/catalog", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(staticXML);
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

// GET endpoint to return XML info/metadata
router.get("/catalog/info", async (req, res) => {
  try {
    const lines = staticXML.split("\n").length;
    const size = Buffer.byteLength(staticXML, "utf8");
    const bookCount = (staticXML.match(/<book/g) || []).length;

    res.status(200).json({
      name: "Book Catalog XML",
      format: "XML",
      version: "1.0",
      encoding: "UTF-8",
      lines: lines,
      sizeInBytes: size,
      sizeInKB: (size / 1024).toFixed(2),
      books: bookCount,
      endpoint: "/api/v1/xml/catalog",
    });
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

// GET endpoint to return large XML catalog
router.get("/library", async (req, res) => {
  try {
    if (!largeCatalogXML) {
      return res.status(500).send({
        message: "Large XML catalog not available",
      });
    }

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(largeCatalogXML);
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

// GET endpoint to return large catalog metadata
router.get("/library/info", async (req, res) => {
  try {
    const lines = largeCatalogXML.split("\n").length;
    const size = Buffer.byteLength(largeCatalogXML, "utf8");
    const bookCount = (largeCatalogXML.match(/<book/g) || []).length;

    res.status(200).json({
      name: "Global Library Catalog XML",
      format: "XML",
      version: "1.0",
      encoding: "UTF-8",
      lines: lines,
      sizeInBytes: size,
      sizeInKB: (size / 1024).toFixed(2),
      books: bookCount,
      endpoint: "/api/v1/xml/library",
    });
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

export default router;

