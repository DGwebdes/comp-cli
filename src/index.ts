#!/usr/bin/env node

import path from "node:path";
import fs from "fs";
import readline from "readline";
import sharp from "sharp";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { validateSourceDir } from "./validation.js";
import { EXTENSIONS, howToUse, welcome } from "./info.js";
import { loggerError, loggerSuccess } from "./logger.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const spinner = createSpinner("Compressing");
const OUTPUT: string = "./output";

async function inputSource() {
    rl.question("Source of Images\n ", (inputDir) => {
        const validation = validateSourceDir(inputDir, EXTENSIONS);

        if (!validation.isValid) {
            loggerError(`❌ ${validation.error}`);
            rl.close();
            return;
        }

        if (validation.error) {
            loggerSuccess(`✅ ${validation.error}`);
        }
        const input = path.resolve(process.cwd(), inputDir.trim());
        console.log(chalk.red(input));
        compressImages(input);
    });
}

async function compressImages(argInput: string) {
    // Takes the images from the directory indicated in the first argument
    try {
        let files = fs.readdirSync(`${argInput}`);
        if (!fs.existsSync(OUTPUT)) {
            fs.mkdirSync(OUTPUT);
        }
        spinner.start();
        const jobs = files.map((file) => {
            const filename = file;
            const { name, ext } = path.parse(filename);

            // Compresses images and converts to webp
            const image = sharp(path.join(argInput, filename));

            return image
                .resize({ width: 1080 })
                .toFormat("webp", { quality: 80 })
                .toFile(path.join(OUTPUT, `${name}.webp`));
        });

        await Promise.all(jobs);
        spinner.success();
        loggerSuccess(`Files Compressed`);
    } catch (error) {
        spinner.error();
        loggerError(`Sorry, something went wrong ${error}`);
        process.exit(1);
    } finally {
        rl.close();
    }
    // Returns compressed images to either the directory destination indicated on the output argument or the same input directory if no output is given
}

console.clear();
welcome();
howToUse();
await inputSource();
