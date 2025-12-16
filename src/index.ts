#!/usr/bin/env node

import path from "node:path";
import fs from "fs";
import readline from "readline";
import sharp from "sharp";
import { createSpinner } from "nanospinner";
import { getArgValue, getOutputDir, validateSourceDir } from "./validation.js";
import { EXTENSIONS, howToUse, welcome } from "./info.js";
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

interface CompressConfig {
    input: string;
    output?: string;
    width?: number;
    quality?: number;
}

/**
 * *Initiates the application looking for parameters
 */
function init() {
    if (args.includes("-h") || args.includes("--help")) {
        welcome();
        howToUse();
        process.exit(0);
    }

    const config: CompressConfig = {
        input: args[0] || "",
        quality: getArgValue(args, ["-q", "--quality"], 80),
        width: getArgValue(args, ["-w", "--width"], 1080),
        output: getOutputDir(args, ["-o", "--output"], OUTPUT_DEFAULT),
    };

    if (!config.input || config.input.startsWith("-")) {
        loggerError(`❌ Usage: comp-cli <input-dir> [options]`);
        process.exit(1);
    }

    start(config);
}

/**
 * *Does the image processing after validation on source directory input
 * @param SourceDirectory
 * @returns
 */
function start(config: CompressConfig) {
    const validation = validateSourceDir(config.input, EXTENSIONS);

    if (!validation.isValid) {
        loggerError(`❌ ${validation.error}`);
        rl.close();
        return;
    }

    if (validation.error) {
        loggerSuccess(`✅ ${validation.error}`);
    }
    const input = path.resolve(process.cwd(), config.input.trim());
    compressImages({ ...config, input })
        .catch((err) => {
            process.exit(1);
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
    rl.question(
        "Source of Images\n > ",
        (
            inputDir: string,
            outputDir?: string,
            Iwidth?: number,
            Iquality?: number
        ) => {
            start({ input: inputDir });
        }
    );
}

/**
 * ! If output directory does not exist it will create ./output
 * * Compresses all the images within the provided directory
 * @param ImagesToBeCompressedSource
 */
async function compressImages(config: CompressConfig) {
    // Takes the images from the directory indicated in the first argument
    try {
        let files = fs.readdirSync(`${config.input}`);
        let dirOutput = config.output ? config.output : OUTPUT_DEFAULT;
        let width = config.width ? config.width : WIDTH_DEFAULT;
        let quality = config.quality ? config.quality : QUALITY_DEFAULT;
        //Create output directory is doesn't exist
        if (!fs.existsSync(dirOutput)) {
            fs.mkdirSync(dirOutput);
        }
        spinner.start();
        let completed = 0;
        const TOTAL = files.filter((file) =>
            EXTENSIONS.includes(path.extname(file).toLocaleLowerCase())
        ).length;
        const jobs = files
            .filter((file) =>
                EXTENSIONS.includes(path.extname(file).toLowerCase())
            )
            .map((file) => {
                const { name, ext } = path.parse(file);
                completed++;
                spinner.update({ text: `Compressing ${completed}/${TOTAL}` });

                const image = sharp(path.join(config.input, file));

                return image
                    .resize({ width: width })
                    .toFormat("webp", { quality: quality })
                    .toFile(path.join(dirOutput, `${name}.webp`));
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
console.clear();
if (args.length !== 0) {
    init();
} else {
    await inputSource();
}
