const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

class DocumentConverter {
  async convertPDFToImages(pdfBuffer, options) {
    const tempPdfPath = path.join(os.tmpdir(), `temp_${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    console.log(`Temporary PDF written to: ${tempPdfPath}`);

    const outputPattern = path.join(os.tmpdir(), `output_%d.png`);
    const gsCommand = `gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r300 -sOutputFile="${outputPattern}" "${tempPdfPath}"`;

    console.log('Running Ghostscript command:');
    console.log(gsCommand);

    exec(gsCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error executing Ghostscript: ${error.message}`);
        fs.unlinkSync(tempPdfPath);
        return;
      }
      if (stderr) {
        console.log(`Ghostscript stderr: ${stderr}`);
      }
      console.log('PDF pages converted to images successfully!');
      console.log(`Images are located with the pattern: ${outputPattern}`);

      try {
        fs.unlinkSync(tempPdfPath);
        console.log(`Temporary PDF removed: ${tempPdfPath}`);
      } catch (unlinkError) {
        console.log(`Error removing temporary PDF: ${unlinkError.message}`);
      }
    })
  }
}

module.exports = {
  DocumentConverter,
};
