#!/usr/bin/env node

import path from "node:path";
import fs from "fs";
import readline from "readline";
import sharp from "sharp";
import { createSpinner } from "nanospinner";
import { getArgValue, getOutputDir, validateSourceDir } from "./validation.js";
import { EXTENSIONS, howToUse, VERSION, welcome } from "./info.js";
import { loggerError, loggerSuccess } from "./logger.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const spinner = createSpinner("Compressing files");
const args = process.argv.slice(2);
const QUALITY_DEFAULT = 80;
const WIDTH_DEFAULT = 1080;
const OUTPUT_DEFAULT = "./output";

type InitResult = "ok" | "help" | "error" | "version";

interface CompressConfig {
    input: string;
    output?: string;
    width?: number;
    quality?: number;
}

/**
 * *Initiates the application looking for parameters
 */
export async function init(): Promise<InitResult> {
    if (args.includes("-h") || args.includes("--help")) {
        welcome();
        howToUse();
        return "help";
    }
    if (args.includes("-v") || args.includes("--version")) {
        console.log(VERSION);
        return "version";
    }

    const config: CompressConfig = {
        input: args[0] || "",
        quality: getArgValue(args, ["-q", "--quality"], 80),
        width: getArgValue(args, ["-w", "--width"], 1080),
        output: getOutputDir(args, ["-o", "--output"], OUTPUT_DEFAULT),
    };

    if (!config.input || config.input.startsWith("-")) {
        loggerError(`❌ Usage: comp-cli <input-dir> [options]`);
        return "error";
    }

    await start(config);
    return "ok";
}

/**
 * *Does the image processing after validation on source directory input
 * @param SourceDirectory
 * @returns
 */
async function start(config: CompressConfig) {
    const validation = validateSourceDir(config.input, EXTENSIONS);

    if (!validation.isValid) {
        loggerError(`❌ ${validation.error}`);
        rl.close();
        throw new Error(validation.error);
    }

    if (validation.error) {
        loggerSuccess(`✅ ${validation.error}`);
    }
    const input = path.resolve(process.cwd(), config.input.trim());
    await compressImages({ ...config, input })
        .catch((err) => {
            throw err;
        })
        .finally(() => {
            rl.close();
        });
}

/**
 * *Interactive Mode, only takes the source directory and defaults the other values
 */
async function inputSource() {
    welcome();
    howToUse();
    rl.question("Source of Images\n > ", (inputDir: string) => {
        start({ input: inputDir }).catch(() => {
            process.exitCode = 1;
        });
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
        //Create output directory is doesn't exist
        if (!fs.existsSync(dirOutput)) {
            fs.mkdirSync(dirOutput);
        }
        const filtered = files.filter((file) =>
            EXTENSIONS.includes(path.extname(file).toLowerCase())
        );
        spinner.start();
        let completed = 0;
        const TOTAL = filtered.length;
        const jobs = filtered.map((file) => {
            const { name } = path.parse(file);
            const image = sharp(path.join(config.input, file));

            return image
                .resize({ width: width })
                .toFormat("webp", { quality: quality })
                .toFile(path.join(dirOutput, `${name}.webp`))
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
 * *Initiates the program, if not params are provided it enter Interactive Mode
 */
try {
    if (args.length !== 0) {
        const result = await init();
        if (result === "error") {
            process.exitCode = 1;
        } else if (result === "help") {
            process.exitCode = 0; // Success for help
        } else if (result === "version") {
            process.exitCode = 0; // Success for help
        }
    } else {
        await inputSource();
    }
} catch (err) {
    loggerError("❌ Fatal error");
    if (err instanceof Error) {
        console.error(err.message); // Show actual error in dev
    }
    process.exitCode = 1;
}