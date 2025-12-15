import fs from "fs";
import path from "path";

/**
 * *Validation result types
 */
interface ValidationResult {
    isValid: boolean;
    error?: string;
}

function validateInput(input: string): ValidationResult {
    const trimmed = input.trim();

    if (trimmed.length === 0) {
        return {
            isValid: false,
            error: `Input cannot be empty`,
        };
    }

    if (trimmed.includes("\0")) {
        return {
            isValid: false,
            error: `Invalid character/s in path`,
        };
    }

    const sus = [
        /\.\.[\/\\]/g, // Parent directory traversal
        /^[\/\\]+$/, // Root directory
    ];
    for (const pattern of sus) {
        if (pattern.test(trimmed)) {
            return {
                isValid: false,
                error: `Potentially unsafe path detected`,
            };
        }
    }

    if (trimmed.length > 260) {
        return {
            isValid: false,
            error: `Path is too long`,
        };
    }

    return { isValid: true };
}

function validatePath(resolvedPath: string): ValidationResult {
    try {
        if (!fs.existsSync(resolvedPath)) {
            return {
                isValid: false,
                error: `Path does not exist. ${resolvedPath}`,
            };
        }

        if (!fs.statSync(resolvedPath).isDirectory()) {
            return {
                isValid: false,
                error: `Path is not a directory`,
            };
        }

        try {
            fs.accessSync(resolvedPath, fs.constants.R_OK);
        } catch (err) {
            return {
                isValid: false,
                error: `Access Denied.`,
            };
        }

        if (fs.readdirSync(resolvedPath).length === 0) {
            return {
                isValid: false,
                error: `Empty Directory`,
            };
        }
        return {
            isValid: true,
        };
    } catch (error) {
        return {
            isValid: false,
            error: `Error accessing path. ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
        };
    }
}

function validateImageFiles(
    dirPath: string,
    extensions: string[]
): ValidationResult {
    try {
        const files = fs.readdirSync(dirPath);
        const images = files.filter((file) =>
            extensions.includes(path.extname(file).toLowerCase())
        );

        if (images.length === 0) {
            return {
                isValid: false,
                error: `No supported image files found. Accepted: ${extensions.join(
                    ", "
                )}`,
            };
        }

        return {
            isValid: true,
            error: `Found ${images.length} image(s) to compress`,
        };
    } catch (err) {
        return {
            isValid: false,
            error: `Error reading directory. ${
                err instanceof Error ? err.message : "Unknown"
            }`,
        };
    }
}

function validateSourceDir(
    input: string,
    supportedExtensions: string[]
): ValidationResult {
    const inputValidation = validateInput(input);
    if (!inputValidation.isValid) {
        return inputValidation;
    }

    const resolvePath = path.resolve(process.cwd(), input.trim());
    const pathValidation = validatePath(resolvePath);
    if (!pathValidation.isValid) {
        return pathValidation;
    }

    const filesValidation = validateImageFiles(
        resolvePath,
        supportedExtensions
    );
    return filesValidation;
}

export {
    validateInput,
    validatePath,
    validateImageFiles,
    validateSourceDir,
    type ValidationResult,
};
