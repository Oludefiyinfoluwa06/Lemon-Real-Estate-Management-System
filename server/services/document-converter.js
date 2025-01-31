const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const sharp = require("sharp");
const pdf2image = require("pdf2image");

class DocumentConverter {
  async convertDocToImages(file, options = {}) {
    const {
      quality = 80,
      format = "jpeg",
      width = 1700,
    } = options;

    let documentBuffer;

    if (typeof file === "string") {
      documentBuffer = fs.readFileSync(file);
    } else if (file instanceof Buffer) {
      documentBuffer = file;
    } else {
      throw new Error("Invalid file input. Provide file path or buffer.");
    }

    const fileExt = path
      .extname(typeof file === "string" ? file : "document.docx")
      .toLowerCase();

    const supportedExtensions = [".doc", ".docx", ".pdf"];
    if (!supportedExtensions.includes(fileExt)) {
      throw new Error(
        `Unsupported file type: ${fileExt}. Supported types: ${supportedExtensions.join(", ")}`,
      );
    }

    if ([".doc", ".docx"].includes(fileExt)) {
      return this.convertWordToImages(documentBuffer, {
        quality,
        format,
        width,
      });
    } else if (fileExt === ".pdf") {
      return this.convertPDFToImages(documentBuffer, {
        quality,
        format,
        width,
      });
    }
  }

  async convertWordToImages(documentBuffer, options) {
    try {
      const { value: htmlContent } = await mammoth.convertToHtml({
        buffer: documentBuffer,
      });

      const tempHTMLPath = path.join(process.cwd(), "temp_document.html");
      fs.writeFileSync(
        tempHTMLPath,
        `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body {
                    width: ${options.width}px;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                  }
              </style>
          </head>
          <body>${htmlContent}</body>
          </html>
        `,
      );

      const puppeteer = require("puppeteer");
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setViewport({ width: options.width, height: 1000 });

      await page.goto(`file://${tempHTMLPath}`, { waitUntil: "networkidle0" });

      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.setViewport({ width: options.width, height: bodyHeight });

      const imageBuffers = [];
      const screenshot = await page.screenshot({
        fullPage: true,
        type: options.format,
        quality: options.quality / 100,
      });

      const processedImage = await sharp(screenshot)
        .toFormat(options.format)
        .jpeg({ quality: options.quality })
        .toBuffer();

      imageBuffers.push(processedImage);

      await browser.close();
      fs.unlinkSync(tempHTMLPath);

      return imageBuffers;
    } catch (error) {
      throw new Error(`Word to image conversion failed: ${error.message}`);
    }
  }

  async convertPDFToImages(pdfBuffer, options) {
    try {
      const pages = await pdf2image.convertPDF(pdfBuffer, {
        width: options.width,
        height: 3300,
        pageNumber: 0,
      });

      const imageBuffers = await Promise.all(
        pages.map(async (pageBuffer) => {
          return sharp(pageBuffer)
            .toFormat(options.format)
            .jpeg({ quality: options.quality })
            .toBuffer();
        }),
      );

      return imageBuffers;
    } catch (error) {
      throw new Error(`PDF to image conversion failed: ${error.message}`);
    }
  }
}

module.exports = {
  DocumentConverter,
};
