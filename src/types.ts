export type outputFormat = "webp" | "jpeg" | "avif" | "png";

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface CompressConfig {
    input: string;
    output?: string;
    width?: number;
    quality?: number;
    format?: outputFormat;
}
