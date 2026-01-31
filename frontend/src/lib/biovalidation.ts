/**
 * Bio.xyz Integration - Scientific Dataset Validation
 * Mock implementation for hackathon demo
 */

export type DatasetType = 'genomic' | 'clinical' | 'imaging' | 'protein' | 'general';

export interface ValidationResult {
    isValid: boolean;
    validationType: DatasetType;
    score: number; // 0-100
    checks: {
        format: boolean;
        schema: boolean;
        integrity: boolean;
        standards: boolean;
    };
    metadata: {
        recordCount?: number;
        fields?: string[];
        standards?: string[];
        warnings?: string[];
    };
    certificate: string;
    timestamp: number;
}

// File extension to dataset type mapping
const FILE_TYPE_MAP: Record<string, DatasetType> = {
    // Genomic
    fasta: 'genomic',
    fastq: 'genomic',
    vcf: 'genomic',
    bam: 'genomic',
    sam: 'genomic',
    bed: 'genomic',
    // Clinical
    hl7: 'clinical',
    fhir: 'clinical',
    // Imaging
    dcm: 'imaging',
    dicom: 'imaging',
    nii: 'imaging',
    nifti: 'imaging',
    // Protein
    pdb: 'protein',
    cif: 'protein',
    mmcif: 'protein',
    // General data
    csv: 'general',
    json: 'general',
    xml: 'general',
    parquet: 'general',
};

// Standards by dataset type
const STANDARDS_MAP: Record<DatasetType, string[]> = {
    genomic: ['FASTA', 'VCF 4.2', 'GFF3', 'BAM/SAM'],
    clinical: ['FHIR R4', 'HL7 v3', 'OMOP CDM v5'],
    imaging: ['DICOM 3.0', 'NIfTI-1'],
    protein: ['PDB', 'mmCIF'],
    general: ['CSV RFC 4180', 'JSON Schema'],
};

/**
 * Validate a dataset file
 * Uses mock validation for demo, would connect to Bio.xyz API in production
 */
export async function validateDataset(
    file: File,
    category?: string
): Promise<ValidationResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const datasetType = FILE_TYPE_MAP[extension] || 'general';

    // Check if file extension is recognized
    const isKnownFormat = extension in FILE_TYPE_MAP;

    // Score based on file size (larger files more likely to be real datasets)
    const sizeScore = Math.min(file.size / (1024 * 1024), 50); // Max 50 points for size

    // Score based on format recognition
    const formatScore = isKnownFormat ? 30 : 10;

    // Random quality variance for demo
    const qualityVariance = Math.random() * 20;

    const totalScore = Math.min(Math.round(sizeScore + formatScore + qualityVariance), 100);
    const isValid = totalScore >= 50;

    // Generate mock validation certificate
    const certificateData = `${file.name}-${file.size}-${Date.now()}`;
    const certificate = await generateHash(certificateData);

    return {
        isValid,
        validationType: datasetType,
        score: totalScore,
        checks: {
            format: isKnownFormat,
            schema: totalScore >= 40,
            integrity: totalScore >= 30,
            standards: isKnownFormat && totalScore >= 60,
        },
        metadata: {
            recordCount: Math.floor(file.size / 100), // Mock record count
            fields: getFieldsForType(datasetType),
            standards: STANDARDS_MAP[datasetType],
            warnings: generateWarnings(totalScore, isKnownFormat),
        },
        certificate,
        timestamp: Date.now(),
    };
}

/**
 * Verify a validation certificate
 */
export async function verifyCertificate(certificate: string): Promise<boolean> {
    // In production, this would verify against Bio.xyz records
    return certificate.startsWith('0x') && certificate.length === 66;
}

// Helper functions

function getFieldsForType(type: DatasetType): string[] {
    const fieldsMap: Record<DatasetType, string[]> = {
        genomic: ['sequence_id', 'sequence', 'quality_score', 'annotations'],
        clinical: ['patient_id', 'diagnosis_code', 'treatment', 'outcome'],
        imaging: ['patient_id', 'modality', 'body_part', 'slice_thickness'],
        protein: ['pdb_id', 'chain', 'residue', 'coordinates'],
        general: ['id', 'data', 'timestamp', 'metadata'],
    };
    return fieldsMap[type];
}

function generateWarnings(score: number, isKnownFormat: boolean): string[] {
    const warnings: string[] = [];

    if (!isKnownFormat) {
        warnings.push('File format not in standard scientific dataset formats');
    }
    if (score < 60) {
        warnings.push('Dataset quality score below recommended threshold');
    }
    if (score < 40) {
        warnings.push('Consider adding metadata documentation');
    }

    return warnings;
}

async function generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get validation badge color based on score
 */
export function getValidationBadgeColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
}

/**
 * Get validation status text
 */
export function getValidationStatus(score: number): string {
    if (score >= 80) return 'Verified';
    if (score >= 60) return 'Validated';
    if (score >= 40) return 'Partial';
    return 'Unverified';
}
