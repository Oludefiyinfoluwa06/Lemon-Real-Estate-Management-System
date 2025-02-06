const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");
const fileType = require("file-type");
const {
  REGION_MAPPING,
  SECURITY_FEATURE_REQUIREMENTS,
  VALIDATION_RULES,
} = require("../utils");
const { DocumentConverter } = require("./document-converter");

class IDVerificationService {
  constructor() {
    this.apiInstances = {};
    this.supportedFileTypes = ["jpg", "jpeg", "png", "pdf", "doc", "docx"];
    this.maxFileSize = 10 * 1024 * 1024;
  }

  getRegionForCountry(countryCode) {
    for (const [region, countries] of Object.entries(REGION_MAPPING)) {
      if (countries.includes(countryCode)) {
        return region;
      }
    }
    return "US";
  }

  async convertPDFToImage(pdfBuffer) {
    try {
      const pages = await pdf2image.convertPDF(pdfBuffer, {
        width: 2550,
        height: 3300,
        pageNumber: 1,
      });

      return sharp(pages[0]).toFormat("jpeg").toBuffer();
    } catch (error) {
      throw new Error(`PDF conversion error: ${error.message}`);
    }
  }

  async validateDocument(result, documentType, countryCode) {
    const validationRules = this.getValidationRules(documentType, countryCode);
    const validationResults = {
      isValid: true,
      errors: [],
    };

    for (const field of validationRules.requiredFields) {
      if (!result[field]) {
        validationResults.errors.push(`Missing required field: ${field}`);
        validationResults.isValid = false;
      }
    }

    if (
      validationRules.documentNumberFormat &&
      !validationRules.documentNumberFormat.test(result.document_number)
    ) {
      validationResults.errors.push("Invalid document number format");
      validationResults.isValid = false;
    }

    if (validationRules.ageCheck) {
      const age = this.calculateAge(result.dob);
      if (age < validationRules.minAge || age > validationRules.maxAge) {
        validationResults.errors.push(
          `Age ${age} is outside valid range (${validationRules.minAge}-${validationRules.maxAge})`,
        );
        validationResults.isValid = false;
      }
    }

    if (validationRules.expiryRequired) {
      if (!result.expiry_date) {
        validationResults.errors.push("Missing expiry date");
        validationResults.isValid = false;
      } else {
        const daysUntilExpiry = this.calculateDaysUntilExpiry(
          result.expiry_date,
        );
        if (daysUntilExpiry < validationRules.expiryMinDays) {
          validationResults.errors.push(
            `Document expires in ${daysUntilExpiry} days (minimum ${validationRules.expiryMinDays} days required)`,
          );
          validationResults.isValid = false;
        }
      }
    }

    if (validationRules.securityFeatures) {
      for (const feature of validationRules.securityFeatures) {
        const securityRequirements = SECURITY_FEATURE_REQUIREMENTS[feature];
        const featureResult = result.security_features?.[feature];

        if (
          !featureResult ||
          featureResult.confidence < securityRequirements.minConfidence
        ) {
          validationResults.errors.push(
            `Failed security feature check: ${feature}`,
          );
          validationResults.isValid = false;
        }
      }
    }

    return validationResults;
  }

  getValidationRules(documentType, countryCode) {
    if (VALIDATION_RULES[countryCode]?.[documentType]) {
      return VALIDATION_RULES[countryCode][documentType];
    }
    return VALIDATION_RULES[documentType] || VALIDATION_RULES["ID"];
  }

  calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  calculateDaysUntilExpiry(expiryDate) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async verifyDocument(file, countryCode, documentType = null) {
    const documentConverter = new DocumentConverter();
    const conversionOptions = {
      quality: 80,
      format: "jpeg",
      width: 1700,
    };

    try {
      if (!countryCode) {
        throw new Error("Select a country");
      }

      let fileBuffer;
      let fileExtension;

      if (typeof file.buffer === "string") {
        fileExtension = path.extname(file.buffer).toLowerCase().slice(1);
        fileBuffer = fs.readFileSync(file.buffer);
      } else if (file.buffer instanceof Buffer) {
        const fileTypeResult = await fileType.fromBuffer(file.buffer);
        if (!fileTypeResult) {
          throw new Error("Unable to detect file type");
        }
        fileExtension = fileTypeResult.ext;
        fileBuffer = file.buffer;
      } else {
        throw new Error("Invalid file input. Provide file path or buffer.");
      }

      const imageTypes = ["jpg", "jpeg", "png"];

      let imageBuffers;
      if (imageTypes.includes(fileExtension)) {
        imageBuffers = [await sharp(fileBuffer).toFormat("jpeg").toBuffer()];
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}. Supported types include ${imageTypes.join(', ')}`);
      }

      const imageBuffer = imageBuffers[0];
      const base64Image = imageBuffer.toString("base64");
      const imageFileBuffer = Buffer.from(base64Image, "base64");

      const region = this.getRegionForCountry(countryCode);
      const apiUrl =
        region === "US"
          ? "https://api.idanalyzer.com"
          : `https://api-${region}.idanalyzer.com`;

      const form = new FormData();
      form.append("apikey", process.env.IDANALYZER_API_KEY);
      form.append("file", imageFileBuffer, {
        filename: "document.jpg",
        contentType: "image/jpeg",
      });
      form.append("documentType", documentType || "");
      form.append("biometric", "true");
      form.append("verify_expiry", "true");
      form.append("verify_documentnumber", "true");
      form.append("verify_age", "true");
      form.append("validate_security_features", "true");

      const headers = {
        ...form.getHeaders(),
      };

      const response = await axios.post(apiUrl, form, { headers });
      const result = response.data;

      console.log(result);

      if (!result || result.error) {
        throw new Error(result.error?.message || "ID verification failed");
      }

      const validationResults = await this.validateDocument(
        result.result,
        result.result?.document_type || documentType,
        countryCode,
      );

      const verificationResult = {
        success: validationResults.isValid,
        data: {
          documentNumber: result.result?.document_number,
          documentType: result.result?.document_type,
          expiryDate: result.result?.expiry_date,
          issueDate: result.result?.issue_date,
          issuingCountry: result.result?.country,
          firstName: result.result?.firstname,
          lastName: result.result?.lastname,
          dateOfBirth: result.result?.dob,
          age: this.calculateAge(result.result?.dob),
          address: result.result?.address,
          nationality: result.result?.nationality,
        },
        verification: {
          isValid: validationResults.isValid,
          errors: validationResults.errors,
          authenticityScore: result.result?.authenticate || 0,
          securityFeatures: result.result?.security_features || {},
          faceDetection: result.result?.face || {},
        },
        rawResult: result,
        images: {
          count: imageBuffers.length,
          format: conversionOptions.format,
          processingDetails: {
            originalFileType: fileExtension,
            conversionOptions,
          },
        },
      };

      return verificationResult;
    } catch (error) {
      throw new Error(`Document verification failed: ${error.message}`);
    }
  }
}

module.exports = {
  IDVerificationService,
};
