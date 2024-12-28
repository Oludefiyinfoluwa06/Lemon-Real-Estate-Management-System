const REGION_MAPPING = {
    // European region countries
    EU: [
        'NG', 'GB', 'FR', 'DE', 'IT', 'ES', 'GH', 'ZA', 'KE',
        'EG', 'MA', 'TN', 'SN', 'CI', 'CM', 'UG', 'RW',
        'ET', 'TZ', 'MZ', 'AO', 'ZM', 'ZW', 'BW', 'NA',
        'IE', 'PT', 'BE', 'NL', 'LU', 'CH', 'AT', 'SE',
        'NO', 'DK', 'FI', 'PL', 'CZ', 'SK', 'HU', 'RO',
        'BG', 'GR', 'HR', 'RS', 'SI', 'AL', 'MT', 'CY'
    ],

    // Asia-Pacific region countries
    APAC: [
        'CN', 'JP', 'KR', 'IN', 'AU', 'NZ', 'SG', 'MY',
        'ID', 'PH', 'TH', 'VN', 'MM', 'KH', 'LA', 'BN',
        'TW', 'HK', 'MO', 'LK', 'NP', 'BD', 'PK', 'AF',
        'UZ', 'KZ', 'KG', 'TJ', 'TM', 'MN', 'BT', 'MV',
        'FJ', 'PG', 'SB', 'VU', 'NC', 'PF'
    ],

    // North American region countries
    US: [
        'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE',
        'EC', 'VE', 'BO', 'PY', 'UY', 'GY', 'SR', 'GF',
        'PA', 'CR', 'NI', 'HN', 'SV', 'GT', 'BZ', 'CU',
        'DO', 'HT', 'PR', 'JM', 'BS', 'BB', 'TT', 'LC',
        'VC', 'GD', 'AG', 'DM', 'KN', 'TC', 'VG', 'AI'
    ]
};

// Document types by country (common ID documents for each country)
const DOCUMENT_TYPES = {
    // Africa
    'NG': ['NIN', 'DL', 'PP', 'VC', 'BVN'], // Nigeria
    'GH': ['NID', 'DL', 'PP', 'VC', 'NHIS'], // Ghana
    'ZA': ['ID', 'DL', 'PP', 'RC'], // South Africa
    'KE': ['ID', 'DL', 'PP', 'AC'], // Kenya
    'EG': ['NID', 'DL', 'PP'], // Egypt

    // Europe
    'GB': ['DL', 'PP', 'RC', 'NINO'], // United Kingdom
    'FR': ['CNI', 'DL', 'PP', 'TS'], // France
    'DE': ['PA', 'DL', 'PP', 'ID'], // Germany
    'IT': ['CIE', 'DL', 'PP', 'CF'], // Italy
    'ES': ['DNI', 'DL', 'PP', 'NIE'], // Spain

    // North America
    'US': ['DL', 'PP', 'SSC', 'SC', 'MC'], // United States
    'CA': ['DL', 'PP', 'PR', 'HC'], // Canada
    'MX': ['INE', 'DL', 'PP', 'RFC'], // Mexico

    // South America
    'BR': ['RG', 'CNH', 'PP', 'CPF'], // Brazil
    'AR': ['DNI', 'DL', 'PP', 'CUIL'], // Argentina
    'CO': ['CC', 'DL', 'PP', 'CE'], // Colombia

    // Asia
    'CN': ['SFZ', 'DL', 'PP', 'HKB'], // China
    'JP': ['MY', 'DL', 'PP', 'RC'], // Japan
    'IN': ['AA', 'DL', 'PP', 'VC', 'PAN'], // India
    'SG': ['NRIC', 'DL', 'PP', 'FIN'], // Singapore
    'KR': ['RRC', 'DL', 'PP', 'ARC'], // South Korea

    // Oceania
    'AU': ['DL', 'PP', 'MC', 'KC'], // Australia
    'NZ': ['DL', 'PP', 'BC', 'CC']  // New Zealand
};

// Document type descriptions for reference
const DOCUMENT_TYPE_DESCRIPTIONS = {
    // Generic Documents
    'PP': 'Passport',
    'DL': 'Driver\'s License',
    'ID': 'National ID Card',
    'BC': 'Birth Certificate',
    'RC': 'Residence Card',

    // Nigeria
    'NIN': 'National Identity Number Card',
    'BVN': 'Bank Verification Number Card',
    'VC': 'Voter\'s Card',

    // UK
    'NINO': 'National Insurance Number Card',

    // France
    'CNI': 'Carte Nationale d\'Identité',
    'TS': 'Titre de Séjour',

    // Germany
    'PA': 'Personalausweis',

    // Italy
    'CIE': 'Carta d\'Identità Elettronica',
    'CF': 'Codice Fiscale',

    // Spain
    'DNI': 'Documento Nacional de Identidad',
    'NIE': 'Número de Identidad de Extranjero',

    // USA
    'SSC': 'Social Security Card',
    'SC': 'State ID Card',
    'MC': 'Medicare Card',

    // India
    'AA': 'Aadhaar Card',
    'PAN': 'Permanent Account Number Card',

    // China
    'SFZ': 'Resident Identity Card',
    'HKB': 'Hukou Book',

    // Singapore
    'NRIC': 'National Registration Identity Card',
    'FIN': 'Foreign Identification Number',

    // Brazil
    'RG': 'Registro Geral',
    'CNH': 'Carteira Nacional de Habilitação',
    'CPF': 'Cadastro de Pessoas Físicas',

    // Mexico
    'INE': 'Instituto Nacional Electoral Card',
    'RFC': 'Registro Federal de Contribuyentes'
};

const VALIDATION_RULES = {
    // Generic document types
    'PP': {
        expiryRequired: true,
        ageCheck: true,
        photoRequired: true,
        mrzRequired: true,
        minAge: 0,
        maxAge: 100,
        expiryMinDays: 90,
        documentNumberFormat: /^[A-Z0-9]{6,12}$/,
        securityFeatures: ['UV', 'MRZ', 'HOLOGRAM'],
        requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'nationality', 'documentNumber', 'expiryDate']
    },
    'DL': {
        expiryRequired: true,
        ageCheck: true,
        photoRequired: true,
        addressRequired: true,
        minAge: 16,
        maxAge: 100,
        expiryMinDays: 30,
        documentNumberFormat: /^[A-Z0-9]{4,20}$/,
        securityFeatures: ['BARCODE', 'HOLOGRAM'],
        requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'address', 'documentNumber', 'expiryDate', 'vehicleCategories']
    },
    'ID': {
        expiryRequired: false,
        ageCheck: true,
        photoRequired: true,
        addressRequired: true,
        minAge: 0,
        maxAge: 100,
        documentNumberFormat: /^[A-Z0-9-]{4,20}$/,
        securityFeatures: ['HOLOGRAM', 'BARCODE'],
        requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'nationality', 'documentNumber']
    },

    // Country-specific rules
    'NG': {
        'NIN': {
            expiryRequired: false,
            ageCheck: true,
            photoRequired: true,
            minAge: 16,
            documentNumberFormat: /^\d{11}$/,
            securityFeatures: ['QR', 'BARCODE'],
            requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'nationality', 'documentNumber']
        },
        'BVN': {
            expiryRequired: false,
            ageCheck: true,
            photoRequired: false,
            documentNumberFormat: /^\d{11}$/,
            requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'documentNumber']
        }
    },
    'US': {
        'SSC': {
            expiryRequired: false,
            ageCheck: false,
            photoRequired: false,
            documentNumberFormat: /^\d{3}-\d{2}-\d{4}$/,
            requiredFields: ['surname', 'givenNames', 'documentNumber']
        }
    },
    'GB': {
        'NINO': {
            expiryRequired: false,
            ageCheck: true,
            photoRequired: false,
            minAge: 16,
            documentNumberFormat: /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D\s]$/,
            requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'documentNumber']
        }
    }
};

const SECURITY_FEATURE_REQUIREMENTS = {
    'UV': {
        minConfidence: 0.8,
        requiredElements: ['UV_FIBERS', 'UV_PORTRAIT']
    },
    'MRZ': {
        minConfidence: 0.9,
        checkDigitValidation: true
    },
    'HOLOGRAM': {
        minConfidence: 0.85,
        requiredElements: ['HOLOGRAPHIC_PORTRAIT', 'KINEGRAM']
    },
    'BARCODE': {
        minConfidence: 0.95,
        validateContent: true,
        crossValidateWithOCR: true
    },
    'QR': {
        minConfidence: 0.95,
        validateContent: true,
        validateSignature: true
    }
};

module.exports = {
    REGION_MAPPING,
    DOCUMENT_TYPES,
    DOCUMENT_TYPE_DESCRIPTIONS,
    VALIDATION_RULES,
    SECURITY_FEATURE_REQUIREMENTS
};
