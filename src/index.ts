#!/usr/bin/env node

import path from "node:path";
import fs from "fs";
import sharp from "sharp";
import { createSpinner } from "nanospinner";
import {
    getArgValue,
    getFormat,
    getOutputDir,
    validateSourceDir,
} from "./validation.js";
import { EXTENSIONS, howToUse, VERSION, welcome } from "./info.js";
import { loggerError, loggerSuccess } from "./logger.js";
import type { CompressConfig } from "./types.js";

const spinner = createSpinner("Compressing files");
const args = process.argv.slice(2);
const QUALITY_DEFAULT = 80;
const WIDTH_DEFAULT = 1080;
const OUTPUT_FORMAT_DEFAULT = "webp";
const OUTPUT_DEFAULT = "./output";

/**
 * *Initiates the application looking for parameters
 */
export async function init(): Promise<void> {
    if (args.includes("-h") || args.includes("--help")) {
        welcome();
        howToUse();
        process.exit(0);
    }
    if (args.includes("-v") || args.includes("--version")) {
        console.log(VERSION);
        process.exit(0);
    }

    const config: CompressConfig = {
        input: args[0] || "",
        quality: getArgValue(args, ["-q", "--quality"], 80),
        width: getArgValue(args, ["-w", "--width"], 1080),
        format: getFormat(args, ["f", "--format"], OUTPUT_FORMAT_DEFAULT),
        output: getOutputDir(args, ["-o", "--output"], OUTPUT_DEFAULT),
    };

    if (!config.input || config.input.startsWith("-")) {
        loggerError(`❌ Usage: comp-cli <input-dir> [options]`);
        process.exit(1);
    }

    await start(config);
}

/**
 * *Validates Inputs and calls compressor function
 * @param SourceDirectory
 * @returns
 */
async function start(config: CompressConfig) {
    const validation = validateSourceDir(config.input, EXTENSIONS);

    if (!validation.isValid) {
        loggerError(`❌ ${validation.error}`);
        process.exit(1);
    }

    if (validation.error) {
        loggerSuccess(`✅ ${validation.error}`);
    }
    const input = path.resolve(process.cwd(), config.input.trim());
    await compressImages({ ...config, input }).catch((err) => {
        throw err;
    });
}

/**
 * ! If output directory does not exist it will create ./output
 * * Compresses all the images within the provided directory
 * @param ImagesToBeCompressedSource
 */
export async function compressImages(config: CompressConfig) {
    try {
        let files = fs.readdirSync(`${config.input}`);
        let dirOutput = config.output ? config.output : OUTPUT_DEFAULT;
        let width = config.width ? config.width : WIDTH_DEFAULT;
        let quality = config.quality ? config.quality : QUALITY_DEFAULT;
        let outputFormat = config.format
            ? config.format
            : OUTPUT_FORMAT_DEFAULT;
        //Create output directory is doesn't exist
        if (!fs.existsSync(dirOutput)) {
            try {
                fs.mkdirSync(dirOutput);
            } catch (error) {
                loggerError(`❌ Cannot create output directory: ${dirOutput}`);
                throw error;
            }
        }
        const filtered = files.filter((file) =>
            EXTENSIONS.includes(path.extname(file).toLowerCase())
        );
        spinner.start();
        let completed = 0;
        const TOTAL = filtered.length;
        const jobs = filtered.map(async (file) => {
            const { name } = path.parse(file);
            const image = sharp(path.join(config.input, file));

            return image
                .resize({ width: width })
                .toFormat(OUTPUT_FORMAT_DEFAULT, { quality: quality })
                .toFile(path.join(dirOutput, `${name}.${outputFormat}`))
                .then(() => {
                    completed++;
                    spinner.update({
                        text: `Compressing ${completed}/${TOTAL}`,
                    });
                });
        });

        await Promise.all(jobs);
        spinner.success();
        loggerSuccess(`✅ Compressed ${TOTAL} images`);
        console.log(`   Input:   ${config.input}`);
        console.log(`   Output:  ${dirOutput}`);
        console.log(`   Quality: ${quality}%`);
        console.log(`   Width:   ${width}px`);
    } catch (error) {
        spinner.error();
        if (error instanceof Error) {
            if (error.message.includes("ENOENT")) {
                loggerError(`❌ File not found or inaccessible`);
            } else if (error.message.includes("EACCES")) {
                loggerError(`❌ Permission denied`);
            } else {
                loggerError(`❌ ${error.message}`);
            }
        }
        throw error;
    }
}

/**
 * *Initiates the program
 */
try {
    await init();
} catch (err) {
    loggerError("❌ Fatal error");
    if (err instanceof Error) {
        console.error(err.message);
    }
    process.exitCode = 1;
}